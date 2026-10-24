# NaiNai small-business purchasing MVP design

> **Historical — superseded October 23:** Use the [current two-case quote-only MVP](2026-10-23-nainai-quote-only-mvp-design.md) and [implementation plan](../plans/2026-10-23-nainai-quote-only.md). This file's simulated-first scenario and purchase-approval/draft-request/budget-reservation contracts are historical, not current acceptance criteria. Both current cases end with nonbinding review and saved findings; no purchase or reservation.

**Primary demo scope revised:** the user requested genuine supplier bargaining and actual savings evidence. The [real supplier revision](2026-10-23-nainai-real-supplier-design.md) supersedes this file's simulated-supplier-first approach, fixed purchase choice and timed demo. Retain the contracts and synthetic scenario as design history and test references, not proof of a real negotiation.

October 23, 2026. Draft for review. The user selected NaiNai for small businesses. The implementation choices below are proposed defaults; no product code, provider calls, interviews or measured results have been completed. Product implementation starts during the official hacking period.

## Product and customer

NaiNai is a small-business buying team: describe what the business needs, inspect sourced offers, negotiate terms, and approve a defensible purchase request. Tagline: **Grandma means business.**

Initial persona: the person handling occasional equipment purchases at a small company without a dedicated procurement team. Proposed validation audience: office or operations managers at independently operated coworking spaces. This is an outreach/validation hypothesis, not a claim of existing demand or a secured participant. The human chooses reachable actual participants; agents do not contact anyone without authorization.

First purchasing category: desktop monitors. One company, one USD budget, one purchase request, three supplier scenarios and one active negotiation. First delivery deadline: October 30, 2026, in the demo company's America/Los_Angeles timezone. Dates are editable.

Success means a user can go from request to a source-backed recommendation, question it, negotiate one offer, approve the reviewed version, and see exactly one persisted budget reservation and approved draft purchase request. This is an internal sandbox outcome, not a placed merchant order, guaranteed delivery, realized savings or money transfer.

## Approaches and decisions

The conversation considered browser voice negotiation, telephone supplier calls and a wider autonomous procurement service. The user selected NaiNai and the small-business audience. The detailed approach here is the lead's proposed default:

1. **Browser voice plus bounded supplier sandbox — recommended first.** Real Claude interpretation and Cartesia audio; three clearly fictional supplier profiles; repeatable commercial rules. The human business buyer speaks with NaiNai using one microphone/audio session. NaiNai's offers to the sandbox supplier can also be spoken aloud and are labeled by recipient; supplier responses are authoritative structured text, not a second voiced agent. The buyer can interrupt or revise instructions. Fast to reset and test, but does not validate real merchant negotiation. A consenting human supplier interaction is a later test mode, not a second required live audio stream.
2. **Telephone negotiation — stretch after the core journey.** Adds convincing phone interaction and deployment/account dependencies. No calls to businesses are authorized. Use an explicitly consenting test participant if implemented.
3. **Multi-category procurement or multi-buyer buying club — later.** Broader opportunity, substantially more integrations, specifications, authority and state. Excluded from the weekend MVP.

A conventional TypeScript web app with a server and SQLite is the proposed technical default, not a user-mandated stack. Use a suitable established UI kit. Persist requests, quote revisions, decisions, reservations and audit events in one database. Use real service adapters with explicit fixture counterparts; do not install or scaffold anything before the implementation period and design agreement.

## Two capabilities and three characters

Two product capabilities: **find and negotiate a suitable offer**; **approve a controlled purchasing decision**.

| Character | Actual responsibility | Visible evidence |
|---|---|---|
| Bargainer | Clarify needs, request bounded concessions and interpret counteroffers | Actual voice transcript, negotiation events and structured quote revisions |
| Skeptic | Check product identity, source support, specifications, fees and conflicting terms | Specific objection, cited evidence and an explicit unknown when facts are missing |
| Bookkeeper | Explain budget position and prepare the reviewed decision | Exact line totals, budget impact, approval status and reservation history |

Characters are logical roles in one orchestrated workflow, not three mandatory frameworks or three chatbots talking endlessly. Claude performs substantive negotiation/evidence interpretation. Application logic performs arithmetic, hard constraint checks, permissions and approval enforcement. Agents cannot approve their own recommendation.

