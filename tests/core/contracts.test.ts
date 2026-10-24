import { describe, it, expect } from 'vitest';
import { CaseRequestSchema, QuoteSnapshotSchema, ToolActionSchema } from '../../src/shared/contracts';
import { seedCases, makeFixture } from '../../src/shared/seeds';
describe('capability and intent contracts', () => {
  it('rejects commercial and unknown tool actions', () => {
    for (const kind of ['pay', 'accept', 'reserve', 'provision']) expect(ToolActionSchema.safeParse({kind}).success).toBe(false);
  });
  it('rejects a compute request labeled as an actual purchase need', () => {
    expect(CaseRequestSchema.safeParse({...seedCases[1],intent:'actual_need'}).success).toBe(false);
  });
  it('rejects a personal request containing an extra private address field', () => {
    expect(CaseRequestSchema.safeParse({...seedCases[0],address:'private'}).success).toBe(false);
  });
  it('accepts both complete typed requests and their synthetic quote schemas', () => {
    for (const request of seedCases) {
      expect(CaseRequestSchema.safeParse(request).success).toBe(true);
      expect(QuoteSnapshotSchema.safeParse(makeFixture(request).quote).success).toBe(true);
    }
  });
  it('accepts a bounded research action but rejects arbitrary added fields', () => {
    const action={kind:'research',caseId:'table',requestRevision:1,permissionRevision:1,idempotencyKey:'research-1',sourceIds:['public-listing']};
    expect(ToolActionSchema.safeParse(action).success).toBe(true);
    expect(ToolActionSchema.safeParse({...action,paymentToken:'forbidden'}).success).toBe(false);
  });
});
