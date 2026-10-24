import { test, expect } from '@playwright/test';

// Optional integrated smoke: the lead may supply a dedicated, temporary local
// server and its startup key. This never uses a real provider or supplier.
test('real local fixture server completes both cases and rejects a stale review', async ({ page }) => {
  test.skip(!process.env.NAINAI_UI_SMOKE_KEY, 'Needs a dedicated local fixture server and NAINAI_UI_SMOKE_KEY.');
  await page.goto('/');
  await page.getByLabel('Startup passphrase').fill(process.env.NAINAI_UI_SMOKE_KEY!);
  await page.getByRole('button', { name: 'Open workspace', exact: true }).click();
  await expect(page.getByText('Actual personal need', { exact: true })).toBeVisible();
  await page.getByLabel('Fixture scenario').selectOption('missing_cost');
  await expect(page.getByRole('definition').filter({ hasText: 'Unknown' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Review findings', exact: true }).click();
  await page.getByRole('button', { name: 'Mark reviewed', exact: true }).click();
  await expect(page.getByText('Reviewed snapshot', { exact: true })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save quote packet' }).click();
  expect((await download).suggestedFilename()).toMatch(/nainai.*\.json$/);
  await page.getByLabel('Fixture scenario').selectOption('complete');
  await page.getByLabel('Buyer delivery service').selectOption('doorstep');
  await expect(page.getByText('qualifying table quote', { exact: true })).toBeVisible();
  if (await page.getByRole('button', { name: 'Resume synthetic conversations' }).count()) await page.getByRole('button', { name: 'Resume synthetic conversations' }).click();
  await page.getByRole('button', { name: 'Start synthetic conversation', exact: true }).click();
  await page.getByRole('button', { name: 'Advance rehearsal', exact: true }).click();
  await expect(page.getByText('synthetic conversation active', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: /GPU compute/ }).click();
  await page.getByLabel('Fixture scenario').selectOption('minimum_term');
  await expect(page.getByText('Evaluation only', { exact: true })).toBeVisible();
  await expect(page.getByText('$2,688.00', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Review findings', exact: true }).click();
  await page.getByText('Test a changed term (synthetic only)', { exact: true }).click();
  await page.getByLabel('Synthetic mandatory fee (USD)').fill('10');
  await page.getByRole('button', { name: 'Apply fee change' }).click();
  await page.getByRole('button', { name: 'Mark reviewed', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(/changed|stale|revision/i);
  await expect(page.getByText('Reviewed snapshot', { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Evaluation only', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Fixture scenario')).toHaveValue('');
  await page.screenshot({ path: '.runtime/ui-real-gpu.png', fullPage: true });
});
