import {describe,it,expect} from 'vitest';
import {createHmac} from 'node:crypto';
import {NaiNaiCore} from '../../src/server/core/store';
import {DispatchJournal} from '../../src/server/core/dispatch';
import {createCallbacks} from '../../src/server/core/callbacks';
import type {Assessment,ToolAction} from '../../src/shared/contracts';
const assessment:Assessment={outcome:'needs_clarification',headline:'Test',checks:[],unknowns:[],knownTotalCents:0,totalCents:null,confirmed:false,comparableScope:false};
function setup(mode:'fixture'|'live'='live'){const core=new NaiNaiCore({databasePath:':memory:',assess:()=>assessment});let calls=0;let allowed=true;const journal=new DispatchJournal(core,{mode,provider:'fixture-provider',canSend:()=>allowed,send:async()=>{calls++;return {providerActionId:'synthetic-provider-action'};}});const action:Extract<ToolAction,{kind:'request_quote'}>={kind:'request_quote',caseId:'table',supplierId:'approved-test-supplier',endpointId:'approved-test-endpoint',sessionId:null,purpose:'initial_quote',text:'Explicitly synthetic transport test.',requestRevision:1,permissionRevision:1,idempotencyKey:'dispatch-1'};return {core,journal,action,calls:()=>calls,revoke:()=>{allowed=false;}};}
describe('durable dispatch with an injected synthetic transport',()=>{
 it('blocks all dispatch in fixture mode even when a transport exists',()=>{const s=setup('fixture');expect(()=>s.journal.prepareDispatch(s.action,'buyer')).toThrow();expect(s.calls()).toBe(0);s.core.close();});
 it('deduplicates sends and serializes the global conversation lock',async()=>{const s=setup();const first=s.journal.prepareDispatch(s.action,'buyer');expect(s.journal.prepareDispatch(s.action,'buyer').id).toBe(first.id);expect(()=>s.journal.prepareDispatch({...s.action,idempotencyKey:'second',supplierId:'another'},'buyer')).toThrow();await s.journal.dispatchPrepared(first.id);await s.journal.dispatchPrepared(first.id);expect(s.calls()).toBe(1);s.core.close();});
 it('rechecks authority immediately before sending',async()=>{const s=setup();const first=s.journal.prepareDispatch(s.action,'buyer');s.revoke();expect((await s.journal.dispatchPrepared(first.id)).status).toBe('cancelled');expect(s.calls()).toBe(0);s.core.close();});
 it('preserves uncertain delivery on restart without resending',async()=>{const s=setup();const first=s.journal.prepareDispatch(s.action,'buyer');s.core.write('dispatch',first.id,{...first,status:'sending'});s.journal.recoverPendingActions();expect((await s.journal.dispatchPrepared(first.id)).status).toBe('delivery_unknown');expect(s.calls()).toBe(0);expect(()=>s.journal.prepareDispatch({...s.action,idempotencyKey:'second'},'buyer')).toThrow();s.core.close();});
 it('authenticates and deduplicates callbacks and ignores late start after end',async()=>{const s=setup();const first=s.journal.prepareDispatch(s.action,'buyer');await s.journal.dispatchPrepared(first.id);const callbacks=createCallbacks(s.journal,'fixture-callback-secret-at-least-32-chars');const sign=(raw:string)=>createHmac('sha256','fixture-callback-secret-at-least-32-chars').update(raw).digest('hex');const raw=JSON.stringify({provider:'fixture-provider',eventId:'ended-1',sessionId:first.id,payloadHash:'known-fixture-payload',kind:'ended'});
  expect(()=>callbacks.ingestProviderEvent(raw,'bad')).toThrow();expect(callbacks.ingestProviderEvent(raw,sign(raw))).toBe('applied');expect(callbacks.ingestProviderEvent(raw,sign(raw))).toBe('duplicate');const late=JSON.stringify({provider:'fixture-provider',eventId:'started-late',sessionId:first.id,payloadHash:'later-fixture-payload',kind:'started'});expect(callbacks.ingestProviderEvent(late,sign(late))).toBe('ignored');s.core.close();
 });
 it('persists exact approved content and distinguishes acknowledged terminal outcomes from unsent work',async()=>{
  for(const kind of ['ended','failed'] as const){const s=setup();const prepared=s.journal.prepareDispatch(s.action,'buyer');
   expect(s.core.read('dispatch',prepared.id)).toMatchObject({text:s.action.text,sessionId:null});
   await s.journal.dispatchPrepared(prepared.id);expect(s.journal.ingestAuthenticatedEvent({provider:'fixture-provider',eventId:`${kind}-event`,sessionId:prepared.id,payloadHash:'fixture',kind})).toBe('applied');
   expect(s.core.read('dispatch',prepared.id)).toMatchObject({status:kind==='ended'?'completed':'failed_after_send',providerActionId:'synthetic-provider-action'});
   expect(s.journal.ingestAuthenticatedEvent({provider:'fixture-provider',eventId:'late',sessionId:prepared.id,payloadHash:'fixture',kind:'started'})).toBe('ignored');s.core.close();
  }
 });
});
