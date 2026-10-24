import { test, expect, type Page } from '@playwright/test';
import { seedCases, makeFixture } from '../../src/shared/seeds';
import type { CampaignState, PacketSnapshot, FixtureScenario } from '../../src/shared/contracts';

// The API process is owned by the lead. Browser tests isolate that boundary;
// production components and their fetch/CSRF/revision handling run unchanged.
async function workspace(page: Page, pendingStop = false, configure?: (packets: Map<string, PacketSnapshot>, campaign: CampaignState) => void) {
  const packets = new Map<string, PacketSnapshot>();
  for (const request of structuredClone(seedCases)) {
    const fixture = makeFixture(request);
    packets.set(request.caseId, { workspaceId: 'fixture', case: request, ...fixture,
      assessment: { outcome: request.category === 'table' ? 'needs_clarification' : 'evaluation_findings', headline: request.category === 'table' ? 'Delivery service needs clarification' : 'Evaluation-only findings; no real workload or capacity reservation', checks: [], unknowns: request.category === 'table' ? ['Buyer delivery service is unresolved'] : ['Availability is indicative; capacity is not reserved'], knownTotalCents: request.category === 'table' ? 14400 : 172800, totalCents: request.category === 'table' ? 14400 : 172800, confirmed: true, comparableScope: request.category === 'gpu' },
      revisions: { request: 1, quote: 1, evidence: 1, permission: 1 }, review: null });
  }
  const campaign: CampaignState = { paused: false, cancellationRevision: 1, jobs: [], sessions: [], counts: { observations: 0, suppliersContacted: 0, replies: 0, confirmedQuotes: 0, fixtureSessions: 0 } };
  configure?.(packets, campaign);
  let stale = false;
  await page.route('**/api/**', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname;
    const send = (body: unknown, status = 200) => route.fulfill({ status, json: body });
    if (path === '/api/auth/session') return send({ authenticated: true, csrfToken: 'test-token' });
    if (path === '/api/cases') return send([...packets.values()].map(p => p.case));
    if (path === '/api/health') return send({ status: 'ok', mode: 'fixture', contactEnabled: false, providers: { claude: 'unconfigured', cartesia: 'unconfigured', apify: 'unconfigured' } });
    if (path === '/api/reviews/review-1/export') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([...packets.values()].find(packet => packet.review)?.review) });
    if (path === '/api/campaign') return send(campaign);
    if (path.startsWith('/api/campaign/')) { campaign.paused = path.endsWith('/pause'); return send(campaign); }
    if (path.startsWith('/api/sessions/')) {
      const session = campaign.sessions[0];
      if (path.endsWith('/takeover')) session.control = 'human';
      else { session.status = pendingStop ? 'active' : 'ended'; session.stopStatus = pendingStop ? 'pending' : 'confirmed'; }
      return send(session);
    }
    const id = path.includes('/cases/') ? path.split('/cases/')[1].split('/')[0] : '';
    const packet = packets.get(id);
    if (!packet) return send({ code: 'NOT_FOUND', message: 'Unknown fixture' }, 404);
    if (request.method() !== 'GET' && request.headers()['x-csrf-token'] !== 'test-token') return send({ message: 'CSRF missing' }, 403);
    if (path.endsWith('/packet')) return send(packet);
    const body = request.postDataJSON();
    if (path.endsWith('/scenario')) {
      const fixture = makeFixture(packet.case, body.scenario as FixtureScenario);
      Object.assign(packet, fixture); packet.revisions.quote = (packet.revisions.quote ?? 0) + 1;
      packet.review = null;
      packet.assessment.headline = body.scenario === 'missing_cost' ? 'Missing delivery cost' : body.scenario === 'over_budget' ? 'Above the strict cap' : 'Delivery service needs clarification';
      packet.assessment.totalCents = fixture.quote?.totalCents ?? null;
      packet.assessment.unknowns = body.scenario === 'missing_cost' ? ['Delivery cost is unknown'] : [];
      return send(packet);
    }
    if (path.endsWith('/request')) { packet.case = body.request; packet.revisions.request++; packet.review = null; return send(packet); }
    if (path.endsWith('/permissions')) { packet.revisions.permission++; packet.evidence.forEach(e => e.permissions.sharing = body.sharing); packet.review = null; return send(packet); }
    if (path.endsWith('/quote')) { packet.quote = body.quote; packet.revisions.quote!++; stale = true; packet.review = null; return send(packet); }
    if (path.endsWith('/reviews')) {
      if (stale && body.expectedRevisions.quote !== packet.revisions.quote) return send({ code: 'STALE_REVISION', message: 'Terms changed. Review the current packet.' }, 409);
      const { review: _, ...snapshot } = structuredClone(packet);
      packet.review = { id: 'review-1', buyerId: 'buyer', reviewedAt: new Date().toISOString(), revisions: packet.revisions, packet: snapshot };
      return send(packet.review);
    }
    if (path.endsWith('/conversation')) { campaign.sessions = [{ sessionId: 'session-1', caseId: id, supplierId: 'fixture', status: 'active', control: 'ai', providerIds: [], permissionRevision: 1, stopStatus: 'none', events: [{ id: 'e1', at: new Date().toISOString(), role: 'supplier', text: 'Synthetic supplier reply. No actual supplier was contacted.', origin: 'synthetic_fixture' }] }]; campaign.counts.fixtureSessions++; return send(campaign); }
    return send({ code: 'NOT_FOUND', message: path }, 404);
  });
  await page.goto('/');
  return { packets, campaign };
}

