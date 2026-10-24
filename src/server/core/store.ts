import {DatabaseSync} from 'node:sqlite';
import {createHash,randomUUID} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {CaseRequestSchema,QuoteSnapshotSchema,RevisionsSchema,ScenarioSchema} from '../../shared/contracts';
import type {Assessment,AssessmentContext,CampaignState,CaseRequest,EvidenceRef,FixtureScenario,PacketSnapshot,QuoteSnapshot,ReviewRecord,Revisions,SessionState} from '../../shared/contracts';
import {makeFixture,seedCases} from '../../shared/seeds';

export class AppError extends Error {
 constructor(public code:string,message:string,public status=400){super(message);}
}
type StoredCase={request:CaseRequest;quote:QuoteSnapshot|null;evidence:EvidenceRef[];context:AssessmentContext;revisions:Revisions;quoteCounter:number;sharing:boolean};
type Options={databasePath:string;buyerId?:string;now?:()=>Date;assess:(request:CaseRequest,quote:QuoteSnapshot|null,context:AssessmentContext)=>Assessment;createConversation?:(input:{request:CaseRequest;sessionId:string;supplierId:string;permissionRevision:number;now?:string})=>SessionState};
export const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const clone=<T>(value:T):T=>structuredClone(value);
const sameRevisions=(a:Revisions,b:Revisions)=>a.request===b.request&&a.quote===b.quote&&a.evidence===b.evidence&&a.permission===b.permission;

