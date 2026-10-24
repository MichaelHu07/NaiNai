import type { CampaignState, CaseRequest, FixtureScenario, PacketSnapshot, ProviderHealth, QuoteSnapshot, ReviewRecord, Revisions, SessionState } from '../shared/contracts';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
let csrfToken = '';
async function request<T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api${path}`, { method, credentials: 'same-origin', signal,
    headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(method !== 'GET' ? { 'x-csrf-token': csrfToken } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ code: 'HTTP_ERROR', message: `Request failed (${response.status})` }));
    throw new ApiError(response.status, error.code ?? 'HTTP_ERROR', error.message ?? 'Request failed');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
const key = () => crypto.randomUUID();
export const api = {
  async session(signal?: AbortSignal) { const result = await request<{ authenticated: boolean; csrfToken?: string }>('/auth/session', 'GET', undefined, signal); csrfToken = result.csrfToken ?? ''; return result; },
  async login(passphrase: string) { const result = await request<{ csrfToken: string }>('/auth/login', 'POST', { passphrase }); csrfToken = result.csrfToken; },
  async logout() { await request('/auth/logout', 'POST', {}); csrfToken = ''; },
  cases: (signal?: AbortSignal) => request<CaseRequest[]>('/cases', 'GET', undefined, signal),
  packet: (id: string, signal?: AbortSignal) => request<PacketSnapshot>(`/cases/${encodeURIComponent(id)}/packet`, 'GET', undefined, signal),
  campaign: (signal?: AbortSignal) => request<CampaignState>('/campaign', 'GET', undefined, signal),
  health: (signal?: AbortSignal) => request<ProviderHealth>('/health', 'GET', undefined, signal),
  review: (id: string, expectedRevisions: Revisions) => request<ReviewRecord>(`/cases/${encodeURIComponent(id)}/reviews`, 'POST', { expectedRevisions, idempotencyKey: key() }),
  updateRequest: (id: string, requestValue: CaseRequest, expectedRevisions: Revisions) => request<PacketSnapshot>(`/cases/${encodeURIComponent(id)}/request`, 'PATCH', { request: requestValue, expectedRevisions }),
  scenario: (id: string, scenario: FixtureScenario, expectedRevisions: Revisions) => request<PacketSnapshot>(`/fixtures/cases/${encodeURIComponent(id)}/scenario`, 'POST', { scenario, expectedRevisions }),
  fee: (id: string, quote: QuoteSnapshot, expectedRevisions: Revisions) => request<PacketSnapshot>(`/fixtures/cases/${encodeURIComponent(id)}/quote`, 'PATCH', { quote, expectedRevisions }),
  sharing: (id: string, sharing: boolean, expectedRevisions: Revisions) => request<PacketSnapshot>(`/cases/${encodeURIComponent(id)}/permissions`, 'PATCH', { sharing, expectedRevisions }),
  start: (id: string, expectedRevisions: Revisions) => request<CampaignState>(`/fixtures/cases/${encodeURIComponent(id)}/conversation`, 'POST', { expectedRevisions, idempotencyKey: key() }),
  pause: () => request<CampaignState>('/campaign/pause', 'POST', {}),
  resume: () => request<CampaignState>('/campaign/resume', 'POST', {}),
  takeover: (id: string) => request<SessionState>(`/sessions/${encodeURIComponent(id)}/takeover`, 'POST', {}),
  stop: (id: string) => request<SessionState>(`/sessions/${encodeURIComponent(id)}/stop`, 'POST', {}),
  advance: (id: string) => request<SessionState>(`/sessions/${encodeURIComponent(id)}/advance`, 'POST', {}),
  async save(id: string) {
    const response = await fetch(`/api/reviews/${encodeURIComponent(id)}/export`, { credentials: 'same-origin' });
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new ApiError(response.status, body.code ?? 'EXPORT_FAILED', body.message ?? 'Packet could not be saved.'); }
    const blob = await response.blob(), url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = `nainai-${id}.json`; anchor.click(); URL.revokeObjectURL(url);
  },
};
