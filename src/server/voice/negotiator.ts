import { CaseRequestSchema } from '../../shared/contracts';
import type { CaseRequest, ConversationEvent, SessionState } from '../../shared/contracts';
import { makeFixture } from '../../shared/seeds';

export { startQuoteSession, stopSession, takeOver } from './adapter';

export type FixtureConversationInput = {
  request: CaseRequest;
  sessionId: string;
  supplierId: string;
  permissionRevision: number;
  now?: string;
};

export type AdvanceFixtureInput = {
  session: SessionState;
  request: CaseRequest;
  permissionRevision: number;
  paused?: boolean;
  now?: string;
};

export type FixtureFailureReason = 'supplier_refusal' | 'ai_objection' | 'permission_withdrawn' | 'disconnected' | 'delivery_unknown';

const evaluationRequest = 'We are evaluating a purchasing-assistant prototype using an illustrative GPU configuration. There is no current customer workload or purchase commitment. Could you provide indicative pricing and terms? Please do not reserve capacity.';

function timestamp(now = new Date().toISOString()): string {
  if (!Number.isFinite(Date.parse(now))) throw new Error('INVALID_FIXTURE_INPUT: invalid timestamp.');
  return now;
}

function append(session: SessionState, role: ConversationEvent['role'], text: string, now?: string): SessionState {
  return {
    ...session,
    events: [...session.events, {
      id: `${session.sessionId}:fixture-event:${session.events.length + 1}`,
      at: timestamp(now), role, text, origin: 'synthetic_fixture',
    }],
  };
}

function assertFixture(session: SessionState): void {
  if (session.providerIds.length !== 0 || session.events.length === 0 || session.events.some(event => event.origin !== 'synthetic_fixture')) {
    throw new Error('FIXTURE_ONLY: synthetic transitions cannot operate on live-provider sessions or evidence.');
  }
}

function terminal(session: SessionState): boolean {
  return session.status === 'ended' || session.status === 'failed';
}

/** The lead authorizes and persists this local fixture; creating it grants no contact permission. */
export function createFixtureConversation(input: FixtureConversationInput): SessionState {
  const validRequest = CaseRequestSchema.safeParse(input.request);
  if (!validRequest.success || !Number.isSafeInteger(input.permissionRevision) || input.permissionRevision < 1 ||
      !input.sessionId.trim() || input.sessionId.length > 160 || !input.supplierId.trim() || input.supplierId.length > 160) {
    throw new Error('INVALID_FIXTURE_INPUT: valid typed request, IDs and positive permission revision required.');
  }
  const request = validRequest.data;
  const now = timestamp(input.now);
  let session: SessionState = {
    sessionId: input.sessionId, caseId: request.caseId, supplierId: input.supplierId,
    status: 'active', control: 'ai', providerIds: [], permissionRevision: input.permissionRevision,
    stopStatus: 'none', events: [],
  };
  session = append(session, 'system', `Explicitly synthetic fixture. Scenario intent: ${request.intent}. No supplier contacted, no provider connected, no recording created. Supplier replies are fictional proposals, never real supplier confirmations.`, now);
  return append(session, 'nainai', request.category === 'gpu'
    ? evaluationRequest
    : `I am assisting one buyer with an actual personal need for one ${request.requirements.condition} ${request.requirements.sku} coffee table. We are exploring a quote without placing an order. Could you provide the item price, delivery to Decatur, GA 30033, tax, mandatory fees, availability, condition and warranty? The total must be strictly under $150 including all required costs. Delivery service and any changed condition need separate buyer review.`, now);
}

/** One explicit deterministic step; no background work, model loop, retry or commercial side effect. */
export function advanceFixtureConversation(input: AdvanceFixtureInput): SessionState {
  const { session } = input;
  assertFixture(session);
  if (session.stopStatus === 'confirmed' && terminal(session)) return session;
  if (input.request.caseId !== session.caseId) throw new Error('CASE_MISMATCH: session and request differ.');
  if (input.permissionRevision !== session.permissionRevision) throw new Error('PERMISSION_CHANGED: discard queued AI work and stop through the session manager.');
  if (session.status !== 'active' || session.control !== 'ai' || session.stopStatus !== 'none' || input.paused) {
    throw new Error('AI_DISPATCH_BLOCKED: session is paused, taken over, stopping or terminal.');
  }
  const request = CaseRequestSchema.parse(input.request);
  const now = timestamp(input.now);
  const fixture = makeFixture(request, 'complete', now);
  const quote = fixture.quote!;
  if (quote.supplierId !== session.supplierId) throw new Error('SUPPLIER_MISMATCH: seeded terms belong only to their explicitly fictional supplier.');
  const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quote.totalCents! / 100);
  let next = append(session, 'supplier', `SYNTHETIC ROLE-PLAY / unconfirmed proposal: ${fixture.evidence[0].excerpt}\nIllustrative complete total: ${amount}. No real supplier made or confirmed these terms.`, now);
  next = append(next, 'nainai', 'These synthetic proposals are for nonbinding human review only. No offer is accepted, no order is placed, no funds or capacity are reserved, and no realized savings are claimed.', now);
  next = append(next, 'system', `Synthetic fixture script completed for ${request.intent}; no external conversation occurred.`, now);
  return { ...next, status: 'ended', stopStatus: 'confirmed' };
}

/** Buyer authentication and authority belong to the lead's session manager, separately from outreach. */
export function takeOverFixtureSession(session: SessionState, now?: string): SessionState {
  assertFixture(session);
  if (terminal(session) || session.control === 'human') return session;
  return { ...append(session, 'system', 'Synthetic human takeover: AI actions are blocked, including late or queued actions. This grants no new outreach authority.', now), control: 'human' };
}

export function requestFixtureStop(session: SessionState, reason: string, now?: string): SessionState {
  assertFixture(session);
  if (terminal(session) || session.stopStatus !== 'none') return session;
  return {
    ...append(session, 'system', `Synthetic stop requested: ${reason} AI actions are blocked. Awaiting explicit local fixture acknowledgement; no provider termination is claimed.`, now),
    stopStatus: 'pending',
  };
}

export function acknowledgeFixtureStop(session: SessionState, now?: string): SessionState {
  assertFixture(session);
  if (session.stopStatus === 'confirmed') return session;
  if (session.stopStatus !== 'pending') throw new Error('STOP_NOT_PENDING: request a fixture stop before acknowledging it.');
  return {
    ...append(session, 'system', 'Synthetic stop acknowledged locally. No provider callback or external termination occurred.', now),
    status: session.status === 'failed' ? 'failed' : 'ended', stopStatus: 'confirmed',
  };
}

export function failFixtureSession(session: SessionState, reason: FixtureFailureReason, now?: string): SessionState {
  assertFixture(session);
  if (terminal(session)) return session;
  return {
    ...append(session, 'system', `Synthetic ${reason}: AI actions stopped; termination remains pending. No automatic redial, follow-up, cross-channel retry or fabricated supplier response. Fresh appropriate authority is required for any future contact.`, now),
    status: 'failed', stopStatus: 'pending',
  };
}
