import type {CaseRequest,QuoteSnapshot,AssessmentContext,Assessment} from '../../shared/contracts';
import {Exact,check,commonChecks,finalize,preflight,sumCosts,validTime} from './common';
export function assessGpu(request:Extract<CaseRequest,{category:'gpu'}>,quote:QuoteSnapshot|null,context:AssessmentContext):Assessment {
 const invalid=preflight(request,quote,context);if(invalid)return invalid;
 const q=quote!;if(q.requirements.category!=='gpu')throw new Error('Category mismatch');
 const offered=q.requirements,required=request.requirements;
 const scope=Object.keys(required).map(key=>{
  const k=key as keyof typeof required,value=offered[k];
  if(k==='startsAt'){
   const offeredTime=validTime(value as string),requiredTime=validTime(required.startsAt);
   return check('spec_startsAt',offeredTime===null||requiredTime===null?'unknown':offeredTime===requiredTime?'pass':'fail','Valid supplier and requested start times must match.',q.evidenceIds);
  }
  return check(`spec_${k}`,value===required[k]?'pass':'fail',`${k} must match the evaluation request.`,q.evidenceIds);
 });
 const checks=[...commonChecks(q,context)];
 // Availability is an observation, never an instance launch or capacity reservation.
 checks.push(check('capacity',offered.availability==='confirmed'?'pass':'unknown',offered.availability==='confirmed'?'Supplier indicates availability; capacity is not reserved.':'Indicative or unknown availability; no reserved capacity or real workload.',q.evidenceIds));
 const sum=sumCosts(q,true);let computeCents=new Exact(0),complete=sum.complete;
 if(!q.compute){complete=false;checks.push(check('compute_pricing','unknown','GPU rate and billing intervals are missing.'));}
 else {
  const billable=Exact.max(offered.continuousHours,q.compute.minimumHours).div(q.compute.billingIncrementHours).ceil().mul(q.compute.billingIncrementHours);
  computeCents=new Exact(q.compute.ratePerGpuHour).mul(q.compute.gpuCount).mul(billable).mul(100);
  scope.push(check('billing_scope',billable.eq(required.continuousHours)?'pass':'fail',`Billable duration is ${billable.toString()} hours after minimum commitment and interval rounding; changed duration is not equivalent negotiation savings.`,q.evidenceIds));
  scope.push(check('billing_gpu_count',q.compute.gpuCount===required.gpuCount?'pass':'fail','Priced GPU count must match evaluation GPU count.',q.evidenceIds));
  const item=q.costs.item;
  const rounded=computeCents.toDecimalPlaces(0);
  if(item.status==='unknown'||(item.status==='known'&&(item.amountCents===null||!rounded.eq(item.amountCents)))||(item.status==='included'&&item.amountCents!==null)){
   complete=false;checks.push(check('compute_item_consistency','unknown','Item price is unknown or conflicts with the computed GPU charge.'));
  }
 }
 return finalize(request,q,[...checks,...scope,...sum.checks],sum.known.plus(computeCents),complete,scope.every(c=>c.status==='pass'));
}
