import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach,describe,it,expect} from 'vitest';
import {NaiNaiCore} from '../../src/server/core/store';
import type {Assessment} from '../../src/shared/contracts';
import {assessTable} from '../../src/server/evidence/table';
import {assessGpu} from '../../src/server/evidence/gpu';
const dirs:string[]=[];
const assess=():Assessment=>({outcome:'needs_clarification',headline:'Missing delivery preference',checks:[],unknowns:['Delivery preference'],knownTotalCents:14400,totalCents:null,confirmed:false,comparableScope:true});
function open(path?:string){const dir=path??mkdtempSync(join(tmpdir(),'nainai-'));if(!path)dirs.push(dir);return {dir,core:new NaiNaiCore({databasePath:join(dir,'test.sqlite'),assess})};}
afterEach(()=>{for(const dir of dirs.splice(0))rmSync(dir,{recursive:true,force:true});});
describe('durable buyer review',()=>{
 it('persists one immutable review for concurrent retries, including a null quote',async()=>{
  const {core,dir}=open();let packet=core.loadPacket('table','buyer');
  packet=core.setScenario('table','no_response',packet.revisions,'buyer');
  const reviews=await Promise.all([core.reviewQuotePacket({caseId:'table',expectedRevisions:packet.revisions,idempotencyKey:'first'},'buyer'),core.reviewQuotePacket({caseId:'table',expectedRevisions:packet.revisions,idempotencyKey:'second'},'buyer')]);
  expect(reviews[0].id).toBe(reviews[1].id);expect(reviews[0].packet.quote).toBeNull();expect(reviews[0].packet.assessment.outcome).toBe('needs_clarification');core.close();
  const reopened=open(dir).core;expect(reopened.loadPacket('table','buyer').review?.id).toBe(reviews[0].id);reopened.close();
 });
 it('rejects stale review after a fee changes and preserves the historical snapshot',async()=>{
  const {core}=open();const packet=core.loadPacket('table','buyer');
  const review=await core.reviewQuotePacket({caseId:'table',expectedRevisions:packet.revisions,idempotencyKey:'original'},'buyer');
  const quote=structuredClone(packet.quote!);quote.costs.delivery.amountCents=2500;
  const changed=core.updateQuote('table',quote,packet.revisions,'buyer');
  expect(changed.review).toBeNull();await expect(core.reviewQuotePacket({caseId:'table',expectedRevisions:packet.revisions,idempotencyKey:'stale'},'buyer')).rejects.toMatchObject({code:'STALE_REVISION'});
  expect(JSON.parse(core.exportPacket(review.id,'buyer')).packet.quote.costs.delivery.amountCents).toBe(1500);core.close();
 });
 it('redacts sharing-withdrawn evidence from historical exports without changing stored history',async()=>{
  const {core}=open();const packet=core.loadPacket('table','buyer');const review=await core.reviewQuotePacket({caseId:'table',expectedRevisions:packet.revisions,idempotencyKey:'review'},'buyer');
  expect(JSON.parse(core.exportPacket(review.id,'buyer')).packet.evidence[0].excerpt).toContain('SYNTHETIC');
  core.setSharing('table',false,packet.revisions,'buyer');
  const exported=JSON.parse(core.exportPacket(review.id,'buyer'));expect(exported.packet.evidence[0].excerpt).toBe('[Redacted: sharing permission withdrawn]');expect(exported.currentReview).toBe(false);core.close();
 });
 it('rejects cross-buyer reads and idempotency-key reuse for another snapshot',async()=>{
  const {core}=open();expect(()=>core.loadPacket('table','other')).toThrow();const packet=core.loadPacket('table','buyer');
  await core.reviewQuotePacket({caseId:'table',expectedRevisions:packet.revisions,idempotencyKey:'one'},'buyer');
  const changed=core.setScenario('table','missing_cost',packet.revisions,'buyer');
  await expect(core.reviewQuotePacket({caseId:'table',expectedRevisions:changed.revisions,idempotencyKey:'one'},'buyer')).rejects.toMatchObject({code:'IDEMPOTENCY_CONFLICT'});core.close();
 });
 it('preserves the qualifying review as history and saves fresh expired findings',async()=>{
  let time=new Date('2026-10-24T10:00:00Z');const core=new NaiNaiCore({databasePath:':memory:',now:()=>time,assess:(r,q,c)=>r.category==='table'?assessTable(r,q,c):assessGpu(r,q,c)});
  const initial=core.loadPacket('table','buyer');if(initial.case.category!=='table')throw new Error('Expected table');initial.case.requirements.deliveryService='doorstep';
  const packet=core.updateRequest('table',initial.case,initial.revisions,'buyer');const first=await core.reviewQuotePacket({caseId:'table',expectedRevisions:packet.revisions,idempotencyKey:'before-expiry'},'buyer');expect(first.packet.assessment.outcome).toBe('qualifying_table_quote');
  time=new Date('2026-10-26T10:00:00Z');const expired=core.loadPacket('table','buyer');expect(expired.review).toBeNull();expect(expired.assessment.outcome).not.toBe('qualifying_table_quote');
  const second=await core.reviewQuotePacket({caseId:'table',expectedRevisions:expired.revisions,idempotencyKey:'after-expiry'},'buyer');expect(second.id).not.toBe(first.id);expect(second.packet.assessment.outcome).not.toBe('qualifying_table_quote');
  expect(core.loadPacket('table','buyer').review?.id).toBe(second.id);expect(JSON.parse(core.exportPacket(first.id,'buyer')).currentReview).toBe(false);expect(JSON.parse(core.exportPacket(second.id,'buyer')).currentReview).toBe(true);core.close();
 });
});