Brand direction: illustrated older Chinese women with distinct expertise and natural voices. Humor comes from specific good judgment, such as “A discount on the wrong thing is still wasting money.” English first; Mandarin is an optional later enhancement, not required coverage. Do not imitate a real person's voice without permission.

## User journey and minimum surfaces

1. Enter quantity, maximum total, deadline and required specifications; optional voice input uses the same validated request schema. Confirm extracted constraints before sourcing.
2. Inspect three offer cards and their evidence. Public listing observations and fictional supplier quotations are separate record types and visibly labeled.
3. Open one live browser negotiation, at most three counteroffer rounds. The business buyer talks to NaiNai; NaiNai submits structured counteroffers to a deterministic supplier tool. The supplier can trade price or freight within its private sandbox rules; buyer agents cannot see its hidden floor. That tool issues structured quote revisions and textual responses; conversational promises alone do not become authoritative quotes. Only NaiNai's voice is required; the supplier's reply appears in the transcript/quote card. The buyer's interruption pauses further offers until updated constraints are confirmed.
4. Inspect the Skeptic's objections and the deterministic checks. Unknown tax, shipping, stock or required specification prevents an approval-ready status. Ask for clarification rather than silently substitute zero or assume compatibility.
5. Choose a recommendation or reject/escalate. Show total cost, delivery/specification checks, supporting sources and the rejected alternatives.
6. The human approves one precise request/quote/evidence revision. In one server transaction, validate that revision, permissions, expiry and remaining budget; create one reservation, approved draft purchase request and audit event.
7. Download a JSON or printable HTML decision packet. No PDF-generation subsystem is required. Editing a quote makes the earlier recommendation stale; approved reservations require explicit cancellation before a replacement approval. Released reservations are recorded once.

Use one purchasing workspace with a request summary, offer comparison, active conversation/evidence area and decision/history view. A separate supplier-debug panel belongs only to the labeled demo workspace and must not expose private supplier limits to the buyer's model context. The normal product flow contains no developer-only track details.

## Honest live and simulated boundaries

| Component | Planned boundary |
|---|---|
| Product evidence | Real Apify Actor/API run for a supported public catalog or manufacturer source; URL, retrieval time, raw snapshot/excerpt and normalized fields |
| Product price or stock | A public asking price/observation, not a binding supplier quote or verified fulfillment promise |
| Supplier profiles | Three fictional businesses with seeded commercial terms; labels persist in quote, transcript, packet and audit history |
| Negotiation | Actual Claude decisions and Cartesia buyer/NaiNai audio, with structured text counteroffers issued by a deterministic supplier sandbox. No claim of an actual supplier telephone call. A consenting human supplier is an optional later test mode |
| Tax | Explicit 8% sandbox fixture rule in the answer-key scenario; never represented as an actual jurisdiction's tax determination |
| Finance | Real application state/calculations on a seeded company budget; reservation is simulated business finance, not a bank hold |
| Savings | Difference between two identified simulated quote revisions; never claimed as realized customer savings or a market-wide best price |
| Providers | Record actual provider/run IDs and results; a fixture path cannot support a live-integration claim |

If sourcing fails, show a provider failure and offer an explicitly marked saved snapshot for rehearsal. A snapshot supports reproducibility, not a live Apify run claim. Keep changing public observations separate from the fixed answer-key dataset. No retailer identities are attached to invented negotiation terms.

### Product identity and live evidence linkage

During the first source-feasibility check, select two actual monitor models with authoritative model/part identifiers: P1 satisfies the required display input; P2 has a source-supported incompatible input specification. Supplier A and B offer P1; Supplier C offers P2 while making a misleading USB-C claim. SupplierQuote.productId references the same canonical model/part identity as ProductObservation.productId. Matching by a vague model-name substring is insufficient.

Apify captures public source observations for those models; the Skeptic uses those observations to substantiate or reject the supplier's product claims. Only prices, freight, sandbox tax, concession limits and delivery promises in supplier quotes are fictional. Public asking prices are displayed separately and do not substantiate the fictional negotiated terms.

The fixed evaluation uses versioned saved observations of these real models. A live-source demonstration replaces that observation with a newly retrieved snapshot, keeps both versions and recalculates checks. It cannot claim fixture data was fetched live. If no accessible source explicitly establishes the needed input distinction, choose another supported model pair before freezing the answer key; do not invent port specifications. Generic omission of a field is unknown, not proof the port is absent.

## Resettable core scenario and answer key

