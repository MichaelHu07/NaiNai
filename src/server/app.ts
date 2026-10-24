import express from 'express';
import type {Request,Response,NextFunction} from 'express';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {join,resolve} from 'node:path';
import {existsSync} from 'node:fs';
import {z} from 'zod';
import {CaseRequestSchema,QuoteSnapshotSchema,RevisionsSchema,ScenarioSchema,ToolActionSchema} from '../shared/contracts';
import type {ProviderHealth,SessionState} from '../shared/contracts';
import {makeFixture} from '../shared/seeds';
import {assessTable} from './evidence/table';
import {assessGpu} from './evidence/gpu';
import {createFixtureConversation,advanceFixtureConversation,takeOverFixtureSession,requestFixtureStop,acknowledgeFixtureStop} from './voice/negotiator';
import {AppError,digest,NaiNaiCore} from './core/store';

type AuthSession={buyerId:string;csrfToken:string;expiresAt:number};
type AppOptions={dataDir:string;passphrase:string;allowedOrigins?:string[];now?:()=>Date};
const conversationInput=z.object({expectedRevisions:RevisionsSchema,idempotencyKey:z.string().min(1).max(160)}).strict();
const reviewInput=conversationInput.extend({expectedReviewBasis:z.string().regex(/^[a-f0-9]{64}$/)});
const param=(req:Request,key:string)=>{const value=req.params[key];if(typeof value!=='string')throw new AppError('INVALID_INPUT','Invalid identifier.');return value;};

