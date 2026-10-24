import type { CaseRequest, QuoteSessionTools } from '../../shared/contracts';

/** Live integrations are deliberately unavailable in the placeholder MVP. Never dispatch supplied tools. */
export async function startQuoteSession(
  _input: { request: CaseRequest; supplierId: string; permissionRevision: number },
  _tools: QuoteSessionTools,
): Promise<{ sessionId: string }> {
  throw new Error('LIVE_ADAPTER_UNAVAILABLE: Claude, Cartesia and telephony are unconfigured. Use an explicitly synthetic fixture through the lead-owned session manager. No supplier was contacted.');
}

/** These signatures cannot find or authorize sessions without the lead\'s single session manager. */
export async function takeOver(_sessionId: string, _buyerId: string): Promise<void> {
  throw new Error('SESSION_MANAGER_REQUIRED: authenticate the buyer and apply takeOverFixtureSession in the lead-owned store. Takeover is separate from outreach authority.');
}

export async function stopSession(_sessionId: string, _buyerId: string): Promise<void> {
  throw new Error('SESSION_MANAGER_REQUIRED: authenticate the buyer and apply requestFixtureStop and acknowledgeFixtureStop in the lead-owned store. No provider termination was attempted.');
}