Synthetic request: **three 24-inch-class-or-larger, 1080p monitors with USB-C display input; all-in maximum $650; delivery by October 30, 2026.** For this scenario, 24-inch class means a documented diagonal of at least 23.5 inches; unknown dimensions do not pass. Company budget starts at $1,000, with a prior unrelated $200 commitment, leaving $800 unreserved. The request cap remains $650 even if company cash is higher.

All figures below are sandbox fixtures. Tax is 8% of item subtotal plus freight, rounded once to cents. Money calculations use integer cents or decimal-safe arithmetic, not binary floating-point accumulation.

| Quote | Subtotal | Freight | Fixture tax | Total | Outcome |
|---|---:|---:|---:|---:|---|
| Supplier A, three at $149 | $447.00 | $135.00 | $46.56 | $628.56 | Required spec, but delivery November 2: reject deadline |
| Supplier B initial, three at $195 | $585.00 | $25.00 | $48.80 | $658.80 | Required spec and deadline, but over request cap |
| Supplier B negotiated, three at $185 | $555.00 | $0.00 | $44.40 | $599.40 | Eligible if this structured counteroffer is actually obtained |
| Supplier C, three at $175 | $525.00 | $0.00 | $42.00 | $567.00 | Misleading USB-C claim contradicted by P2's documented input specification: reject spec |

Expected answer when the negotiated B revision exists: B is the only qualifying quote, with a $59.40 improvement over its own prior quote. Approval leaves $200.60 unreserved company budget. Do not force an agent to reach the desired deal; if a counterpart refuses, show no qualifying quote and escalate. Other prices, sources and deadlines can be changed by the judge.

The sandbox supplier's private floor and concession rules are owned by its tool implementation; the buyer sees only issued offers. Mark the negotiated row as a reachable test outcome, not a guaranteed live result. Each distinct supplier offer, including expiration and delivery changes, receives a new revision.

## Draft two-minute demo

| Time | What is shown | Point established |
|---|---|---|
| 0–12 seconds | Open the cheapest offer's USB-C claim, contradictory product evidence and rejection | “NaiNai caught the wrong purchase before it became an order.” State this is a synthetic supplier case |
| 12–25 | Three-monitor request, $650 cap and existing company commitment | Specific small-business job and budget context |
| 25–65 | Buyer instructs NaiNai by voice; NaiNai submits a counteroffer to Supplier B's sandbox and the structured reply updates the quote | Actual Claude/Cartesia interaction and inspectable terms; supplier is a labeled text simulator, not a live merchant |
| 65–85 | Compare totals, arrival and specifications; open source support | A defensible selection rather than a low-price ranking |
| 85–105 | Human approves the reviewed revision; one reservation and draft request appear | Buyer/controller separation and a complete persisted business outcome |
| 105–120 | Show packet and observed evaluation results; offer a changed-constraint scenario | Correctness evidence and an interactive next step |

Start with a preloaded request and offers; do not spend the pitch typing a long form or waiting on three sequential web searches. Live sourcing is available for Q&A and recorded sponsor evidence. Use a real prerecorded backup only when identified as a recording. Do not use fake delays, invented thinking or fabricated metrics.

For Q&A, change the deadline to October 29 or add freight to the recommended quote: the system must re-evaluate and reject a stale approval. Keep this separate from the timed two-minute path if latency would obscure the core result.

## Shared contracts and state boundaries

The lead owns shared contracts and freezes an initial version before workers implement against them. Proposed records:

- PurchaseRequest: organization/user IDs, revision, item/category, quantity, hard specifications, request cap in cents, currency, deadline/timezone and status.
- ProductObservation: source/provider/run IDs, URL, retrieval time, content hash/excerpt, product identity and observed fields with per-field support/unknowns.
- SupplierQuote: fictional/real provenance label, supplier/product IDs, revision, quantity, subtotal/freight/tax/total, promised arrival, validity time, specification evidence and commercial terms.
- NegotiationEvent: session/role, actual turn/tool result, quote revision produced, provider IDs, latency and source links. Public observations and private simulator limits are never conflated.
- Recommendation: exact request/quote/evidence revisions, deterministic pass/fail/unknown checks, explanation, rejected alternatives and status.
- Approval and Reservation: authenticated approver, reviewed revisions, idempotency key, amount, state and audit linkage; a unique constraint prevents duplicate commitment.
- PurchasePacket: approved draft request, selected quote, evidence manifest, finance effect, provenance labels and limitations.

