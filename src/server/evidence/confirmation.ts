import type {QuoteSnapshot,EvidenceRef} from '../../shared/contracts';
import {createHash} from 'node:crypto';
import {EvidenceRefSchema,QuoteSnapshotSchema} from '../../shared/contracts';
import {isSafePublicUrl} from './sources';
import {Exact,sumCosts,validTime} from './common';

function canonical(value:unknown):string {
 if(value===null||typeof value!=='object')return JSON.stringify(value);
 if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
 return `{${Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
}
/** Trusted server entry point. The caller authenticates verifierBuyerId and binds current permissions/revisions. */
export async function confirmQuote({quote,originals,verifierBuyerId}:{quote:QuoteSnapshot;originals:EvidenceRef[];verifierBuyerId:string}):Promise<QuoteSnapshot> {
 if(!verifierBuyerId.trim())throw new Error('Authenticated human verifier required.');
 QuoteSnapshotSchema.parse(quote);
 if(!quote.evidenceIds.length||new Set(quote.evidenceIds).size!==quote.evidenceIds.length)throw new Error('Original evidence references required.');
 if(validTime(quote.recordedAt)===null||validTime(quote.expiresAt)===null||validTime(quote.expiresAt)!<=validTime(quote.recordedAt)!)throw new Error('Valid quote timestamps required.');
 let exactTerms=false;let origin:string|null=null;
 for(const id of quote.evidenceIds){
  const matches=originals.filter(e=>e.id===id);if(matches.length!==1)throw new Error('Missing or duplicate original evidence.');
  const e=EvidenceRefSchema.parse(matches[0]);
  if(e.caseId!==quote.caseId||e.intent!==quote.intent||e.supplierId!==quote.supplierId)throw new Error('Original case, intent or supplier mismatch.');
  if(!e.permissions.display)throw new Error('Original display permission missing.');
  const evidenceAt=validTime(e.recordedAt),expiry=validTime(e.expiresAt);
  if(evidenceAt===null||evidenceAt>validTime(quote.recordedAt)!)throw new Error('Invalid original evidence timestamp.');
  if(e.expiresAt!==null&&(expiry===null||expiry<=validTime(quote.recordedAt)!||expiry<validTime(quote.expiresAt)!))throw new Error('Original evidence validity does not cover this quote.');
  if(createHash('sha256').update(e.excerpt).digest('hex')!==e.artifactHash)throw new Error('Original evidence hash mismatch.');
  const synthetic=e.origin==='synthetic_fixture'&&e.verification==='synthetic_verified';
  const supplier=e.origin==='supplier_artifact'&&e.verification==='human_verified'&&e.sourceUrl!==null&&isSafePublicUrl(e.sourceUrl);
  if(!synthetic&&!supplier)throw new Error('Only human-verified supplier originals or explicitly synthetic originals can confirm; observations and proposals cannot self-confirm.');
  if(origin&&origin!==e.origin)throw new Error('Cannot combine synthetic and authentic evidence into a confirmed quote.');origin=e.origin;
  let terms:Record<string,unknown>;
  try{terms=JSON.parse(e.excerpt.includes('Structured terms: ')?e.excerpt.slice(e.excerpt.lastIndexOf('Structured terms: ')+18):e.excerpt);}catch{throw new Error('Exact structured original terms required; source instructions have no authority.');}
  if(!terms||typeof terms!=='object')throw new Error('Structured original terms missing.');
  const expected={requirements:quote.requirements,costs:quote.costs,compute:quote.compute};
  const actual={requirements:terms.requirements,costs:terms.costs,compute:terms.compute};
  let scopeMatches=terms.scopeKey===quote.scopeKey;
  // Legacy controlled seeds omit the scope key from their structured excerpt. Recognize only their explicit scenario.
  if(synthetic&&terms.scopeKey===undefined){const category=quote.requirements.category;const scenario=e.excerpt.match(/Fixture scenario: ([a-z_]+)\./)?.[1];const key=scenario==='condition_change'?'table-open-box-alternative':scenario==='minimum_term'?'gpu-168h-alternative':`${category}-new-baseline`;scopeMatches=!!scenario&&quote.scopeKey===key;}
  const monetaryEnvelope=synthetic||(terms.currency===quote.currency&&terms.totalCents===quote.totalCents);
  if(synthetic&&quote.totalCents!==null){
   const gpu=quote.requirements.category==='gpu';const sum=sumCosts(quote,gpu);let computed=sum.known;
   if(gpu){if(!quote.compute)throw new Error('Compute total cannot be verified.');const c=quote.compute;const hours=Exact.max(quote.requirements.category==='gpu'?quote.requirements.continuousHours:0,c.minimumHours).div(c.billingIncrementHours).ceil().mul(c.billingIncrementHours);computed=computed.plus(new Exact(c.ratePerGpuHour).mul(c.gpuCount).mul(hours).mul(100));}
   if(!sum.complete||!computed.toDecimalPlaces(0).eq(quote.totalCents))throw new Error('Synthetic total does not match original charges.');
  }
  if(scopeMatches&&monetaryEnvelope&&canonical(actual)===canonical(expected))exactTerms=true;
 }
 if(!exactTerms)throw new Error('Original terms do not verify the current quote scope and charges.');
 return {...structuredClone(quote),confirmation:'verified'};
}