export function createApp(options:AppOptions){
 if(!options.passphrase||options.passphrase==='REPLACE_ME'||options.passphrase.length<12)throw new Error('A real local access key of at least 12 characters is required. Provider keys remain placeholders.');
 const now=options.now??(()=>new Date());
 const core=new NaiNaiCore({databasePath:join(options.dataDir,'nainai.sqlite'),now,assess:(request,quote,context)=>request.category==='table'?assessTable(request,quote,context):assessGpu(request,quote,context),createConversation:createFixtureConversation});
 const app=express();app.disable('x-powered-by');app.set('trust proxy',false);app.use(express.json({limit:'256kb'}));
 const origins=new Set(options.allowedOrigins??['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:3001','http://localhost:3001']);
 const failures=new Map<string,{count:number;until:number}>();
 app.use((_req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',"frame-ancestors 'none'");next();});
 const session=(req:Request):AuthSession|null=>{const token=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith('nainai_session='))?.slice('nainai_session='.length);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;const value=core.read<AuthSession>('auth',digest(token));return value&&value.expiresAt>now().getTime()?value:null;};
 const checkOrigin=(req:Request)=>{if(!req.headers.origin||!origins.has(req.headers.origin))throw new AppError('BAD_ORIGIN','This mutation must originate from the local NaiNai interface.',403);};
 app.get('/api/auth/session',(req,res)=>{const auth=session(req);res.json(auth?{authenticated:true,csrfToken:auth.csrfToken}:{authenticated:false});});
 app.post('/api/auth/login',(req,res)=>{
  checkOrigin(req);const body=z.object({passphrase:z.string().max(500)}).strict().parse(req.body);const key=req.ip??'local';const failed=failures.get(key);
  if(failed&&failed.until>now().getTime()&&failed.count>=5)throw new AppError('RATE_LIMITED','Too many attempts. Try again in a minute.',429);
  if(!timingSafeEqual(Buffer.from(digest(body.passphrase),'hex'),Buffer.from(digest(options.passphrase),'hex'))){failures.set(key,{count:failed&&failed.until>now().getTime()?failed.count+1:1,until:now().getTime()+60000});throw new AppError('UNAUTHENTICATED','The local access key is incorrect.',401);}
  failures.delete(key);const token=randomBytes(32).toString('hex'),csrfToken=randomBytes(24).toString('hex');core.write('auth',digest(token),{buyerId:core.buyerId,csrfToken,expiresAt:now().getTime()+86400000} satisfies AuthSession);
  res.cookie('nainai_session',token,{httpOnly:true,sameSite:'strict',secure:req.secure,path:'/',maxAge:86400000});res.json({csrfToken});
 });
 app.use('/api',(req,res,next)=>{const auth=session(req);if(!auth)return next(new AppError('UNAUTHENTICATED','Unlock the local workspace first.',401));res.locals.buyerId=auth.buyerId;if(!['GET','HEAD','OPTIONS'].includes(req.method)){try{checkOrigin(req);if(req.header('x-csrf-token')!==auth.csrfToken)throw new AppError('BAD_CSRF','Refresh the page and try again.',403);}catch(error){return next(error);}}next();});
 app.post('/api/auth/logout',(req,res)=>{const token=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith('nainai_session='))?.slice('nainai_session='.length);if(token)core.remove('auth',digest(token));res.clearCookie('nainai_session',{path:'/'});res.json({ok:true});});
 app.get('/api/health',(_req,res)=>res.json({status:'degraded',mode:'fixture',contactEnabled:false,providers:{claude:'unconfigured',cartesia:'unconfigured',apify:'unconfigured'}} satisfies ProviderHealth));
 app.get('/api/cases',(_req,res)=>res.json(core.listCases(res.locals.buyerId)));
 app.get('/api/cases/:id/packet',(req,res)=>res.json(core.loadPacket(param(req,'id'),res.locals.buyerId)));
 app.get('/api/campaign',(_req,res)=>res.json(core.campaign(res.locals.buyerId)));
 app.post('/api/cases/:id/reviews',async(req,res)=>{const body=reviewInput.parse(req.body);res.json(await core.reviewQuotePacket({caseId:param(req,'id'),...body},res.locals.buyerId));});
 app.get('/api/reviews/:id/export',(req,res)=>{res.setHeader('Content-Disposition','attachment; filename="nainai-findings.json"');res.type('json').send(core.exportPacket(param(req,'id'),res.locals.buyerId));});
 app.patch('/api/cases/:id/request',(req,res)=>{const body=z.object({request:CaseRequestSchema,expectedRevisions:RevisionsSchema}).strict().parse(req.body);res.json(core.updateRequest(param(req,'id'),body.request,body.expectedRevisions,res.locals.buyerId));});
 app.patch('/api/fixtures/cases/:id/quote',(req,res)=>{const body=z.object({quote:QuoteSnapshotSchema,expectedRevisions:RevisionsSchema}).strict().parse(req.body);res.json(core.updateQuote(param(req,'id'),body.quote,body.expectedRevisions,res.locals.buyerId));});
 app.post('/api/fixtures/cases/:id/scenario',(req,res)=>{const body=z.object({scenario:ScenarioSchema,expectedRevisions:RevisionsSchema}).strict().parse(req.body);res.json(core.setScenario(param(req,'id'),body.scenario,body.expectedRevisions,res.locals.buyerId));});
 app.patch('/api/cases/:id/permissions',(req,res)=>{const body=z.object({sharing:z.boolean(),expectedRevisions:RevisionsSchema}).strict().parse(req.body);res.json(core.setSharing(param(req,'id'),body.sharing,body.expectedRevisions,res.locals.buyerId));});
 app.post('/api/fixtures/cases/:id/conversation',(req,res)=>{const body=conversationInput.parse(req.body);res.json(core.startFixtureConversation(param(req,'id'),body.idempotencyKey,body.expectedRevisions,res.locals.buyerId));});
 app.post('/api/campaign/pause',(_req,res)=>res.json(core.pause(res.locals.buyerId)));
 app.post('/api/campaign/resume',(_req,res)=>res.json(core.pause(res.locals.buyerId,false)));
 app.post('/api/sessions/:id/takeover',(req,res)=>res.json(core.changeSession(param(req,'id'),res.locals.buyerId,s=>takeOverFixtureSession(s,now().toISOString()))));
 app.post('/api/sessions/:id/stop',(req,res)=>res.json(core.changeSession(param(req,'id'),res.locals.buyerId,s=>acknowledgeFixtureStop(requestFixtureStop(s,'Buyer stopped this synthetic rehearsal.',now().toISOString()),now().toISOString()))));
 app.post('/api/sessions/:id/advance',(req,res)=>res.json(core.changeSession(param(req,'id'),res.locals.buyerId,(s:SessionState)=>{
  const packet=core.loadPacket(s.caseId,res.locals.buyerId);const baseline=makeFixture(packet.case,'complete',now().toISOString()).quote!;
  if(!packet.quote||digest([packet.quote.costs,packet.quote.compute,packet.quote.requirements])!==digest([baseline.costs,baseline.compute,baseline.requirements]))throw new AppError('SCENARIO_MISMATCH','Advance is available only for the unchanged complete fixture.',409);
  return advanceFixtureConversation({session:s,request:packet.case,permissionRevision:packet.revisions.permission,paused:core.campaign(res.locals.buyerId).paused,now:now().toISOString()});
 },true)));
 app.post('/api/tools',(req,_res)=>{ToolActionSchema.parse(req.body);throw new AppError('INTEGRATION_UNAVAILABLE','External integrations and supplier contact are disabled in this fixture build.',403);});
 app.all('/api/providers/:provider/events',()=>{throw new AppError('INTEGRATION_UNAVAILABLE','Provider callbacks are disabled until authenticated live ingress is implemented.',503);});
 app.use('/api',(_req,_res,next)=>next(new AppError('NOT_FOUND','No such quote-only operation.',404)));
 const dist=resolve('dist');if(existsSync(join(dist,'index.html'))){app.use(express.static(dist,{index:false}));app.get('/{*path}',(_req,res)=>res.sendFile(join(dist,'index.html')));}
 app.use((error:unknown,_req:Request,res:Response,_next:NextFunction)=>{
  if(error instanceof AppError)return void res.status(error.status).json({code:error.code,message:error.message});
  if(error instanceof z.ZodError)return void res.status(400).json({code:'INVALID_INPUT',message:'The request does not match the quote-only contract.'});
  const message=error instanceof Error?error.message:'Unknown failure';
  if(/FIXTURE|AUTHORITY|PAUSED|SESSION|TERMINAL|SUPPLIER_MISMATCH/.test(message))return void res.status(409).json({code:'SESSION_CONFLICT',message});
  res.status(500).json({code:'INTERNAL_ERROR',message:'The operation failed. Existing evidence was preserved; no external action was sent.'});
 });
 return {app,core};
}
