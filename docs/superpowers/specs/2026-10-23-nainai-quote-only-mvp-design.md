# NaiNai quote-only MVP: real table need and compute evaluation

October 23, 2026. The user selected **one workflow demonstrated in two cases**, without purchasing anything. This is the current MVP design. It supersedes the [single-supplier revision](2026-10-23-nainai-real-supplier-design.md), the original monitor/finance sandbox and the earlier Wickman Falls implementation plan wherever they conflict. No app has been scaffolded, provider called or supplier contacted. The existing inline mockup is an interface exploration, not a running procurement system.

## Product, approach and finish line

**Grandma means business.** NaiNai gathers requirements, researches suppliers, requests and negotiates quotations within authorized scope, checks the evidence and gives the buyer a reviewed, nonbinding decision packet.

The user considered a general-purpose buyer, a compute-only product and two demonstrations of a shared workflow. Selected approach: **one quote-only product with two bounded category playbooks**. This supports transfer without claiming universal procurement competence or maintaining two products. The genuine personal table request supplies real user need; compute illustrates potential business usefulness without inventing a customer.

Shared journey: request -> bounded parallel research -> deduplicated shortlist -> separately authorized quote requests/negotiation -> source-linked checks -> human review -> saved quote/findings packet.

The endpoint is **Review findings / Mark reviewed / Save quote packet**. Review records what the human inspected; it does not accept a supplier offer. A successful outcome may be a qualifying table quote, evaluation findings, missing information, refusal or no qualifying offer. A genuine interaction need not produce a concession.

Excluded from this MVP, for both people and agents: checkout, merchant orders, purchase-order/draft purchase-request creation, financial or provider-capacity reservations, contracts/offer acceptance, deposits, payments, funded trials and instance launch/provisioning. No corresponding tools or routes may be exposed. Historical budget-reservation/approval logic is not a current acceptance requirement. Infrastructure/API usage for building the app is separate from buying suppliers' products and is subject to available account authority.

## Two case definitions

| Field | Coffee table | GPU cloud compute |
|---|---|---|
| Intent | `actual_need`: user genuinely needs a table | `evaluation_only`: no actual workload, team or current purchase plan |
| Buyer | Actual user, personal purchase | Actual user evaluating the prototype; no fictional company representation |
| Requirements | Wickman Falls dark-brown T318-1, quantity one; delivery to Decatur GA 30033; new baseline | Explicit illustrative configuration below; not a claimed production workload |
| Budget | Strictly under $150 including tax, delivery and mandatory fees: `totalCents < 15000`, at most 14999 | Proposed evaluation ceiling $2,000 inclusive (`totalCents <= 200000`), clearly synthetic; not purchasing authority and unrelated to the personal cap |
| Acceptable alternatives | Inspected floor/open-box unit may be considered with exact condition, inspection, warranty and human acceptance | Different GPU, interruption, region or commitment is a separate alternative requiring visible tradeoffs |
| Evidence target | Actual authorized merchant conversation and original written terms | Public provider evidence plus genuine indicative provider reply if obtainable through an authorized evaluation request |
| Claim supported | This buyer's real need and observed quote-negotiation result | Demonstrated handling of evaluation assumptions; not AI-company adoption, workload validation or realized savings |

