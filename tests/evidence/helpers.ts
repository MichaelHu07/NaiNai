import { seedCases, makeFixture } from '../../src/shared/seeds';
import type { CaseRequest, QuoteSnapshot, AssessmentContext } from '../../src/shared/contracts';
export const now='2026-10-24T12:00:00Z';
export const context:AssessmentContext={conversationOutcome:'complete',reason:'Synthetic fixture',now};
export function table(){const request=structuredClone(seedCases[0]) as Extract<CaseRequest,{category:'table'}>;request.requirements.deliveryService='doorstep';const quote=makeFixture(request,'complete',now).quote!;return {request,quote};}
export function gpu(){const request=structuredClone(seedCases[1]) as Extract<CaseRequest,{category:'gpu'}>;return {request,quote:makeFixture(request,'complete',now).quote!};}
export function setTotal(quote:QuoteSnapshot,total:number){quote.costs.item={status:'known',amountCents:total-2400};quote.totalCents=total;}