Read flow: request -> source observations -> quote/revisions -> checks/recommendation -> human decision. Mutation flow: server-side approval -> atomic budget reservation/request/audit. Model text cannot bypass the mutation API. Evidence/quote changes stale the recommendation. Supplier terms are untrusted input; embedded instructions cannot change buyer policy or tool permissions.

## Development work across subagents

At most the lead and three workers run concurrently. This is a design allocation, not an instruction to begin product implementation before the official period.

| Owner | Exclusive scope when implementation begins | Required handoff |
|---|---|---|
| Lead | Shared contracts, database/state machine, approval transaction, HACK.md, root app wiring, configuration and integration | One source of truth for schemas; coherent end-to-end scenario; verified budget/approval behavior |
| Worker 1: product experience | Purchasing UI components, interaction states, branded character presentation and printable packet layout | Request -> comparison -> conversation -> review -> result usable with fixtures; sources and simulation labels visible |
| Worker 2: negotiation and voice | Claude negotiation adapter, Cartesia browser audio, bounded supplier adapter and session events | Actual interruptible conversation, structured offers, turn limit, timeout/reconnect behavior; no authority to approve |
| Worker 3: evidence and evaluation | Apify extraction/normalization, public-source manifest, answer-key fixtures and domain evaluation harness | One reliable real source run; provenance boundaries; supported/unsupported USB-C example; expected-result cases |

Workers do not edit each other's scopes or shared contracts. Each receives file ownership, typed fixtures, acceptance conditions and forbidden mutations. Proposed directory boundaries are ui/, services/negotiation/, services/evidence/, domain/fixtures/ and evals/; the exact repository layout is the lead's implementation choice after scaffold selection.

Sequence:
1. During planning: settle request/quote semantics, demo story, counterparty mode and target community; prepare validation questions. No product scaffold.
2. At official start: lead defines contracts; workers check provider feasibility and build against labeled fixtures. Human handles account access and real-user validation in parallel.
3. Integrate the first complete persisted journey before technical stretch. Live voice and sourcing replace fixture adapters without changing the contracts.
4. Rotate Worker 3 to adversarial/domain evaluation; Worker 1 to Figma/submission assets; Worker 2 to voice recovery and recording. Lead repairs integration and verifies claims.
5. Freeze optional features at T-12h and optional integrations at T-6h, tightening if the actual clock requires. Reserve time for three timed rehearsals and the required evidence artifacts. Revisit a second submission only after the first meets its completion gate and organizer reuse/multiple-entry rules are confirmed.

## Acceptance checks and evaluation

Run meaningful domain/integration checks, not tests that merely mirror UI implementation. Report exact case counts, failures and observed latency only after running them.

| Case | Required result |
|---|---|
| Ordinary qualifying offer | Valid recommendation and one approved draft request/reservation |
| Core planted errors | Deadline failure A, initial budget failure B, source-supported specification conflict C |
| Counterparty refuses concession | No invented agreement; escalate or report no qualifying offer |
| Changed constraint or quote | Re-evaluate; prior recommendation/approval attempt rejected as stale |
| Missing tax, freight or specification | Unknown and not approval-ready, with a targeted clarification |
| Prior commitments exhaust budget | Reject even if the request cap alone would allow the purchase |
| Duplicate approval, retry or restart | Exactly one reservation/request; persisted history remains readable |
| Competing approvals | Atomic budget check prevents overspending across requests |
| Reservation cancellation | One release; retry cannot release funds twice |
| Source unavailable or inconsistent | Visible error/conflict; snapshots clearly labeled and not claimed live |
| Malicious supplier content | Cannot alter policies, reveal private counterparty floors or invoke unauthorized tools |
| Voice interruption/provider failure | Recover or switch to clearly identified text input without losing confirmed quote state |

Evaluate negotiation quality by constraints met, unsupported claims, valid concessions and total cost versus the same supplier's prior quote. Do not reward lowest price when a required specification or deadline fails. Compare one actual user's task completion/corrections against their current process if possible; no interview or time-saving result is currently claimed.

## Track coverage and evidence gates

Count sponsor programs, not categories or placements. Six is the initial planned evidence target, not six earned entries. Seven/eight are conditional; no extra runtime framework should weaken the main journey.

