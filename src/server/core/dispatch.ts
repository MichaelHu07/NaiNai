import {randomUUID} from 'node:crypto';
import {ToolActionSchema} from '../../shared/contracts';
import type {DispatchRecord,ProviderEvent,ToolAction} from '../../shared/contracts';
import {AppError,digest,NaiNaiCore} from './store';
type Options={mode:'fixture'|'live';provider:string;canSend:(record:DispatchRecord)=>boolean;send:(record:DispatchRecord)=>Promise<{providerActionId:string}>;now?:()=>Date};
/** Durable network boundary. Not wired to a live provider in the fixture app. */
export class DispatchJournal {
 private now:()=>Date;
 constructor(private core:NaiNaiCore,private options:Options){this.now=options.now??(()=>new Date());}
 private record(id:string){const record=this.core.read<DispatchRecord>('dispatch',id);if(!record)throw new AppError('NOT_FOUND','Dispatch not found.',404);return record;}
 private release(id:string){if(this.core.read<{id:string}>('outreach_lock','global')?.id===id)this.core.remove('outreach_lock','global');}
 prepareDispatch(action:Extract<ToolAction,{kind:'request_quote'}>,buyerId:string):DispatchRecord{
  const parsed=ToolActionSchema.parse(action);if(parsed.kind!=='request_quote')throw new AppError('INVALID_ACTION','Only quote requests use external dispatch.');
  if(this.options.mode!=='live')throw new AppError('LIVE_DISABLED','Fixture mode cannot send external actions.',403);
  return this.core.transaction(()=>{
   const packet=this.core.loadPacket(parsed.caseId,buyerId),campaign=this.core.campaign(buyerId);const payloadHash=digest(parsed),key=`${buyerId}:${parsed.idempotencyKey}`;const prior=this.core.read<{id:string;payloadHash:string}>('dispatch_keys',key);
   if(prior){if(prior.payloadHash!==payloadHash)throw new AppError('IDEMPOTENCY_CONFLICT','Action key reused for a different payload.',409);return this.record(prior.id);}
   if(campaign.paused||packet.revisions.request!==parsed.requestRevision||packet.revisions.permission!==parsed.permissionRevision)throw new AppError('AUTHORITY_CHANGED','Current permission/request required.',409);
   if(this.core.read('outreach_lock','global')||campaign.sessions.some(s=>s.status==='active'||s.status==='pending'||s.stopStatus==='pending'))throw new AppError('SESSION_ACTIVE','An active or uncertain conversation already holds the global slot.',409);
   const suppliers=new Set(this.core.list<DispatchRecord>('dispatch').map(r=>r.supplierId));suppliers.add(parsed.supplierId);if(suppliers.size>5)throw new AppError('SUPPLIER_LIMIT','At most five approved suppliers across both cases.',409);
   const timestamp=this.now().toISOString();const record:DispatchRecord={id:randomUUID(),workspaceId:'live',buyerId,caseId:parsed.caseId,supplierId:parsed.supplierId,endpointId:parsed.endpointId,sessionId:parsed.sessionId,text:parsed.text,kind:'request_quote',purpose:parsed.purpose,requestRevision:parsed.requestRevision,permissionRevision:parsed.permissionRevision,cancellationRevision:campaign.cancellationRevision,idempotencyKey:parsed.idempotencyKey,payloadHash,providerActionId:null,createdAt:timestamp,updatedAt:timestamp,deadlineAt:new Date(this.now().getTime()+180000).toISOString(),status:'prepared'};
   if(!this.options.canSend(record))throw new AppError('NO_AUTHORITY','Specific supplier and endpoint authority required.',403);
   this.core.write('dispatch',record.id,record);this.core.write('dispatch_keys',key,{id:record.id,payloadHash});this.core.write('outreach_lock','global',{id:record.id});return record;
  });
 }
 async dispatchPrepared(id:string):Promise<DispatchRecord>{
  const next=this.core.transaction(()=>{const record=this.record(id);if(record.status!=='prepared')return {record,send:false};const packet=this.core.loadPacket(record.caseId,record.buyerId),campaign=this.core.campaign(record.buyerId);
   if(this.options.mode!=='live'||campaign.paused||campaign.cancellationRevision!==record.cancellationRevision||packet.revisions.permission!==record.permissionRevision||packet.revisions.request!==record.requestRevision||this.now().getTime()>=Date.parse(record.deadlineAt)||!this.options.canSend(record)){record.status='cancelled';this.release(id);this.core.write('dispatch',id,record);return {record,send:false};}
   record.status='sending';record.updatedAt=this.now().toISOString();this.core.write('dispatch',id,record);return {record,send:true};});
  if(!next.send)return next.record;
  try{const result=await this.options.send(next.record);return this.core.transaction(()=>{const record=this.record(id);record.providerActionId=result.providerActionId;if(record.status==='sending')record.status='acknowledged';record.updatedAt=this.now().toISOString();this.core.write('dispatch',id,record);return record;});}
  catch{const record=this.record(id);if(record.status==='sending')record.status='delivery_unknown';record.updatedAt=this.now().toISOString();this.core.write('dispatch',id,record);return record;}
 }
 recoverPendingActions(){this.core.transaction(()=>{for(const record of this.core.list<DispatchRecord>('dispatch')){if(record.status==='sending'){record.status='delivery_unknown';this.core.write('dispatch',record.id,record);this.core.write('outreach_lock','global',{id:record.id});}else if(record.status==='prepared'){record.status='cancelled';this.core.write('dispatch',record.id,record);this.release(record.id);}}});}
 ingestAuthenticatedEvent(event:ProviderEvent):'applied'|'duplicate'|'ignored'{
  if(event.provider!==this.options.provider)throw new AppError('BAD_PROVIDER','Event does not match this provider.',403);
  return this.core.transaction(()=>{const receiptKey=`${event.provider}:${event.eventId}`,previous=this.core.read<{hash:string}>('callback_receipts',receiptKey),hash=digest(event);
   if(previous){if(previous.hash!==hash)throw new AppError('REPLAY_CONFLICT','Event ID reused with a different payload.',409);return 'duplicate';}
   const record=this.record(event.sessionId);this.core.write('callback_receipts',receiptKey,{hash});if(['cancelled','failed_before_send','completed','failed_after_send'].includes(record.status))return 'ignored';
   if(event.kind==='ended'||event.kind==='failed'){record.status=event.kind==='ended'?'completed':'failed_after_send';this.release(record.id);}else if(event.kind==='started'||event.kind==='action_acknowledged'){record.status='acknowledged';}
   record.updatedAt=this.now().toISOString();this.core.write('dispatch',record.id,record);return 'applied';
  });
 }
}
