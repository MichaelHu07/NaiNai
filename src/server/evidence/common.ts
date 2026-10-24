import Decimal from 'decimal.js';
import {CaseRequestSchema,QuoteSnapshotSchema,type CaseRequest,type QuoteSnapshot,type Assessment,type AssessmentContext,type Check} from '../../shared/contracts';

// Local constructor avoids changing global Decimal precision in other modules.
export const Exact=Decimal.clone({precision:120,rounding:Decimal.ROUND_HALF_UP});
export function validTime(value:string|null|undefined):number|null {
 if(!value||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value))return null;
 const time=Date.parse(value);
 if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,19)!==value.slice(0,19))return null;
 return time;
}
export function check(id:string,status:Check['status'],detail:string,evidenceIds:string[]=[]):Check{return {id,label:id.replaceAll('_',' '),status,detail,evidenceIds};}
export function unresolved(detail:string):Assessment{return {outcome:'needs_clarification',headline:'Quote details need clarification',checks:[check('evidence','unknown',detail)],unknowns:[detail],knownTotalCents:0,totalCents:null,confirmed:false,comparableScope:false};}
export function preflight(request:CaseRequest,quote:QuoteSnapshot|null,context:AssessmentContext):Assessment|null {
 if(!CaseRequestSchema.safeParse(request).success)return unresolved('Request schema or intent is invalid.');
 if(!quote){const result=unresolved(context.reason||'No quote recorded; source failure or pending work does not establish a supplier outcome.');if((context.conversationOutcome==='declined'||context.conversationOutcome==='no_response')&&context.reason?.trim()){result.outcome=context.conversationOutcome;result.headline=context.conversationOutcome==='declined'?'Recorded decline':'Recorded no response';}return result;}
 if(!QuoteSnapshotSchema.safeParse(quote).success)return unresolved('Quote schema is incomplete or invalid; USD and hard specifications are required.');
 if(quote.caseId!==request.caseId||quote.intent!==request.intent||quote.requirements.category!==request.category)return unresolved('Quote case, category or scenario intent does not match this request.');
 return null;
}
export function commonChecks(quote:QuoteSnapshot,context:AssessmentContext):Check[]{
 const at=validTime(quote.recordedAt),expires=validTime(quote.expiresAt),now=validTime(context.now??new Date().toISOString());
 const timeStatus=at===null||expires===null||now===null?'unknown':at>now||expires<=at||expires<=now?'fail':'pass';
 return [check('quote_confirmation',quote.confirmation==='verified'&&quote.evidenceIds.length>0?'pass':'unknown','Confirmation must come from verified original evidence; fixtures remain synthetic.',quote.evidenceIds),check('validity',timeStatus,timeStatus==='pass'?'Quote is within its recorded validity period.':'Missing, malformed, future-dated or expired quote validity prevents qualification.',quote.evidenceIds)];
}
export function sumCosts(quote:QuoteSnapshot,skipItem=false):{known:Decimal;complete:boolean;checks:Check[]} {
 let known=new Exact(0),complete=true;const checks:Check[]=[];
 for(const [key,value] of Object.entries(quote.costs)){
  if(skipItem&&key==='item')continue;
  const valid=value.status==='known'?value.amountCents!==null:value.status==='included'?value.amountCents===null:false;
  if(!valid)complete=false;
  if(valid&&value.status==='known')known=known.plus(value.amountCents!);
  checks.push(check(`cost_${key}`,valid?'pass':'unknown',value.status==='included'&&valid?'Explicitly included in quoted charges; no separate amount invented.':valid?`${value.amountCents} cents known.`:`${key} amount or inclusion needs confirmation.`,quote.evidenceIds));
 }
 return {known,complete,checks};
}
export function finalize(request:CaseRequest,quote:QuoteSnapshot,checks:Check[],known:Decimal,complete:boolean,comparableScope:boolean):Assessment {
 const rounded=known.toDecimalPlaces(0,Decimal.ROUND_HALF_UP);
 const safe=rounded.isFinite()&&rounded.gte(0)&&rounded.lte(Number.MAX_SAFE_INTEGER);
 const knownTotalCents=safe?rounded.toNumber():0;
 if(!safe){complete=false;checks.push(check('safe_total','unknown','Total exceeds supported integer-cent range.'));}
 let totalCents=complete?knownTotalCents:null;
 if(totalCents!==null&&quote.totalCents!==totalCents){checks.push(check('total_consistency','unknown','Supplied total does not match deterministic mandatory-charge calculation.',quote.evidenceIds));totalCents=null;}
 if(totalCents!==null){const pass=request.capMode==='exclusive'?totalCents<request.capCents:totalCents<=request.capCents;checks.push(check('cap',pass?'pass':'fail',`${totalCents} cents against ${request.capMode} ${request.capCents}-cent ceiling.`,quote.evidenceIds));}
 const blocking=checks.filter(c=>c.id!=='capacity');
 const failed=blocking.some(c=>c.status==='fail');
 const unknowns=checks.filter(c=>c.status==='unknown').map(c=>c.detail);
 const unresolved=blocking.some(c=>c.status==='unknown')||totalCents===null;
 const outcome:Assessment['outcome']=failed?'no_qualifying_offer':unresolved?'needs_clarification':request.category==='table'?'qualifying_table_quote':'evaluation_findings';
 return {outcome,headline:request.category==='gpu'?'Evaluation-only findings; no real workload or capacity reservation':outcome==='qualifying_table_quote'?'Quote meets the current table requirements':'Table quote has unresolved or unsuitable terms',checks,unknowns,knownTotalCents,totalCents,confirmed:quote.confirmation==='verified'&&quote.evidenceIds.length>0,comparableScope};
}