| Program | Meaningful role and evidence |
|---|---|
| Visa | Discovery/comparison/negotiation/approval journey. Recorded requirements do not mandate a Visa API or live payment. Show commerce value without invented savings |
| Cartesia | Actual live audio on the core negotiation, interruptions and failure handling; working demo, required README and two-minute presentation |
| Microsoft | Specific customer, complete result, observed usefulness and credible controls. Recorded requirements do not mandate Microsoft infrastructure |
| Hyphenate | Buyer plus budget-controller roles; prior commitments, conflicting records, constrained permissions, human approval, audit and persisted financial effect. Mere haggling is insufficient |
| Apify | Actual meaningful Actor/API run and evidence used in selection. Source timestamps/raw fields/run IDs retained. Main track does not require building a new Actor |
| Figma | Genuine prototype/design contribution, accessible files, required Figma Slides, stage log and <=3-minute video. Start contemporaneously; do not reconstruct a false design process |
| Anthropic: conditional seventh | Reach a narrow actual small-business community, document lived/interviewed problem evidence and use Claude substantially at runtime. “Small businesses” alone is too broad |
| CREAO or Factory: conditional eighth | Replace a central adapter responsibility with a verified provider operation; do not add duplicate orchestration. CREAO needs built agent ID/run share link; Factory needs real bounded Droid SDK runtime work and README evidence |

Possible central stretch responsibility: normalize supplier documents into cited structured terms used by every offer comparison. If no reliable provider call can perform that core work, omit the track rather than route a trivial prompt through it.

Nessie is lower priority: meaningful sandbox banking can corroborate finance context, but a bank balance is not an available procurement budget. Add only after core stability and keep existing commitments/request caps authoritative. Mana or Notability can add genuine process evidence; choose at most one additional process tool in the initial stretch. Bright Data requires public web data indispensable to the product, not merely a decorative panel. CRS and other integrations are not planned.

Target six well-supported programs; seek eight when validation/provider gates pass. Nine or ten remain stretch, not the promised solo scope. Sponsor selection never guarantees eligibility or a prize.

## Provisional scores

| Dimension | Score | Basis |
|---|---:|---|
| Creativity | 8/10 | Distinctive buying-team characters make tradeoffs and judgment visible; they must correspond to actual work |
| Novelty versus current products | 4/10 | DIAL and commercial procurement agents already negotiate. Small-business fit and transparent interaction are hypotheses, not proof of invention |
| Importance of problem | 8/10 | Price, compatibility, delivery and purchasing effort matter; this exact customer's unmet need remains unvalidated |
| Potential advantage over traditional tools | 7/10 | Interpreting terms and revising negotiations can exceed a static comparison sheet; arithmetic remains deterministic |
| Demonstrated advantage over current competitors | 2/10 | No prototype, customer observation or comparative results yet |
| Demo potential, additional measure | 9/10 | Live negotiation, visible objections, human interruption and a concrete persisted result |
| Solo feasibility, additional measure | 7/10 | Plausible with one category and three workers; voice, sourcing and integration failures are material dependencies |

No aggregate win score is calculated. Improve the low-evidence dimensions with actual customer feedback, a tested complete flow and a fair baseline comparison rather than raising scores for branding or track count.

## Remaining gates and source references

Before implementation: confirm this draft's counterparty/category defaults and the design; official hacking must have started. Before runtime claims: verify Cartesia browser/Claude path, Apify accessible source and required account access. Before Anthropic claims: real narrow-community evidence. Before eight-program scope: provider feasibility and baseline stability.

Current recorded deadline: October 25 at 9 AM San Francisco venue-local time, interpreted as noon Eastern on that date; confirm the event clock because source timezone wording differs.

- [Track record and official source links](../../../CAL_HACKS_13_TRACKS.md)
- [Prior judge research: professional backgrounds, not table assignments](../../../OPENBOOKS_JUDGES.md)
- [Prior article workflow and kit review](../../../OPENBOOKS_WORKFLOW.md)
- [DIAL prior winning negotiation project](https://devpost.com/software/dial-4rqzc3)
- [Pactum current autonomous procurement](https://pactum.com/)
- [Cartesia voice/phone capabilities](https://www.cartesia.ai/product/ai-phone-agent)

No project code from these sources has been copied or installed. Prior OpenBooks documents remain historical references; HACK.md and this draft govern the selected NaiNai direction.