Table research snapshot: [Kenny's Warehouse Steals](https://kennyswarehousesteals.com/products/wickman-falls-cocktail-table) advertised T318-1 at $177.14 when checked October 23. Its [FAQ](https://kennyswarehousesteals.com/pages/faq) offers delivery quotes. These establish an observed listing/contact route, not stock on hand, 30033 coverage, a delivered quote or willingness to negotiate. Furniture Way Less's $179 Danville is a different table/seller. Delivery service/deadline, self-assembly tolerance and open-box inspection method remain human inputs. Do not assume flexibility or treat photos as structural certification.

**Proposed evaluation seed, chosen by the lead for reproducibility:** eight H100 80 GB SXM GPUs on one node with NVLink; 72 continuous, non-interruptible hours; a US region; example start November 1, 2026, 09:00 UTC; 1 TB persistent storage and up to 1 TB outbound data over that period. These are illustrative purchasing assumptions, not proof that a model/workload needs or fits this hardware. Record each assumption's origin. Unknown technical requirements or provider fees stay unknown. No performance/throughput guarantee is inferred from GPU labels.

For cloud comparisons, record GPU model/form factor/count/VRAM, node topology/interconnect, region, proposed start, provider availability statement, interruption, billable duration/minimum term/increment, mandatory CPU/RAM bundle, storage, networking/egress, support, setup, tax, total commitment, validity and caveats. A published rate does not confirm capacity; a genuine indicative quote is still conditional on its stated assumptions and availability.

## Authority and bounded agent work

Product roles remain Bargainer, Skeptic and Bookkeeper: negotiation, evidence/requirements checks, and complete cost/quote record. They need not be three frameworks or uncontrolled chatbot conversations. One coordinator and bounded workers run typed jobs; actual actions/results are visible, not invented internal reasoning.

Proposed MVP defaults: up to three concurrent public-research jobs, up to 100 candidate observations if sources actually supply them, at most five buyer-approved distinct suppliers across both cases, and **one active external conversation globally**. Contacts require separate specific authority; this design update authorizes no messages or calls. A shortlist/review is not contact permission. Hundreds of candidate records/tasks are not hundreds of suppliers contacted. Larger capacity tests use isolated labeled fixtures.

Deduplicate canonical supplier identity and endpoint before dispatch. At most one initial contact per supplier/purpose without additional authority; no silent redial, cross-channel retry or follow-up. Honor refusal/opt-out. A global campaign pause prevents queued/future external actions; terminate the active conversation through explicit stop. Do not claim a queued pause can unsend a delivered message. Permission and cancellation revisions must be checked immediately before each external tool action.

Capture authorized endpoint, purpose, truthful buyer identity, request/permission revisions, contact/time/cost limits, and AI/transcription/recording/public-sharing permissions separately. Reveal AI participation. Human can monitor, pause, take over and stop. If permission is withdrawn, stop the affected activity and remove withdrawn assets from demo surfaces; retain only independently permitted written evidence and minimal permission-change records. Do not promise provider-side deletion without verifying it.

Table contact wording: actual personal need, exploring a quote without placing an order. Compute wording: **“We are evaluating a purchasing-assistant prototype using an illustrative GPU configuration. There is no current customer workload or purchase commitment. Could you provide indicative pricing and terms? Please do not reserve capacity.”** Never invent a company, budget authorization, purchasing volume, urgency, competing quote or future business. If a contact route requires a company we cannot truthfully name, do not fill in a fictional one; use a legitimate research route or skip it.

## Evidence, checks and quote review

Keep two independent labels on every view/export: **scenario intent** (`actual_need` / `evaluation_only`) and **evidence origin** (`public_observation` / `supplier_artifact` / `conversation_proposal` / `synthetic_fixture`). An evaluation case may contain a real provider response; that does not create a real workload. Synthetic counterparties never stand in for real suppliers.

Preserve source/provider/run identifiers, URL/channel, timestamp, original artifact/hash, exact excerpt, supplier identity check, quoted scope, revisions, expiry and permissions. Extracted transcript/model text is a proposal. Original written terms or authenticated supplier participation plus recorded human verification establish confirmation; the model cannot confirm its own extraction. Human verification is not a cryptographic merchant guarantee.

Use integer cents for final totals and decimal-safe rates/quantity/time calculations; do not round per-GPU-hour prices to whole cents prematurely. Preserve original currency/units; MVP compares USD only. Missing money is not zero. Preserve explicit “included” charges without inventing a tax itemization. Unknown required costs/specifications prevent a qualifying-table or complete-evaluation-cost claim; saving incomplete findings remains allowed.

Table checks include exact product/unit/condition, delivery/service, stock confirmation, warranty, full costs, quote validity and the exclusive cap. A condition switch has its own initial quote/baseline and cannot be attributed entirely to bargaining.

Compute checks state **matches / fails / unknown against illustrative requirements**, never “validated for the customer's workload.” Normalize billable terms and complete commitment before comparing. Example-only computation: eight GPUs for 72 hours at $3/GPU-hour costs $1,728 before fees; $2/GPU-hour with a one-week minimum costs $2,688 before fees. These are fictional rates, not supplier quotations. Longer commitment is a changed-scope comparison, not equivalent savings.

Outcome labels: `qualifying_table_quote`, `no_qualifying_offer`, `needs_clarification`, `evaluation_findings`, `declined`, `no_response`. Human review binds the exact request/quote/evidence/permission revisions and preserves outcome/uncertainty. Review does not make an incomplete quote qualifying. Changed terms make the earlier review stale; keep its historical snapshot, require review of the new revision, and create no commercial action. Duplicate/concurrent review of the same revision returns one review record.

Report authentic equivalent-scope before/after differences as **confirmed negotiated quote reduction**; for compute, add **evaluation-only**. A public-rate comparison, published discount, changed commitment, demo credit or sponsorship is labeled separately. No purchases means **no realized savings** in this MVP.

## Interface and two-minute demo

One workspace with a case switcher and persistent intent badge. Show the request/cap/assumptions, agent task list, transcript and pause/takeover/end, evidence checks with originals, cost comparison, and human quote review. Keep research/contact/reply/confirmed-quote counts separate and measured. An unresolved/no-response result stays visible.

Keep the three-pane layout of the existing mockup. Its fictional quotations and “Approve draft/reservation” interaction are historical UI examples; replace those actions with nonbinding review/export before calling it the current MVP. Do not present local prototype interactions as server or provider enforcement.

Default pitch: coffee table first because it is the actual need; compute is a shorter transfer demonstration. No actual provider/customer evidence exists yet. Use genuine evidence from the working system during the event, permitted and explicitly labeled recordings for negotiation, and live checks/review. Do not depend on a supplier answering during judging. Detailed timing, presenter copy and fallbacks: [demo plan](../../NAINAI_DEMO.md).

| Seconds | On screen | Evidence boundary |
|---|---|---|
| 0-12 | Real table request and < $150 full-cost constraint | Genuine personal need; no paid order |
| 12-40 | Actual authorized negotiation excerpt + corresponding written terms | Recording labeled; disclose actual result/refusal |
| 40-60 | Exact item, costs, condition and original evidence | Missing fee/failed cap remains blocked; never stage a concession |
| 60-90 | Switch to compute; compare full commitment and technical assumptions | Persistent evaluation-only badge; provider/public/fixture origins visible |
| 90-110 | Live changed-term check in isolated fixture; human reviews findings | Stale review rejected; no acceptance, reservation or payment |
| 110-120 | Save quote/findings packet; show what remains unresolved | Quote-only outcome in both cases; no realized-savings claim |

If no table supplier responds, report that; the real-negotiation objective is unmet. If compute has no provider reply, public pricing and a separately labeled synthetic minimum-term test are valid evaluation demonstrations, not real negotiation. If a real call contains no fee mistake, show only the actual interaction and move the planted-error moment to the test workspace. Do not switch the primary story to a fictitious AI-company customer.

## Market context, differentiation and tracks

For context, NVIDIA reported Data Center revenue of $89.0 billion, up 117% year over year, for the quarter ended July 26, 2026, in its [August 26 results](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027). This is dated vendor-reported infrastructure-market growth, not a GPU-demand count, universal shortage, cloud-capacity guarantee, market-size estimate or evidence of demand for NaiNai. Keep the source/date in appendix/Q&A and verify again before submission. Public provider price/availability observations give more specific purchasing context, with their limits stated.

[Shadeform](https://shadeform.com/) already obtains provider quotations and its [MCP tools](https://shadeform.com/mcp) support agent compute discovery/provisioning. [ComputePrices](https://computeprices.com/sourcing) offers sourcing as well as data. Proposed differentiation is the buyer-controlled, cross-category conversation/evidence/decision workflow; two cases do not establish unique capabilities, superiority or a moat.

Five primary program evidence targets remain Visa, Cartesia, Microsoft, Apify and Figma, subject to actual [requirements](../../../CAL_HACKS_13_TRACKS.md). Quote-only is compatible with the recorded Visa focus; Cartesia must perform central actual voice work; Apify must materially support evidence. Microsoft usefulness evidence is personal-table evidence, not validated AI-company adoption. Figma needs actual workflow/prototype contribution and required artifacts; the inline concept alone earns nothing.

**Defer Hyphenate**: this MVP removes the company-finance world, purchase approval and budget reservations, so do not claim that quote review alone establishes finance autonomy. Anthropic remains conditional on a genuinely validated named community; evaluation assumptions are not user interviews. No extra integration or second submission precedes a reliable first flow.

## Delivery and acceptance

Lead owns shared contracts, authority/review transaction, integration and evidence consistency. UI worker owns one dual-case workspace and Figma artifacts; voice worker owns quote-only Claude/Cartesia negotiation and controls; evidence worker owns both typed category adapters, public-source/quote ingestion and evaluations. One lead plus three workers, exclusive file scopes. [Current implementation plan](../plans/2026-10-23-nainai-quote-only.md).

Acceptance requires both cases using the shared pipeline with durable intent/origin labels; real/indicative/fixture quotes not conflated; exact costs/constraints; truthful permitted contact only; refusal/no response/unknowns; version-bound human review; deduplicated contact/review; global pause/stop; and a capability boundary rejecting every commercial action. Verify missing tax, condition changes, GPU minimum terms/topology mismatch, unavailable sources, supplier injection, stale evidence, concurrent review, revoked permissions, interrupted call and attempted provisioning/payment.

No product tests have run. This update is planning only. Implementation starts during the official event period; proposed T-12h feature/T-6h integration freezes, saved submission, accessible evidence, backup recording and three timed rehearsals remain finish gates.
