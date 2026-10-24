# NaiNai Wickman Falls Implementation Plan

> **Historical — superseded October 23:** Implement the [two-case quote-only plan](2026-10-23-nainai-quote-only.md) against its [current MVP](../specs/2026-10-23-nainai-quote-only-mvp-design.md). Preserve selected-table research and nonbinding negotiation tactics here; do not execute this file's purchase approval/draft request or budget reservation. Compute is evaluation-only; both cases finish with reviewed findings and no commercial action.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn a real, bounded supplier negotiation for one desired table into an evidence-backed decision, with an honest no-deal outcome and human-controlled draft purchase request.

**Architecture:** One TypeScript web app, server and SQLite database. One bounded Claude tool loop supplies Bargainer, Skeptic and Bookkeeper responsibilities; application code owns permissions, arithmetic, revision checks and reservations. Real Cartesia supplier voice and meaningful Apify evidence replace explicitly labeled fixture adapters without changing contracts.

**Tech Stack:** Proposed lead defaults: React/Vite, an established UI component kit, Express, TypeScript, Zod, SQLite, Vitest and Playwright. Pin compatible supported dependency versions at event start; no dependencies installed yet. One app/server, no distributed runtime or additional agent framework.

**Spec:** [Real supplier design](../specs/2026-10-23-nainai-real-supplier-design.md); [earlier contract/test reference](../specs/2026-10-23-nainai-mvp-design.md). This plan supersedes monitor/simulated-supplier-first task allocations. It is a reviewable planning artifact, not an instruction to start before the official event period.

## Global constraints

- Selected research target: one Wickman Falls dark-brown cocktail table, SKU **T318-1**, advertised **$177.14** by **Kenny's Warehouse Steals**, Mableton. Furniture Way Less's $179 Danville is a different seller/product.
- Delivery destination for research: Decatur, GA **30033**. No private street/apartment address in source, logs, fixtures, public searches or demo. Runtime delivery details stay private and are disclosed only within specifically authorized scope.
- Latest target is **strictly under $150**: use integer cents, `capCents=15000`, `capMode='exclusive'`; qualifying total is at most **14999 cents**. This tightens the earlier inclusive maximum. Tax, delivery and mandatory fees must be included.
- Buyer permits considering **inspected floor-model/open-box** alternatives. New remains the primary baseline; changed condition is a distinct option. Exact unit, defects, inspection evidence, warranty and buyer acceptance are required; photos alone do not certify structural condition. Inspection method, delivery deadline, service level and willingness to self-assemble remain open.
- One buyer, USD, one category, one selected supplier, one active negotiation. No automatic order, payment, deposit, binding acceptance, credit application or redial. Supplier contact itself has not been authorized.
- Separate AI participation, transcription, recording and public sharing permissions. Human may pause, take over or stop. Do not retain withdrawn recording content in demo surfaces.
- Public price/stock observations are not supplier commitments. A quote is approval-ready only with authentic supplier confirmation, required terms and known full cost. A supplier's explicit tax-inclusive quote may say tax is included without inventing a zero tax amount; preserve its statement and authoritative total. Conflicting or unspecified inclusions remain blocked.
- Personal pilot is real; any company budget/test world is explicitly synthetic. A reservation is internal application state, not a bank hold or merchant order.
- No product scaffold, dependencies, provider calls or implementation before the official event period. No measured results or earned sponsor eligibility yet. Second submission remains deferred.

## Negotiation playbook

