import type {CaseRequest,QuoteSnapshot,AssessmentContext,Assessment} from '../../shared/contracts';
import {check,commonChecks,finalize,preflight,sumCosts} from './common';
export function assessTable(request:Extract<CaseRequest,{category:'table'}>,quote:QuoteSnapshot|null,context:AssessmentContext):Assessment {
 const invalid=preflight(request,quote,context);if(invalid)return invalid;
 const q=quote!;if(q.requirements.category!=='table')throw new Error('Category mismatch');
 const offered=q.requirements,required=request.requirements;
 const scope=[check('sku',offered.sku===required.sku?'pass':'fail','Exact table SKU must match.',q.evidenceIds),check('condition',offered.condition===required.condition?'pass':'fail','Changed unit condition requires a separate buyer request revision.',q.evidenceIds),check('stock',offered.stock==='confirmed'?'pass':offered.stock==='unavailable'?'fail':'unknown','Exact unit stock must be confirmed.',q.evidenceIds),check('delivery_zip',offered.deliveryZip===null?'unknown':offered.deliveryZip===required.deliveryZip?'pass':'fail','Delivery must cover ZIP 30033.',q.evidenceIds),check('delivery_service',required.deliveryService===null||offered.deliveryService===null?'unknown':offered.deliveryService===required.deliveryService?'pass':'fail','Buyer and supplier must specify the same delivery service.',q.evidenceIds)];
 const alternative=offered.condition!=='new';
 if(alternative)scope.push(check('unit_acceptance','unknown','Exact alternative unit identifier and buyer acceptance evidence are not represented in this quote schema.',q.evidenceIds));
 scope.push(check('inspection',required.inspectionRequired||alternative?offered.inspection==='passed'?'pass':'unknown':'pass',alternative?'Exact alternative unit inspection must pass.':'Inspection follows the buyer request.',q.evidenceIds));
 scope.push(check('warranty',required.warrantyRequired||alternative?offered.warranty?.trim()?'pass':'unknown':'pass','Required warranty terms must be recorded for this unit.',q.evidenceIds));
 // The current quote contract has no supplier delivery date, so a buyer deadline cannot be inferred.
 if(required.deliveryDeadline!==null)scope.push(check('delivery_deadline','unknown','Supplier delivery date is not recorded in this quote schema.',q.evidenceIds));
 const sum=sumCosts(q);const checks=[...commonChecks(q,context),...scope,...sum.checks];
 if(q.compute!==null)checks.push(check('category_pricing','unknown','Table quote cannot use compute pricing.'));
 return finalize(request,q,checks,sum.known,sum.complete,scope.every(c=>c.status==='pass'));
}