test('case switching preserves buyer intent and original source boundaries', async ({ page }) => {
  await workspace(page);
  await expect(page.getByText('Actual personal need', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Inspect original source' }).first().click();
  await expect(page.getByRole('dialog')).toContainText('SYNTHETIC SUPPLIER / SANDBOX TAX');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /GPU compute/ }).click();
  await expect(page.getByText('Evaluation only', { exact: true })).toBeVisible();
  await expect(page.getByText(/No actual workload, company buyer or buying commitment/)).toBeVisible();
  await expect(page.getByText('Synthetic fixture', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /purchase|reserve|checkout|accept offer/i })).toHaveCount(0);
});

test('reviewing incomplete findings preserves unknown cost and failed cap', async ({ page }) => {
  await workspace(page);
  await page.getByLabel('Fixture scenario').selectOption('missing_cost');
  await expect(page.getByText('Delivery cost is unknown', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Review findings', exact: true }).click();
  await page.getByRole('button', { name: 'Mark reviewed', exact: true }).click();
  await expect(page.getByText('Reviewed snapshot', { exact: true })).toBeVisible();
  await expect(page.getByText('Delivery cost is unknown', { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save quote packet' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('nainai-review-1.json');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.packet.quote.costs.delivery.status).toBe('unknown');
  expect(exported.packet.case.intent).toBe('actual_need');
  expect(exported.packet.evidence[0].origin).toBe('synthetic_fixture');
  await page.getByLabel('Fixture scenario').selectOption('over_budget');
  await expect(page.getByText('Above the strict cap', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save quote packet' })).toBeDisabled();
});

test('changed fee rejects an open review and refreshes current revisions', async ({ page }) => {
  await workspace(page);
  await page.getByRole('button', { name: 'Review findings', exact: true }).click();
  await page.getByText('Test a changed term (synthetic only)', { exact: true }).click();
  await page.getByLabel('Synthetic mandatory fee (USD)').fill('10');
  await page.getByRole('button', { name: 'Apply fee change' }).click();
  await page.getByRole('button', { name: 'Mark reviewed', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(/changed|stale/i);
  await expect(page.getByText('Reviewed snapshot', { exact: true })).toHaveCount(0);
});

test('human controls wait for acknowledged server state and keep genuine counters distinct', async ({ page }) => {
  await workspace(page);
  await page.getByRole('button', { name: 'Start synthetic conversation' }).click();
  await expect(page.getByText('Synthetic supplier reply. No actual supplier was contacted.')).toBeVisible();
  await page.getByRole('button', { name: 'Pause all conversations' }).click();
  await expect(page.getByRole('button', { name: 'Resume synthetic conversations' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume synthetic conversations' }).click();
  await page.getByRole('button', { name: 'Take over conversation' }).click();
  await expect(page.getByText('Human control', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Stop conversation', exact: true }).click();
  await expect(page.getByText('Stop confirmed', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Actual supplier contacts')).toContainText('0');
  await expect(page.getByLabel('Actual supplier replies')).toContainText('0');
  await expect(page.getByLabel('Actual confirmed quotes')).toContainText('0');
});

test('delivery and sharing choices create new revisions and invalidate reviewed snapshots', async ({ page }) => {
  await workspace(page);
  const request = page.waitForRequest(request => request.method() === 'PATCH' && request.url().endsWith('/request'));
  await page.getByLabel('Buyer delivery service').selectOption('doorstep');
  expect((await request).postDataJSON().request.requirements.deliveryService).toBe('doorstep');
  await page.getByRole('button', { name: 'Review findings', exact: true }).click();
  await page.getByRole('button', { name: 'Mark reviewed', exact: true }).click();
  await expect(page.getByText('Reviewed snapshot', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Revoke sharing' }).click();
  await expect(page.getByText('Revoked for current evidence', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save quote packet' })).toBeDisabled();
});

test('pending stop stays pending and does not falsely report completion', async ({ page }) => {
  await workspace(page, true);
  await page.getByRole('button', { name: 'Start synthetic conversation' }).click();
  await page.getByRole('button', { name: 'Stop conversation', exact: true }).click();
  await expect(page.getByText('Stop pending — awaiting acknowledgement', { exact: true })).toBeVisible();
  await expect(page.getByText('Stop confirmed', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Stop conversation', exact: true })).toBeDisabled();
});

test('both cases remain operable at desktop and phone widths with keyboard source inspection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  await workspace(page);
  await expect(page.getByRole('heading', { name: 'The Skeptic', exact: true })).toBeVisible();
  await page.screenshot({ path: '.runtime/ui-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Inspect original source' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Inspect original source' })).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /GPU compute/ }).click();
  await expect(page.getByText('Evaluation only', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: '.runtime/ui-mobile.png', fullPage: true });
  await page.getByText('Edit illustrative assumptions', { exact: true }).click();
  await page.getByLabel('Continuous hours', { exact: true }).fill('96');
  const update = page.waitForRequest(request => request.method() === 'PATCH' && request.url().endsWith('/request'));
  await page.getByRole('button', { name: 'Save new request revision' }).click();
  expect((await update).postDataJSON().request.requirements.continuousHours).toBe(96);
});

test('background packet refresh replaces expired qualification and current review without manual refresh', async ({ page }) => {
  const now = new Date();
  await page.clock.install({ time: now });
  const { packets } = await workspace(page, false, packets => {
    const packet = packets.get('table')!;
    packet.quote!.expiresAt = new Date(now.getTime() + 5000).toISOString();
    packet.assessment.outcome = 'qualifying_table_quote';
    packet.assessment.headline = 'Qualifying synthetic quote';
    packet.assessment.unknowns = [];
    const { review: _, ...snapshot } = structuredClone(packet);
    packet.review = { id: 'valid-review', buyerId: 'buyer', reviewedAt: now.toISOString(), revisions: packet.revisions, packet: snapshot };
  });
  await expect(page.getByText('qualifying table quote', { exact: true })).toBeVisible();
  await expect(page.getByText('Reviewed snapshot', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Review findings', exact: true }).click();
  const packet = packets.get('table')!;
  packet.assessment.outcome = 'needs_clarification';
  packet.assessment.headline = 'Quote expired; reconfirm current terms';
  packet.assessment.unknowns = ['Quote validity expired'];
  packet.review = null;
  await page.clock.fastForward(10001);
  // Polling must not replace the intentionally captured review dialog snapshot.
  await expect(page.getByRole('dialog')).toContainText('Qualifying synthetic quote');
  await page.getByRole('button', { name: 'Back to findings' }).click();
  await expect(page.getByText('Quote expired; reconfirm current terms', { exact: true })).toBeVisible();
  await expect(page.getByText('qualifying table quote', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Reviewed snapshot', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Save quote packet' })).toBeDisabled();
});

for (const control of ['takeover', 'stop'] as const) {
  test(`delayed background response cannot reverse acknowledged ${control}`, async ({ page }) => {
    await page.clock.install();
    await workspace(page);
    await page.getByRole('button', { name: 'Start synthetic conversation' }).click();
    let release: () => void = () => {};
    let arrived: () => void = () => {};
    const pending = new Promise<void>(resolve => { release = resolve; });
    const polling = new Promise<void>(resolve => { arrived = resolve; });
    await page.route('**/api/health', async route => {
      arrived(); await pending;
      await route.fulfill({ json: { status: 'ok', mode: 'fixture', contactEnabled: false, providers: { claude: 'unconfigured', cartesia: 'unconfigured', apify: 'unconfigured' } } });
    });
    const staleCampaign = page.waitForResponse(response => response.url().endsWith('/api/campaign') && response.request().method() === 'GET');
    await page.clock.fastForward(10001);
    await polling;
    await staleCampaign;
    await page.getByRole('button', { name: control === 'takeover' ? 'Take over conversation' : 'Stop conversation', exact: true }).click();
    const label = control === 'takeover' ? 'Human control' : 'Stop confirmed';
    await expect(page.getByText(label, { exact: true })).toBeVisible();
    const settled = page.waitForResponse(response => response.url().endsWith('/api/health'));
    release(); await settled;
    await page.clock.runFor(100);
    await expect(page.getByText(label, { exact: true })).toBeVisible();
    await expect(page.getByText('Synthetic conversation active', { exact: true })).toHaveCount(0);
  });
}