1. Verify supplier, exact SKU, selected condition, availability, required delivery service and quote validity. Ask for the **normal initial all-in written quote before asking for a concession**. Do not treat the listing as an equivalent initial delivered quote.
2. With approved contact authority, disclose AI participation and request a nonbinding quote. Suggested opening request after baseline: **“Could you quote $130 total, including tax and delivery to 30033, for the T318-1? This is a quote request for the buyer to review, not an order.”** $130 is a proposed opening anchor, not an authorized offer or expected seller floor.
3. Ask which actual costs are flexible: item price, delivery charge, or a suitable existing delivery route. Flexible scheduling and self-assembly are optional trades only after buyer agreement. Do not promise immediate payment, repeat business, an order or a testimonial.
4. Use only fresh, identity-matched competitive evidence. An indexed [Emma Mason T318-1 listing](https://emmamason.com/wickman-falls-coffee-table-in-dark-brown-t318-1.html) displayed $136.80; direct web fetch was blocked and shipping/tax are unknown. Recheck before quoting this number; never call it a $136.80 delivered offer or claim the buyer received a quote.
5. Respond to an actual counteroffer rather than automatically raising the bid. Cap at three substantive counteroffers and one supplier session; stop earlier on refusal or permission loss. Final target remains below $150 all-in. Do not silently accept an additional freight, assembly or condition change.
6. If the new unit cannot qualify, ask whether an inspected floor/open-box T318-1 exists. Capture condition/defects/warranty/inspection separately and obtain buyer acceptance of that exact alternative. Distinguish a condition trade from a same-item negotiated reduction. Before negotiating that unit, obtain its own initial quote; only its equivalent before/after terms support a separate negotiated-reduction calculation.
7. Obtain original supplier-issued written terms with subtotal/inclusions, full total, delivery scope/window, condition, warranty, validity and relevant inspection conditions. If no qualifying confirmed quote exists, preserve **No qualifying offer** and end without acceptance.

Feasibility: even with zero additional costs, $177.14 must fall by $27.15 (15.33%) to reach $149.99. Positive tax/delivery requires a larger item-price concession or genuine fee reduction. This is a feasibility gap, not savings or a forecast. Kenny's [FAQ](https://kennyswarehousesteals.com/pages/faq) offers delivery quotations and typically 1–2 weeks for in-stock items; it does not establish stock on hand, 30033 service, a discount policy or Sunday availability.

## Review focus

1. A quote says “$145 delivered” but leaves tax or service scope unclear: show pending clarification and block approval (Tasks 1/3).
2. A cheaper quote concerns a different SKU, open-box condition, warranty or pickup terms: retain a separate alternative and block equivalent-scope savings claims (Tasks 1/3).
3. A revised fee arrives while the buyer is approving, or approval is retried concurrently: stale request fails; exactly one reservation survives (Tasks 1/5).
4. A supplier disconnects or withdraws recording permission during a response: stop the relevant action/assets without silent redial or invented agreement (Tasks 2/4).
5. A public catalog says available but the supplier has not confirmed local stock or delivery: separate observation from commitment and block approval-ready status (Tasks 2/3).

## Ownership and shared interfaces

One lead plus three workers. These paths are proposed create locations, not existing product files. Lead freezes `src/domain/contracts.ts`, owns changes to shared types and root integration; workers request contract changes rather than duplicating schemas.

| Owner | Exclusive file scope | Deliverable |
|---|---|---|
| Lead | `src/domain/contracts.ts`, `src/domain/checks.ts`, `src/server/db.ts`, `src/server/approval.ts`, `src/server/routes.ts`, root configuration/wiring, HACK.md | Consistent schemas, deterministic checks, authenticated buyer authority and atomic state |
| UI worker | `src/ui/**`, `src/ui/packet/**`, `docs/evidence/figma-stage-log.md` | One usable workspace early; clear costs/provenance, quote revision, takeover and decision packet |
| Voice worker | `src/services/negotiation/**`, `src/services/voice/**` | Bounded Claude/Cartesia session, permission and call recovery behavior |
| Evidence worker | `src/services/evidence/**`, `src/domain/fixtures/**`, `evals/**` | Meaningful Apify evidence, authentic quote ingestion, equal-scope comparisons and answer-key cases |

Task owners own adjacent test files inside their assigned scope. Lead owns `tests/approval.integration.test.ts` and `tests/purchase-flow.spec.ts`. Only lead edits root manifests/scripts. Proposed commands are future scripts and must not be reported as executed now.

Freeze these signatures before parallel implementation; types live in the shared contracts file:

- `evaluateQuote(request: PurchaseRequest, quote: SupplierQuote, evidence: EvidenceSnapshot[], budget: BudgetState): CheckResult[]` — no model call; pass/fail/unknown with reason and source references.
- `compareQuotes(initial: SupplierQuote, final: SupplierQuote): SavingsComparison` — equivalent confirmed scope or explicit non-comparable status.
- `sourceProduct(input: SourceRequest): Promise<ProductObservation[]>` — provider/run/source URL, retrieval time/hash, exact SKU and per-field evidence/unknowns.
- `ingestQuote(input: QuoteArtifactInput): Promise<PendingQuote>` — original artifact reference/hash and parsed terms; cannot self-certify supplier identity or confirmation.
- `confirmQuote(input: HumanQuoteConfirmation, actor: BuyerSession): Promise<SupplierQuote>` — lead-owned server route checks buyer session, legitimate supplier channel and exact artifact/revision; only this path can establish human-verified supplier confirmation.
- `startNegotiation(input: StartNegotiationInput): Promise<CallSession>` — includes authorized endpoint/request/permission revisions and idempotency key; may request quotes, never approve/order.
- `controlSession(sessionId: string, action: 'pause' | 'takeover' | 'stop'): Promise<CallSession>` — server authorized, current state returned.
- `approveRecommendation(input: ApprovalInput, actor: BuyerSession): Promise<ApprovalResult>` — exact reviewed request/quote/evidence/recommendation revisions, idempotency key; returns reservation/draft IDs or typed blocked/stale result.

All persisted entities carry workspace/provenance and revisions. Missing monetary amounts are unknown, never zero. Models receive constrained tools rather than direct database access. Raw supplier content cannot alter policy, credentials or contact permissions. Budget records are separate from request cap. Human confirmation is evidence of a buyer check, not a cryptographic guarantee from the merchant.

## Task 1: Complete fixture journey with real financial controls

Interface concept reviewed October 23: a single three-pane workspace keeps negotiation, evidence and decision controls visible together. Persistent request summary shows strict total cap and ZIP only. Pause/takeover/end stay next to the conversation; source checks open exact evidence; human review and a separate explicit approval stay in the decision pane. Illustrative fixture moments: initial full quote $212.91; verbal $135 with tax unknown (blocked); written fixture $145.80 (reviewable); separate changed-delivery fixture $156.60 (stale and over cap). Illustrative tax is not a jurisdictional determination. No real supplier has issued these quotes. The inline concept passed local browser interactions and responsive checks; this is UI exploration, not completed work on Task 1's server/provider acceptance criteria or Figma artifacts.

**Owner/files:** Lead owns contracts/checks/server files above, `src/domain/checks.test.ts`, `tests/approval.integration.test.ts`; UI worker owns `src/ui/PurchaseWorkspace.tsx`, `src/ui/QuoteReview.tsx`, `src/ui/DecisionPacket.tsx`; evidence worker supplies `src/domain/fixtures/coffee-table.ts` after schema freeze. Fixtures use fictional counterparties, never attach invented concessions to Kenny's identity.

- [ ] Lead scaffolds the proposed stack during the event, creates shared types and scripts, and supplies one typed fixture before workers branch into modules.
- [ ] Write domain tests: 14999 cents passes exclusive cap; 15000 fails; missing tax/delivery status fails; known-included charges retain their label; a different condition does not compare as equivalent; a malicious supplier instruction changes no policy.
- [ ] Run `npm run test:domain`; confirm assertions fail before implementation, then implement `evaluateQuote`/`compareQuotes` and rerun.
- [ ] Write approval tests: model principal rejected; unconfirmed quote blocked; expired/stale revision blocked; prior commitments reduce available budget; repeated/concurrent approval creates one reservation/draft/audit event; cancellation releases once.
- [ ] Implement minimal authenticated single-buyer server session, revisions, SQL transaction/uniqueness constraints and approval routes; run `npm run test:approval` until the specified cases pass. Credentials/tokens stay server-side; no public unauthenticated approval endpoint.
- [ ] UI worker renders request, observation/quote distinction, costs, checks, one human decision and packet against the frozen interfaces; labeled fixtures work before provider integration. Start actual Figma prototype contribution and stage log at this point, not after completion.
- [ ] Lead verifies `npm run test:e2e -- tests/purchase-flow.spec.ts`: eligible fixture -> review -> one reservation/draft packet; missing-cost/refusal fixture -> blocked decision. Commit the complete journey.

**Visible result:** a buyer can inspect a complete decision and its limits. **Evidence:** internal correctness only; synthetic merchant/finance labels persist. No real-negotiation or sponsor-runtime claim yet.

## Task 2: Core provider feasibility and real source observations

**Owner/files:** Voice worker `src/services/voice/cartesia.ts`, `src/services/voice/session.ts`, adjacent tests; evidence worker `src/services/evidence/apify.ts`, `src/services/evidence/normalize.ts`, adjacent tests. Lead supplies server-only credentials/configuration and route wiring.

- [ ] In parallel with fixture UI, verify one real Cartesia audio/session operation using the documented current API and an authorized participant/channel. Verify actual telephony transport/account access before assuming outbound capability. Do not contact the selected merchant without specific authority.
- [ ] Verify one actual Apify run that materially establishes T318-1 identity/specifications and a public observation; retain run ID, URL, time, raw excerpt/hash and field sources. A generic scrape badge is insufficient.
- [ ] Test unavailable source, blocked fetch, wrong SKU/variant, stale snapshot and catalog-available versus stock-confirmed distinctions; `npm run test:evidence` must reject invented facts and preserve unknowns.
- [ ] Test interruption, timeout, duplicate start and withdrawn recording permission in the voice adapter; `npm run test:voice` must stop relevant actions without automatic redial. Record actual observed provider behavior separately from fixture tests.
- [ ] Integrate the real adapters and mark saved-snapshot/replay paths visibly. Commit; drop/replace an unavailable optional provider rather than pretend success. If telephony is unavailable, a specifically arranged real supplier browser voice session is the existing fallback; a simulator cannot meet the real supplier milestone.

**Visible result:** evidence and voice have verifiable provider operations. **Track support:** Apify and Cartesia only if the actual integration performs their required central work; feasibility calls alone do not establish submission eligibility.

## Task 3: Authentic quotation and comparable decision

**Owner/files:** Evidence worker `src/services/evidence/quote-ingestion.ts`, `src/services/evidence/comparison.ts`, `evals/coffee-table-cases.ts`; lead server confirmation route; UI worker quote confirmation/evidence surfaces.

- [ ] Write tests for transcript-only proposal, mismatched sender, missing quote validity, conditional fee, wrong unit/condition/warranty, unconfirmed stock, missing inspection evidence and changed delivery terms.
- [ ] Implement ingestion to pending status and human supplier-channel/artifact checks through `confirmQuote`. Bind the original written quote to the exact reviewed revisions; model-extracted text alone never confirms it.
- [ ] Distinguish known inclusive charges from unspecified costs and validate the authoritative full total. Show actual line arithmetic where itemized; do not fabricate an itemization to force a total.
- [ ] Preserve separate new versus floor/open-box options. Surface inspection evidence and unresolved acceptance; no automatic waiver of condition requirements. `compareQuotes` refuses same-scope savings when terms changed.
- [ ] Run `npm run test:quotes` and `npm run eval:coffee-table`, inspecting exact observed case counts/results; commit. No passing count is written into the submission before it runs.

**Visible result:** the buyer can open the original quotation and understand every pass, failure or unknown. **Track support:** commerce trust, sourcing relevance and financial traceability; real evidence and synthetic evaluation remain separated.

## Task 4: One bounded supplier negotiation through the working system

**Owner/files:** Voice worker `src/services/negotiation/claude.ts`, `src/services/negotiation/policy.ts`, `src/services/negotiation/events.ts`, adjacent tests; UI worker conversation/control components; lead authorization route/integration.

- [ ] Test session start without contact authority, outbound buyer counteroffers above 14999 cents, attempts to place orders, fabricated competing quotes, permission loss and disconnect. Policy rejects these actions independently of model instructions. Inbound supplier quotes above the cap must still be captured and evaluated as over-budget, not discarded or mistaken for buyer authorization.
- [ ] Implement quote-request-only tools, up to three substantive counteroffers, disclosed AI voice, buyer monitoring/pause/takeover/stop, and event/proposal capture. Do not display hidden model reasoning; show actual actions, evidence, results and concise explanations.
- [ ] Once the human supplies contact scope and necessary permissions, conduct a genuine merchant conversation about the actual selected purchase. Capture initial/final written terms through Task 3. Preserve refusal, no answer and no suitable offer as distinct outcomes.
- [ ] Run `npm run test:negotiation` plus the full decision flow on the actual permitted evidence. Save a recording only when recording/public-demo permissions allow. If recording is unavailable, retain separately permitted written evidence.
- [ ] Commit without secrets/private address; record provider operation IDs and the actual real/recorded/fixture boundaries. No merchant order is created.

**Visible result:** real negotiation evidence, or an honest incomplete/no-deal result. **Track support:** substantive Cartesia and Claude work plus commerce execution; customer benefit remains measured, not assumed.

## Task 5: Judge-ready reliability and submission

**Owner/files:** Lead integration tests/README and `docs/evidence/submission-matrix.md`; UI worker Figma artifacts and packet polish; voice worker recovery/recording; evidence worker `evals/**`, repeatable demo data/reset and Q&A case results.

- [ ] Verify the real-case branch: qualifying confirmed offer -> human-reviewed internal draft/reservation; otherwise -> no qualifying offer with approval blocked. Preserve the actual outcome.
- [ ] Run meaningful domain, approval, voice, quote and end-to-end checks after final integration; additionally exercise revoked recording permission, changed supplier terms during approval, process restart and concurrent retry. Record commands/results and remaining failures.
- [ ] Use real evidence read-only in the demo. Offer judge changes in a visibly separate synthetic test workspace so an edited fee cannot masquerade as a new merchant quote.
- [ ] Prepare a 120-second demo: 0-15 strongest actual outcome; 15-30 buyer/constraints; 30-55 permitted real negotiation excerpt labeled recording; 55-80 confirmed costs/evidence; 80-105 live review/qualifying approval or blocked decision; 105-120 changed-term/stale-approval check in the labeled test workspace. No dependence on a merchant answering Sunday.
- [ ] Record the strongest authentic judgment if it occurs; do not stage a hidden fee or discount. If refusal occurs, use it honestly and show a separate passing fixture for internal reservation behavior.
- [ ] Finish source access, setup/limitations, demo image/video, saved Devpost draft, public artifact permissions and three timed rehearsals. Verify fresh setup works. Freeze optional features at T-12h and optional integrations at T-6h relative to the confirmed event deadline; core fixes/artifacts continue.
- [ ] Commit final evidence and distinguish actual runtime from development tools. Reconsider a second submission only after this gate and multiple-entry/reuse rules are resolved.

## Judge emphasis and track priorities

Use the published rubric, not guesses about table assignments. The [professional-background research](../../../OPENBOOKS_JUDGES.md) supports preparing answers on agent evaluation, finance controls, system reliability, evidence lineage and adoption; it does not predict personal scores.

| Judging dimension | Evidence to build and show |
|---|---|
| Application | The buyer's real desired table, actual manual alternative and observed result. One actual SMB purchasing walkthrough, if reachable, to test transferability; no invented interview |
| Intentionality | All-in cost and exact condition visible; one workspace; restrained NaiNai personality; understandable human control |
| Functionality | One genuine supplier flow plus live decision controls and authentic refusal/recovery branches |
| Creativity | Demonstrate a useful difference: evidence-backed bargaining that can reject an attractive but unsuitable deal. Do not claim the first negotiation agent |
| Technical complexity | Bounded tools, source provenance, confirmation, permission changes and atomic version-bound approval; show one behavior rather than list frameworks |

Five primary **program** evidence targets: Visa (shopping decision/trust), Cartesia (core voice), Microsoft (customer understanding/measured usefulness/end-to-end function), Apify (essential verified source run), Figma (actual prototype contribution, contemporaneous stage log, accessible Figma Slides and required demo artifacts). These are targets, not earned entries; see [track record](../../../CAL_HACKS_13_TRACKS.md).

Hyphenate is a conditional sixth: a clearly synthetic company finance workspace must demonstrate related roles, prior commitments, conflicting records/history, separation of duties and traceable state; personal bargaining alone is insufficient. Do not present a personal purchase as a company expense. Anthropic remains conditional on an actual narrow community/problem validation; no seventh target is added merely for using Claude. CREAO/Factory and other stretch integrations remain deferred until the core gate passes.

Measure actual negotiation result (including zero), eligible/blocked decision cases, duplicate/stale prevention and user completion/hesitation. Never prefill savings, time saved, adoption or accuracy. Novelty and SMB validation remain the weakest claims until evidence improves them.

## Self-review and execution handoff

This plan maps the existing real-supplier spec to five reviewable work blocks, gives one schema/authority owner, and assigns each review-focus case to tests. Methods of inspection, delivery service/deadline, account access and merchant-contact permissions remain human/runtime inputs; do not invent them. This does not prevent fixture implementation once its design/event gates are satisfied, but it blocks dependent external actions or approval-ready real offers.

Independent planning reviews checked the demo/track priorities and architecture, and a fresh builder check found no important unanswered planning questions. Lead self-review confirmed the strict cap, inbound-versus-outbound offer distinction, separate open-box baseline, confirmation path, file ownership, no-deal behavior and review-focus test assignments. No product tests have run: no product exists yet.

User already chose subagent development. Preserve lead plus three workers and the scope boundaries above; do not ask the user to select an execution method again. Review the plan before implementation, confirm the official hacking period, and apply the required implementation skills when execution is requested.
