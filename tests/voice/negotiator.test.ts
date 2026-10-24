import { describe, expect, it } from 'vitest';
import type { QuoteSessionTools, SessionState } from '../../src/shared/contracts';
import { seedCases } from '../../src/shared/seeds';
import {
  acknowledgeFixtureStop,
  advanceFixtureConversation,
  createFixtureConversation,
  failFixtureSession,
  requestFixtureStop,
  startQuoteSession,
  stopSession,
  takeOver,
  takeOverFixtureSession,
} from '../../src/server/voice/negotiator';

const now = '2026-10-24T12:00:00.000Z';
const table = seedCases[0];
const gpu = seedCases[1];
const create = (request = table): SessionState => createFixtureConversation({
  request, sessionId: 'fixture-session', supplierId: request.category === 'table' ? 'fixture-furniture' : 'fixture-compute',
  permissionRevision: 4, now,
});
const advance = (session: SessionState, request = table, permissionRevision = 4) =>
  advanceFixtureConversation({ session, request, permissionRevision, now });

describe('synthetic quote conversation', () => {
  it('opens an active fixture while retaining the real personal intent without claiming real supplier terms', () => {
    const session = create();
    expect(session).toMatchObject({ status: 'active', control: 'ai', stopStatus: 'none', providerIds: [], permissionRevision: 4 });
    const text = session.events.map(event => event.text).join('\n');
    expect(text).toContain('actual personal need');
    expect(text).toContain('without placing an order');
    expect(text).toContain('strictly under $150');
    expect(text).toContain('synthetic');
    expect(text).not.toMatch(/supplier confirmed|order accepted|future orders|competing offer/i);
    expect(session.events.every(event => event.origin === 'synthetic_fixture' && event.at === now)).toBe(true);
  });

  it('uses the exact truthful evaluation request with no company or workload claim', () => {
    const session = create(gpu);
    const spoken = session.events.filter(event => event.role === 'nainai').map(event => event.text).join('\n');
    expect(spoken).toContain('We are evaluating a purchasing-assistant prototype using an illustrative GPU configuration. There is no current customer workload or purchase commitment. Could you provide indicative pricing and terms? Please do not reserve capacity.');
    expect(spoken).not.toMatch(/our company|our workload|buy now|launch|future orders/i);
  });

  it.each([
    { request: table, terms: ['Item $120', 'delivery to ZIP 30033 $15', 'fictional tax $9', '$144.00'] },
    { request: gpu, terms: ['$3/GPU-hour', '$1,728.00', 'No real workload or reserved capacity'] },
  ])('advances a complete $request.category fixture once with matching synthetic terms', ({ request, terms }) => {
    const initial = create(request);
    const completed = advance(initial, request);
    const text = completed.events.map(event => event.text).join('\n');
    for (const term of terms) expect(text).toContain(term);
    expect(text).toContain('SANDBOX TAX');
    expect(text).toContain('unconfirmed proposal');
    expect(completed).toMatchObject({ status: 'ended', stopStatus: 'confirmed', providerIds: [] });
    expect(completed.events.every(event => event.origin === 'synthetic_fixture')).toBe(true);
    expect(initial.status).toBe('active');
    expect(advance(completed, request)).toEqual(completed);
  });

  it('prevents a late AI action after human takeover without granting new outreach authority', () => {
    const initial = create();
    const taken = takeOverFixtureSession(initial, now);
    expect(taken).toMatchObject({ status: 'active', control: 'human', permissionRevision: 4 });
    expect(() => advance(taken)).toThrow('AI_DISPATCH_BLOCKED');
    expect(takeOverFixtureSession(taken, now)).toEqual(taken);
    expect(initial.control).toBe('ai');
  });

  it('keeps stop pending until acknowledgement and blocks subsequent AI work', () => {
    const pending = requestFixtureStop(create(), 'Buyer explicitly stopped this fixture.', now);
    expect(pending).toMatchObject({ status: 'active', stopStatus: 'pending' });
    expect(() => advance(pending)).toThrow('AI_DISPATCH_BLOCKED');
    expect(requestFixtureStop(pending, 'Repeated stop', now)).toEqual(pending);
    const ended = acknowledgeFixtureStop(pending, now);
    expect(ended).toMatchObject({ status: 'ended', stopStatus: 'confirmed' });
    expect(acknowledgeFixtureStop(ended, now)).toEqual(ended);
    expect(requestFixtureStop(ended, 'Late stop', now)).toEqual(ended);
  });

  it('refuses to complete against a revoked or changed permission revision', () => {
    const initial = create();
    expect(() => advance(initial, table, 5)).toThrow('PERMISSION_CHANGED');
    expect(initial.events).toHaveLength(2);
  });

  it('blocks paused work and mismatched case input without modifying the session', () => {
    const initial = create();
    expect(() => advanceFixtureConversation({ session: initial, request: table, permissionRevision: 4, paused: true, now })).toThrow('AI_DISPATCH_BLOCKED');
    expect(() => advance(initial, gpu)).toThrow('CASE_MISMATCH');
    expect(initial.events).toHaveLength(2);
  });

  it.each(['supplier_refusal', 'ai_objection', 'permission_withdrawn', 'disconnected', 'delivery_unknown'] as const)('halts %s without redial or synthetic repair', reason => {
    const failed = failFixtureSession(create(), reason, now);
    expect(failed).toMatchObject({ status: 'failed', stopStatus: 'pending', providerIds: [] });
    expect(() => advance(failed)).toThrow('AI_DISPATCH_BLOCKED');
    expect(failFixtureSession(failed, reason, now)).toEqual(failed);
    const acknowledged = acknowledgeFixtureStop(failed, now);
    expect(acknowledged).toMatchObject({ status: 'failed', stopStatus: 'confirmed' });
    expect(advance(acknowledged)).toEqual(acknowledged);
    expect(acknowledged.events.filter(event => event.role === 'supplier')).toHaveLength(0);
  });

  it('rejects malformed category intent and permission revisions before creating a session', () => {
    expect(() => createFixtureConversation({ request: { ...gpu, intent: 'actual_need' } as never, sessionId: 's', supplierId: 'fixture-compute', permissionRevision: 4, now })).toThrow('INVALID_FIXTURE_INPUT');
    expect(() => createFixtureConversation({ request: table, sessionId: 's', supplierId: 'fixture-furniture', permissionRevision: 0, now })).toThrow('INVALID_FIXTURE_INPUT');
  });

  it('does not let late terminal callbacks replace a completed outcome or resume AI control', () => {
    const ended = advance(create());
    expect(failFixtureSession(ended, 'disconnected', now)).toEqual(ended);
    expect(takeOverFixtureSession(ended, now)).toEqual(ended);
  });

  it('cannot synthesize a reply or repair for a live-origin session', () => {
    const live = { ...create(), providerIds: ['live-provider-session'] };
    expect(() => advance(live)).toThrow('FIXTURE_ONLY');
    expect(() => failFixtureSession(live, 'disconnected', now)).toThrow('FIXTURE_ONLY');
    const supplierArtifact = { ...create(), events: [{ ...create().events[0], origin: 'supplier_artifact' as const }] };
    expect(() => takeOverFixtureSession(supplierArtifact, now)).toThrow('FIXTURE_ONLY');
  });

  it('does not attribute seeded terms to a different supplier identity', () => {
    const wrongSupplier = { ...create(), supplierId: 'different-supplier' };
    expect(() => advance(wrongSupplier)).toThrow('SUPPLIER_MISMATCH');
    expect(wrongSupplier.events).toHaveLength(2);
  });
});

describe('unavailable live adapter', () => {
  it('never invokes even valid quote-only tools or silently retries a disabled route', async () => {
    const actions: string[] = [];
    const tools: QuoteSessionTools = {
      async requestQuote(action) { actions.push(action.kind); return { sessionId: 'unexpected', providerActionId: 'unexpected' }; },
      async recordProposal(action) { actions.push(action.kind); return { quoteId: 'unexpected', quoteRevision: 1 }; },
      async stopSession(action) { actions.push(action.kind); },
    };
    await expect(startQuoteSession({ request: gpu, supplierId: 'supplier', permissionRevision: 4 }, tools)).rejects.toThrow('LIVE_ADAPTER_UNAVAILABLE');
    expect(actions).toEqual([]);
  });

  it('requires lead-owned session management for takeover and stop, independently of outreach authority', async () => {
    await expect(takeOver('unknown-session', 'buyer')).rejects.toThrow('SESSION_MANAGER_REQUIRED');
    await expect(stopSession('unknown-session', 'buyer')).rejects.toThrow('SESSION_MANAGER_REQUIRED');
  });
});
