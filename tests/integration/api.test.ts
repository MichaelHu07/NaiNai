import request from 'supertest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach,describe,it,expect} from 'vitest';
import {createApp} from '../../src/server/app';
const workspaces:{dir:string;close:()=>void}[]=[];
const origin='http://127.0.0.1:5173';
function setup(){const dir=mkdtempSync(join(tmpdir(),'nainai-api-'));const runtime=createApp({dataDir:dir,passphrase:'test-only-local-session-key',allowedOrigins:[origin]});workspaces.push({dir,close:()=>runtime.core.close()});return {...runtime,agent:request.agent(runtime.app)};}
afterEach(()=>{for(const item of workspaces.splice(0)){item.close();rmSync(item.dir,{recursive:true,force:true});}});
async function login(agent:ReturnType<typeof request.agent>){const result=await agent.post('/api/auth/login').set('Origin',origin).send({passphrase:'test-only-local-session-key'});expect(result.status).toBe(200);return result.body.csrfToken as string;}
describe('authenticated quote-only API',()=>{
 it('requires login and CSRF/origin for mutations',async()=>{
  const {agent}=setup();expect((await agent.get('/api/cases')).status).toBe(401);expect((await agent.post('/api/auth/login').set('Origin',origin).send({passphrase:'wrong'})).status).toBe(401);
  const csrf=await login(agent);expect((await agent.get('/api/cases')).body).toHaveLength(2);
  expect((await agent.post('/api/campaign/pause').set('Origin',origin).send({})).status).toBe(403);
  expect((await agent.post('/api/campaign/pause').set('Origin','https://untrusted.example').set('x-csrf-token',csrf).send({})).status).toBe(403);
  expect((await agent.post('/api/campaign/pause').set('Origin',origin).set('x-csrf-token',csrf).send({})).body.paused).toBe(true);
 });
 it('reviews an incomplete case without qualification and rejects a stale retry',async()=>{
  const {agent}=setup();const csrf=await login(agent);const packet=(await agent.get('/api/cases/table/packet')).body;
  expect(packet.assessment.outcome).toBe('needs_clarification');
  const review=await agent.post('/api/cases/table/reviews').set('Origin',origin).set('x-csrf-token',csrf).send({expectedRevisions:packet.revisions,idempotencyKey:'review-one'});
  expect(review.status).toBe(200);expect(review.body.packet.assessment.outcome).toBe('needs_clarification');
  const changed=await agent.post('/api/fixtures/cases/table/scenario').set('Origin',origin).set('x-csrf-token',csrf).send({scenario:'missing_cost',expectedRevisions:packet.revisions});expect(changed.status).toBe(200);
  const stale=await agent.post('/api/cases/table/reviews').set('Origin',origin).set('x-csrf-token',csrf).send({expectedRevisions:packet.revisions,idempotencyKey:'old-review'});expect(stale.status).toBe(409);expect(stale.body.code).toBe('STALE_REVISION');
  const exported=await agent.get(`/api/reviews/${review.body.id}/export`);expect(exported.body.currentReview).toBe(false);expect(exported.body.packet.workspaceId).toBe('fixture');
 });
 it('does not enable real providers or commercial tools with placeholder credentials',async()=>{
  const {agent}=setup();const csrf=await login(agent);const health=(await agent.get('/api/health')).body;
  expect(health.contactEnabled).toBe(false);expect(health.providers).toEqual({claude:'unconfigured',cartesia:'unconfigured',apify:'unconfigured'});
  const forbidden=await agent.post('/api/tools').set('Origin',origin).set('x-csrf-token',csrf).send({kind:'pay'});expect(forbidden.status).toBe(400);
  const campaign=(await agent.get('/api/campaign')).body;expect(campaign.counts.suppliersContacted).toBe(0);expect(campaign.counts.confirmedQuotes).toBe(0);
 });
 it('keeps GPU assumptions and synthetic evidence in a saved packet',async()=>{
  const {agent}=setup();const csrf=await login(agent);const packet=(await agent.get('/api/cases/gpu/packet')).body;
  expect(packet.case.intent).toBe('evaluation_only');expect(packet.assessment.totalCents).toBe(172800);
  const review=(await agent.post('/api/cases/gpu/reviews').set('Origin',origin).set('x-csrf-token',csrf).send({expectedRevisions:packet.revisions,idempotencyKey:'gpu-review'})).body;
  const exported=(await agent.get(`/api/reviews/${review.id}/export`)).body;expect(exported.packet.case.intent).toBe('evaluation_only');expect(exported.packet.evidence.every((e:{origin:string})=>e.origin==='synthetic_fixture')).toBe(true);
 });
 it('blocks conversation advancement after request changes and preserves the original dialogue',async()=>{
  const {agent}=setup();const csrf=await login(agent);const packet=(await agent.get('/api/cases/table/packet')).body;
  const campaign=(await agent.post('/api/fixtures/cases/table/conversation').set('Origin',origin).set('x-csrf-token',csrf).send({expectedRevisions:packet.revisions,idempotencyKey:'session'})).body;
  const session=campaign.sessions[0];
  const changedRequest=structuredClone(packet.case);changedRequest.requirements.deliveryService='inside';
  expect((await agent.patch('/api/cases/table/request').set('Origin',origin).set('x-csrf-token',csrf).send({request:changedRequest,expectedRevisions:packet.revisions})).status).toBe(200);
  const advanced=await agent.post(`/api/sessions/${session.sessionId}/advance`).set('Origin',origin).set('x-csrf-token',csrf).send({});
  expect(advanced.status).toBe(409);expect(advanced.body.code).toBe('STALE_REVISION');
  const after=(await agent.get('/api/campaign')).body;expect(after.sessions[0].events).toEqual(session.events);
  expect((await agent.post(`/api/sessions/${session.sessionId}/stop`).set('Origin',origin).set('x-csrf-token',csrf).send({})).status).toBe(200);
 });
 it('starts a fresh workspace without pause and fails interrupted rehearsals closed on restart',async()=>{
  const {agent,core}=setup();core.recoverSessions();expect(core.campaign('buyer').paused).toBe(false);
  const csrf=await login(agent);const packet=(await agent.get('/api/cases/gpu/packet')).body;
  expect((await agent.post('/api/fixtures/cases/gpu/conversation').set('Origin',origin).set('x-csrf-token',csrf).send({expectedRevisions:packet.revisions,idempotencyKey:'restart'})).status).toBe(200);
  core.recoverSessions();const campaign=core.campaign('buyer');expect(campaign.paused).toBe(true);expect(campaign.sessions[0]).toMatchObject({status:'failed',control:'human',stopStatus:'confirmed'});
  expect(campaign.sessions[0].events.at(-1)?.text).toContain('interrupted');
 });
});
