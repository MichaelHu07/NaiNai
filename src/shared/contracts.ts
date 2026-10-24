import { z } from 'zod';
const id=z.string().min(1).max(160), revision=z.number().int().positive(), cents=z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
export const IntentSchema=z.enum(['actual_need','evaluation_only']);
export const OriginSchema=z.enum(['public_observation','supplier_artifact','conversation_proposal','synthetic_fixture']);
export type Intent=z.infer<typeof IntentSchema>;
export type EvidenceOrigin=z.infer<typeof OriginSchema>;
const commonRequest={caseId:id,title:z.string().max(200),requestRevision:revision,capCents:cents,capMode:z.enum(['exclusive','inclusive']),assumptions:z.array(z.string().max(500))};
export const TableRequirementsSchema=z.object({sku:id,quantity:z.literal(1),condition:z.enum(['new','open_box','floor']),deliveryZip:z.literal('30033'),deliveryRequired:z.literal(true),deliveryService:z.enum(['doorstep','inside']).nullable(),deliveryDeadline:z.string().nullable(),inspectionRequired:z.boolean(),warrantyRequired:z.boolean()}).strict();
export const GpuRequirementsSchema=z.object({gpuModel:id,vramGb:z.number().positive(),formFactor:z.enum(['SXM','PCIe']),gpuCount:z.number().int().positive(),nodeCount:z.number().int().positive(),nvlink:z.boolean(),continuousHours:z.number().positive(),interruptible:z.boolean(),region:id,storageGb:z.number().nonnegative(),egressGb:z.number().nonnegative(),startsAt:z.string()}).strict();
export const CaseRequestSchema=z.discriminatedUnion('category',[
 z.object({...commonRequest,category:z.literal('table'),intent:z.literal('actual_need'),capCents:z.literal(15000),capMode:z.literal('exclusive'),requirements:TableRequirementsSchema}).strict(),
 z.object({...commonRequest,category:z.literal('gpu'),intent:z.literal('evaluation_only'),requirements:GpuRequirementsSchema}).strict()
]);
export type CaseRequest=z.infer<typeof CaseRequestSchema>;
export const MoneyComponentSchema=z.object({status:z.enum(['known','included','unknown']),amountCents:cents.nullable()}).strict();
export type MoneyComponent=z.infer<typeof MoneyComponentSchema>;
export const CostKeySchema=z.enum(['item','delivery','tax','fees','storage','egress','support','setup']);
export type CostKey=z.infer<typeof CostKeySchema>;
export const CostsSchema=z.object({item:MoneyComponentSchema,delivery:MoneyComponentSchema,tax:MoneyComponentSchema,fees:MoneyComponentSchema,storage:MoneyComponentSchema,egress:MoneyComponentSchema,support:MoneyComponentSchema,setup:MoneyComponentSchema}).strict();
export const TableSpecsSchema=z.object({category:z.literal('table'),sku:id,condition:z.enum(['new','open_box','floor']),stock:z.enum(['confirmed','unavailable','unknown']),deliveryZip:z.string().nullable(),deliveryService:z.enum(['doorstep','inside']).nullable(),inspection:z.enum(['passed','pending','not_applicable']),warranty:z.string().nullable()}).strict();
export const GpuSpecsSchema=GpuRequirementsSchema.extend({category:z.literal('gpu'),availability:z.enum(['indicative','confirmed','unknown'])}).strict();
export const QuoteSnapshotSchema=z.object({quoteId:id,quoteRevision:revision,caseId:id,intent:IntentSchema,supplierId:id,supplierName:z.string().max(200),currency:z.literal('USD'),scopeKey:id,requirements:z.discriminatedUnion('category',[TableSpecsSchema,GpuSpecsSchema]),costs:CostsSchema,compute:z.object({ratePerGpuHour:z.string().regex(/^\d+(\.\d+)?$/).max(50),gpuCount:z.number().int().positive(),minimumHours:z.number().nonnegative(),billingIncrementHours:z.number().positive()}).strict().nullable(),totalCents:cents.nullable(),confirmation:z.enum(['unconfirmed','verified']),recordedAt:z.string(),expiresAt:z.string().nullable(),evidenceIds:z.array(id)}).strict();
export type QuoteSnapshot=z.infer<typeof QuoteSnapshotSchema>;
export const EvidenceRefSchema=z.object({id,revision,caseId:id,intent:IntentSchema,origin:OriginSchema,supplierId:id,sourceUrl:z.string().url().nullable(),sourceLabel:z.string().max(200),excerpt:z.string().max(12000),recordedAt:z.string(),expiresAt:z.string().nullable(),artifactHash:z.string(),provider:z.string().nullable(),runId:z.string().nullable(),verification:z.enum(['unverified','human_verified','synthetic_verified']),permissions:z.object({display:z.boolean(),sharing:z.boolean(),recording:z.boolean()}).strict()}).strict();
export type EvidenceRef=z.infer<typeof EvidenceRefSchema>;
export type Check={id:string;label:string;status:'pass'|'fail'|'unknown';detail:string;evidenceIds:string[]};
export type Assessment={outcome:'qualifying_table_quote'|'no_qualifying_offer'|'needs_clarification'|'evaluation_findings'|'declined'|'no_response';headline:string;checks:Check[];unknowns:string[];knownTotalCents:number;totalCents:number|null;confirmed:boolean;comparableScope:boolean};
export type AssessmentContext={conversationOutcome:'pending'|'declined'|'no_response'|'failed'|'complete';reason:string|null;now?:string};
export const RevisionsSchema=z.object({request:revision,quote:revision.nullable(),evidence:revision,permission:revision}).strict();
export type Revisions=z.infer<typeof RevisionsSchema>;
export type PacketSnapshot={workspaceId:'fixture';case:CaseRequest;quote:QuoteSnapshot|null;evidence:EvidenceRef[];assessment:Assessment;context:AssessmentContext;revisions:Revisions;review:ReviewRecord|null};
export type ReviewRecord={id:string;buyerId:string;reviewedAt:string;revisions:Revisions;packet:Omit<PacketSnapshot,'review'>};
export type ConversationEvent={id:string;at:string;role:'buyer'|'nainai'|'supplier'|'system';text:string;origin:EvidenceOrigin};
export type SessionState={sessionId:string;caseId:string;supplierId:string;status:'pending'|'active'|'ended'|'failed';control:'ai'|'human';providerIds:string[];permissionRevision:number;stopStatus:'none'|'pending'|'confirmed';events:ConversationEvent[]};
export type ResearchJob={id:string;caseId:string;kind:'research';status:'pending'|'active'|'complete'|'failed';error:string|null};
export type CampaignState={paused:boolean;cancellationRevision:number;jobs:ResearchJob[];sessions:SessionState[];counts:{observations:number;suppliersContacted:number;replies:number;confirmedQuotes:number;fixtureSessions:number}};
const actionCommon={caseId:id,requestRevision:revision,permissionRevision:revision,idempotencyKey:id};
export const ToolActionSchema=z.discriminatedUnion('kind',[
 z.object({...actionCommon,kind:z.literal('research'),sourceIds:z.array(id).max(100)}).strict(),
 z.object({...actionCommon,kind:z.literal('request_quote'),supplierId:id,endpointId:id,sessionId:id.nullable(),purpose:z.enum(['initial_quote','counterproposal']),text:z.string().max(4000)}).strict(),
 z.object({...actionCommon,kind:z.literal('record_proposal'),supplierId:id,sessionId:id,quote:QuoteSnapshotSchema}).strict(),
 z.object({...actionCommon,kind:z.literal('stop_session'),sessionId:id}).strict()
]);
export type ToolAction=z.infer<typeof ToolActionSchema>;
export type QuoteSessionTools={requestQuote(action:Extract<ToolAction,{kind:'request_quote'}>):Promise<{sessionId:string;providerActionId:string}>;recordProposal(action:Extract<ToolAction,{kind:'record_proposal'}>):Promise<{quoteId:string;quoteRevision:number}>;stopSession(action:Extract<ToolAction,{kind:'stop_session'}>):Promise<void>};
export type DispatchRecord={id:string;workspaceId:'fixture'|'live';buyerId:string;caseId:string;supplierId:string;endpointId:string;sessionId:string|null;text:string;kind:'request_quote';purpose:'initial_quote'|'counterproposal';requestRevision:number;permissionRevision:number;cancellationRevision:number;idempotencyKey:string;payloadHash:string;providerActionId:string|null;createdAt:string;updatedAt:string;deadlineAt:string;status:'prepared'|'sending'|'acknowledged'|'delivery_unknown'|'failed_before_send'|'cancelled'|'completed'|'failed_after_send'};
export type ProviderEvent={provider:string;eventId:string;sessionId:string;payloadHash:string;kind:'started'|'ended'|'failed'|'action_acknowledged'};
export type ProviderHealth={status:'ok'|'degraded';mode:'fixture';contactEnabled:false;providers:Record<'claude'|'cartesia'|'apify','unconfigured'>};
export const ScenarioSchema=z.enum(['complete','missing_cost','over_budget','condition_change','minimum_term','no_response','declined','source_failure']);
export type FixtureScenario=z.infer<typeof ScenarioSchema>;