/** One process owns this durable store. Transactions contain no network awaits. */
export class NaiNaiCore {
 readonly db:DatabaseSync;
 readonly buyerId:string;
 private now:()=>Date;
 constructor(private options:Options){
  this.buyerId=options.buyerId??'buyer';this.now=options.now??(()=>new Date());
  if(options.databasePath!==':memory:')mkdirSync(dirname(options.databasePath),{recursive:true});
  this.db=new DatabaseSync(options.databasePath);
  this.db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=3000; CREATE TABLE IF NOT EXISTS documents (collection TEXT NOT NULL,id TEXT NOT NULL,body TEXT NOT NULL,PRIMARY KEY(collection,id));');
  this.transaction(()=>{
   for(const request of seedCases)if(!this.read<StoredCase>('cases',request.caseId)){
    const fixture=makeFixture(request,'complete',this.now().toISOString());
    this.write('cases',request.caseId,{request:clone(request),...fixture,revisions:{request:1,quote:1,evidence:1,permission:1},quoteCounter:1,sharing:true});
   }
   if(!this.read('campaign','main'))this.write('campaign','main',{paused:false,cancellationRevision:1,jobs:[],sessions:[],counts:{observations:0,suppliersContacted:0,replies:0,confirmedQuotes:0,fixtureSessions:0}} satisfies CampaignState);
  });
 }
 read<T>(collection:string,id:string):T|null {const row=this.db.prepare('SELECT body FROM documents WHERE collection=? AND id=?').get(collection,id) as {body:string}|undefined;return row?JSON.parse(row.body) as T:null;}
 write(collection:string,id:string,value:unknown):void {this.db.prepare('INSERT INTO documents(collection,id,body) VALUES(?,?,?) ON CONFLICT(collection,id) DO UPDATE SET body=excluded.body').run(collection,id,JSON.stringify(value));}
 remove(collection:string,id:string):void {this.db.prepare('DELETE FROM documents WHERE collection=? AND id=?').run(collection,id);}
 list<T>(collection:string):T[]{return (this.db.prepare('SELECT body FROM documents WHERE collection=? ORDER BY id').all(collection) as {body:string}[]).map(row=>JSON.parse(row.body) as T);}
 transaction<T>(operation:()=>T):T {this.db.exec('BEGIN IMMEDIATE');try{const result=operation();this.db.exec('COMMIT');return result;}catch(error){this.db.exec('ROLLBACK');throw error;}}
 private owner(buyerId:string){if(buyerId!==this.buyerId)throw new AppError('FORBIDDEN','This workspace belongs to another buyer.',403);}
 private state(caseId:string):StoredCase {const state=this.read<StoredCase>('cases',caseId);if(!state)throw new AppError('NOT_FOUND','Case not found.',404);return state;}
 private expected(state:StoredCase,expected:Revisions){const parsed=RevisionsSchema.parse(expected);if(!sameRevisions(state.revisions,parsed))throw new AppError('STALE_REVISION','Terms or permissions changed. Reload and review the current findings.',409);}
 listCases(buyerId:string):CaseRequest[]{this.owner(buyerId);return this.list<StoredCase>('cases').map(state=>state.request);}
 private snapshot(state:StoredCase):Omit<PacketSnapshot,'review'>{
  return {workspaceId:'fixture',case:clone(state.request),quote:clone(state.quote),evidence:state.evidence.map(item=>({...item,permissions:{...item.permissions,sharing:state.sharing&&item.permissions.sharing},...(!item.permissions.display?{excerpt:'[Redacted: display permission withdrawn]',sourceUrl:null}:{})})),context:clone(state.context),revisions:clone(state.revisions),assessment:this.options.assess(state.request,state.quote,{...state.context,now:this.now().toISOString()})};
 }
 private validity(quote:QuoteSnapshot|null,at=this.now().getTime()){if(!quote)return 'absent';if(!quote.expiresAt||!Number.isFinite(Date.parse(quote.expiresAt)))return 'unknown';return Date.parse(quote.expiresAt)>at?'current':'expired';}
 private reviewId(caseId:string,state:StoredCase){const revisions=state.revisions;return `review-${digest([this.buyerId,caseId,revisions.request,revisions.quote??'absent',revisions.evidence,revisions.permission,this.validity(state.quote)])}`;}
 private current(state:StoredCase,review:ReviewRecord){return sameRevisions(state.revisions,review.revisions)&&this.validity(state.quote)===this.validity(review.packet.quote,Date.parse(review.reviewedAt));}
 loadPacket(caseId:string,buyerId:string):PacketSnapshot {this.owner(buyerId);const state=this.state(caseId);const review=this.read<ReviewRecord>('reviews',this.reviewId(caseId,state));return {...this.snapshot(state),review:review&&this.current(state,review)?review:null};}
 async reviewQuotePacket(input:{caseId:string;expectedRevisions:Revisions;idempotencyKey:string},buyerId:string):Promise<ReviewRecord>{
  this.owner(buyerId);if(!input.idempotencyKey||input.idempotencyKey.length>160)throw new AppError('INVALID_KEY','A bounded idempotency key is required.');
  return this.transaction(()=>{
   const state=this.state(input.caseId);this.expected(state,input.expectedRevisions);
   const payloadHash=digest([input.caseId,input.expectedRevisions,this.validity(state.quote)]);const keyId=`${buyerId}:${input.idempotencyKey}`;
   const oldKey=this.read<{payloadHash:string;reviewId:string}>('review_keys',keyId);
   if(oldKey&&oldKey.payloadHash!==payloadHash)throw new AppError('IDEMPOTENCY_CONFLICT','This action key was used for different findings.',409);
   const reviewId=this.reviewId(input.caseId,state);let review=this.read<ReviewRecord>('reviews',reviewId);
   if(!review){review={id:reviewId,buyerId,reviewedAt:this.now().toISOString(),revisions:clone(state.revisions),packet:this.snapshot(state)};this.write('reviews',reviewId,review);}
   this.write('review_keys',keyId,{payloadHash,reviewId});return review;
  });
 }
 exportPacket(reviewId:string,buyerId:string):string{
  this.owner(buyerId);const review=this.read<ReviewRecord>('reviews',reviewId);if(!review||review.buyerId!==buyerId)throw new AppError('NOT_FOUND','Review not found.',404);
  const state=this.state(review.packet.case.caseId);const exported=clone(review);
  exported.packet.evidence=exported.packet.evidence.map(item=>{
   const current=state.evidence.find(existing=>existing.id===item.id);const permitted=state.sharing&&current?.permissions.display&&current.permissions.sharing;
   return permitted?item:{...item,sourceUrl:null,excerpt:'[Redacted: sharing permission withdrawn]',permissions:{display:false,sharing:false,recording:false}};
  });
  return JSON.stringify({...exported,currentReview:this.current(state,review),notice:'Nonbinding reviewed findings. Synthetic supplier terms and sandbox tax. No purchase, acceptance, reservation or realized savings.'},null,2);
 }
 updateRequest(caseId:string,request:CaseRequest,expected:Revisions,buyerId:string):PacketSnapshot{
  this.owner(buyerId);const parsed=CaseRequestSchema.parse(request);
  this.transaction(()=>{const state=this.state(caseId);this.expected(state,expected);if(parsed.caseId!==caseId||parsed.category!==state.request.category||parsed.intent!==state.request.intent)throw new AppError('SCOPE_MISMATCH','Case identity and intent cannot change.');state.request={...parsed,requestRevision:state.revisions.request+1};state.revisions.request++;this.write('cases',caseId,state);});
  return this.loadPacket(caseId,buyerId);
 }
 updateQuote(caseId:string,quote:QuoteSnapshot,expected:Revisions,buyerId:string):PacketSnapshot{
  this.owner(buyerId);const parsed=QuoteSnapshotSchema.parse(quote);
  this.transaction(()=>{const state=this.state(caseId);this.expected(state,expected);if(parsed.caseId!==caseId||parsed.intent!==state.request.intent||parsed.requirements.category!==state.request.category||!parsed.supplierId.startsWith('fixture-'))throw new AppError('SCOPE_MISMATCH','Only this case\'s synthetic quote can be changed.');
   const now=this.now().toISOString();state.quoteCounter++;const artifactId=`${caseId}-fixture-evidence-${state.revisions.evidence+1}`;
   const excerpt=`SYNTHETIC QUOTE REVISION / SANDBOX TAX. ${JSON.stringify(parsed)}`;
   const artifact:EvidenceRef={id:artifactId,revision:1,caseId,intent:state.request.intent,origin:'synthetic_fixture',supplierId:parsed.supplierId,sourceUrl:null,sourceLabel:'Synthetic changed terms / sandbox tax',excerpt,recordedAt:now,expiresAt:parsed.expiresAt,artifactHash:createHash('sha256').update(excerpt).digest('hex'),provider:null,runId:null,verification:'synthetic_verified',permissions:{display:true,sharing:state.sharing,recording:false}};
   state.quote={...parsed,quoteRevision:state.quoteCounter,recordedAt:now,evidenceIds:[artifactId]};state.evidence.push(artifact);state.revisions.quote=state.quoteCounter;state.revisions.evidence++;this.write('cases',caseId,state);
  });return this.loadPacket(caseId,buyerId);
 }
 setScenario(caseId:string,scenario:FixtureScenario,expected:Revisions,buyerId:string):PacketSnapshot{
  this.owner(buyerId);ScenarioSchema.parse(scenario);this.transaction(()=>{const state=this.state(caseId);this.expected(state,expected);const fixture=makeFixture(state.request,scenario,this.now().toISOString());state.quoteCounter++;const suffix=state.revisions.evidence+1;
   fixture.evidence=fixture.evidence.map(e=>({...e,id:`${e.id}-${suffix}`,permissions:{...e.permissions,sharing:state.sharing}}));
   if(fixture.quote){fixture.quote.quoteRevision=state.quoteCounter;fixture.quote.evidenceIds=fixture.evidence.map(e=>e.id);}
   state.quote=fixture.quote;state.context=fixture.context;state.evidence.push(...fixture.evidence);state.revisions.quote=fixture.quote?.quoteRevision??null;state.revisions.evidence++;this.write('cases',caseId,state);
  });return this.loadPacket(caseId,buyerId);
 }
 setSharing(caseId:string,sharing:boolean,expected:Revisions,buyerId:string):PacketSnapshot{
  this.owner(buyerId);this.transaction(()=>{const state=this.state(caseId);this.expected(state,expected);state.sharing=sharing;state.revisions.permission++;state.evidence=state.evidence.map(e=>({...e,permissions:{...e.permissions,sharing}}));this.write('cases',caseId,state);});return this.loadPacket(caseId,buyerId);
 }
 campaign(buyerId:string):CampaignState{this.owner(buyerId);return this.read<CampaignState>('campaign','main')!;}
 pause(buyerId:string,paused=true):CampaignState{this.owner(buyerId);return this.transaction(()=>{const campaign=this.campaign(buyerId);campaign.paused=paused;campaign.cancellationRevision++;this.write('campaign','main',campaign);return campaign;});}
 startFixtureConversation(caseId:string,key:string,expected:Revisions,buyerId:string):CampaignState{
  this.owner(buyerId);if(!key||key.length>160)throw new AppError('INVALID_KEY','Action key required.');
  return this.transaction(()=>{const state=this.state(caseId);this.expected(state,expected);const campaign=this.campaign(buyerId);const old=this.read<{caseId:string;revisionHash:string}>('conversation_keys',key);
   if(old){if(old.caseId!==caseId||old.revisionHash!==digest(expected))throw new AppError('IDEMPOTENCY_CONFLICT','Action key belongs to another request.',409);return campaign;}
   if(campaign.paused)throw new AppError('PAUSED','Resume the rehearsal before starting.',409);
   if(campaign.sessions.some(s=>s.status==='active'||s.status==='pending'||s.stopStatus==='pending'))throw new AppError('SESSION_ACTIVE','Only one conversation can be active across both cases.',409);
   if(!this.options.createConversation)throw new AppError('INTEGRATION_UNAVAILABLE','Conversation adapter not configured.',503);
   const session=this.options.createConversation({request:state.request,sessionId:randomUUID(),supplierId:state.quote?.supplierId??`fixture-${caseId}`,permissionRevision:state.revisions.permission,now:this.now().toISOString()});campaign.sessions.push(session);campaign.counts.fixtureSessions++;this.write('campaign','main',campaign);this.write('session_revisions',session.sessionId,clone(state.revisions));this.write('conversation_keys',key,{caseId,revisionHash:digest(expected)});return campaign;
  });
 }
 changeSession(sessionId:string,buyerId:string,transition:(session:SessionState)=>SessionState,requireCurrent=false):SessionState{
  this.owner(buyerId);return this.transaction(()=>{const campaign=this.campaign(buyerId);const index=campaign.sessions.findIndex(s=>s.sessionId===sessionId);if(index<0)throw new AppError('NOT_FOUND','Session not found.',404);const existing=campaign.sessions[index];if(requireCurrent){const starting=this.read<Revisions>('session_revisions',sessionId);if(!starting)throw new AppError('STALE_REVISION','This session has no current request binding; stop it and start a new rehearsal.',409);this.expected(this.state(existing.caseId),starting);}const updated=transition(clone(existing));campaign.sessions[index]=updated;this.write('campaign','main',campaign);return updated;});
 }
 recoverSessions():void{this.transaction(()=>{const campaign=this.campaign(this.buyerId);let interrupted=false;for(const session of campaign.sessions)if(session.status==='active'||session.status==='pending'||session.stopStatus==='pending'){interrupted=true;session.status='failed';session.control='human';session.stopStatus='confirmed';session.events.push({id:randomUUID(),at:this.now().toISOString(),role:'system',text:'Synthetic session interrupted by server restart. Nothing was sent externally; start a new rehearsal explicitly.',origin:'synthetic_fixture'});}if(interrupted){campaign.paused=true;campaign.cancellationRevision++;this.write('campaign','main',campaign);}});}
 close(){this.db.close();}
}
