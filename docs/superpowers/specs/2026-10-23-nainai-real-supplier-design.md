# NaiNai real supplier negotiation revision

> **Historical — superseded October 23:** The [current two-case quote-only MVP](2026-10-23-nainai-quote-only-mvp-design.md), [implementation plan](../plans/2026-10-23-nainai-quote-only.md) and [demo](../../NAINAI_DEMO.md) govern. The table remains a real need; compute is evaluation-only. This file's single-category purchase approval, draft request and budget reservation are not current MVP requirements. Preserve its research/negotiation history, not commercial actions.

October 23, 2026. The user explicitly changed the primary demo target to actual suppliers, real bargaining and documented savings. This revision supersedes the simulated-supplier-first decisions in the [earlier MVP draft](2026-10-23-nainai-mvp-design.md). Selected research target: Kenny's Wickman Falls T318-1. No supplier has been contacted, expenditure approved or product implemented. The [selected-pilot development plan](../plans/2026-10-23-nainai-wickman-falls.md) gives the negotiation playbook, task ownership, tests and judge-facing demo.

## Outcome and selected purchase target

Primary success: NaiNai negotiates with an actual seller about goods or services that seller genuinely offers, captures an authentic initial quote and a supplier-confirmed revised quote, and prepares a human-controlled purchase decision. A person role-playing a fictional supplier does not meet this success condition. Simulators remain for development/regression tests only.

The user selected the **Wickman Falls dark-brown coffee/cocktail table, SKU T318-1**, advertised **$177.14 by Kenny's Warehouse Steals in Mableton**, for delivery in **Decatur, GA 30033**. The user's mention of Furniture Way Less was a merchant mismatch: that business's researched table is the $179 Danville. Follow the explicitly selected Wickman Falls product at Kenny's, not an invented Furniture Way Less Wickman listing. The latest target is **strictly under $150 including tax, delivery and mandatory fees**: `totalCents < 15000`, maximum qualifying total **14999 cents**. Selection authorizes planning, not supplier contact, an offer or a purchase. Keep the private street/apartment address out of repository files, public searches and demos; ZIP-level research is sufficient. This remains a personal purchase; it does not independently validate small-business finance needs or Hyphenate eligibility.

New condition is the initial baseline. The user also accepts considering an **inspected floor model or open-box unit**. Exact unit, defects, inspection evidence/method, warranty and buyer acceptance must be recorded before such an alternative qualifies; photographs alone cannot certify structural condition. Delivery deadline, service level and willingness to self-assemble remain open. Do not assume flexible timing or assembly concessions merely because the buyer accepts open-box consideration. Compare original and negotiated terms for the same table and condition; a new-to-open-box switch is a changed-scope option, not entirely bargaining savings. Use different tables as market context, not an equivalent-item savings baseline.

The user widened the asking-price research range to **$60-$300**, specifically requiring delivery availability. This does not change the previously stated $150 total spending cap. Public shortlist checked October 23, 2026; these are listing observations, not supplier-confirmed quotes or stock guarantees:

| Candidate | Observed facts | Outstanding constraint |
|---|---|---|
| [Round wood-top/hairpin-leg table](https://www.craigslist.org/view/d/pine-lake-round-modern-coffee-table/wBzhgeaPrE7tnNPjXJ2JcG) | $85; Stone Mountain; condition listed good; 38-inch diameter x 18-inch height; updated October 18; delivery explicitly offered | Best budget-fit lead: $65 remains for every additional cost. Delivery fee, 30033 coverage, stock and condition need confirmation. Craigslist reply channel; phone not exposed. |
| [Danville chrome/glass table](https://www.craigslist.org/view/d/riverdale-danville-shaped-chrome-coffee/2rbrBmBr45Y9ovi8WFCShF) | $179; new; Furniture Way Less, Jonesboro; 48 x 24 x 18 inches; updated October 20 on lead's verification; listing advertises next-day delivery | Actual stock, 30033 service, delivery charge and schedule unconfirmed. Already above spending cap before fees. Public Jonesboro contact 678-819-8777. |
| [Wickman Falls table](https://kennyswarehousesteals.com/products/wickman-falls-cocktail-table) | $177.14; Kenny's Warehouse Steals, Mableton; 46.13 x 23.75 x 18.88 inches; laminate/metal, two drawers; live catalog marked available | Delivery quote and 30033 coverage needed; catalog availability is not local warehouse stock. Already above spending cap before fees. |
| [Korajane table](https://kennyswarehousesteals.com/products/korajane-coffee-table) | $186.49; Kenny's; 48 x 27.38 x 17.5 inches; faux-marble tempered glass, antiqued-gold steel; live catalog marked available | Same Kenny's delivery/stock constraints; meaningful concession needed for $150 total. |
| [Korestone rectangular table](https://kennyswarehousesteals.com/products/korestone-coffee-table) | $206.04 rectangular variant T438-1; Kenny's; 50 x 26 x 19 inches; hardwood/mango veneer/MDF; live catalog marked available | Same Kenny's delivery/stock constraints. Oval variant is $315.69 and excluded. A large discount must not be assumed. |
| [Kandinew cocktail table](https://ultimatebargainfurniture.com/products/kandinew-living-room-table?variant=50968659034427) | $292.98 cocktail variant; Ultimate Bargain Furniture, Decatur; 54.38 x 32 x 18 inches; oak veneer top; live catalog marked available | Store's Georgia-wide delivery includes the research area; fee/actual local stock/arrival unknown. Highly ambitious under $150; smaller end-table variant is not the same item. |

[Kenny's FAQ](https://kennyswarehousesteals.com/pages/faq) advertises its delivery team, placement/assembly, typically 1-2 weeks for in-stock goods and carrier arrangements outside its local zone. Decatur coverage and fee are unconfirmed. Public contact: 678-833-6027, kenny@kennyswarehousesteals.com. [Ultimate Bargain's delivery policy](https://ultimatebargainfurniture.com/policies/shipping-policy) covers Georgia with a separate delivery quote and extra charges for assembly; its published policy contact is 470-695-9222. No seller's willingness to negotiate is established. The $85 private-sale table remains a budget-fit alternative, but the user selected Kenny's Wickman Falls as the primary target; keep one active negotiation.

Verification: Craigslist direct pages inspected; exact retail variants/prices/available flags checked against public Shopify product data. Newly indexed store pages that the web reader could not fetch were independently fetched successfully over read-only HTTP. Do not equate an online available flag with immediate showroom stock. No seller contact, quote, offer or order occurred.

Earlier [Costway retail fallback](https://www.costway.com/oval-coffee-table-2-tier-wooden-accent-table-with-spacious-tabletop-and-open-storage-shelf.html): $62.99 black oval two-tier table with advertised free shipping, 39.5 x 19.5 x 18 inches, engineered board/metal, assembly required; ZIP-specific checkout total and arrival unconfirmed. Earlier West Elm listing is pickup-only and Finders Keepers delivery remains unverified, so neither belongs in the delivery-advertised shortlist.

Reject sold listings and snippets that price an end table rather than the coffee table. Existing markdowns are not NaiNai negotiation results. A less expensive different table is an alternative, not evidence of same-item savings.

The earlier 50-100 promotional-sticker suggestion remains an unused alternative, not a selected purchase. Its proposed $50-$100 envelope was not a merchant quote or spending authorization. Do not buy items solely to manufacture a discount result.

Do not retain the fictional three-monitor quantity/$650 cap for the real coffee-table purchase. Keep exactly one purchasing category in the first real deployment; prior monitor examples remain test/design history rather than required MVP functionality.

## Narrower live scope

- One actual buyer/project identity, one category, one selected consenting supplier and one active conversation. One or two other authentic public listings/quotes can inform comparison; three completed supplier negotiations are not required.
- Primary channel: a scheduled real supplier conversation using Cartesia voice/telephony after provider access is verified. A real supplier can instead join a browser voice session if they prefer; this remains a real commercial counterparty, not a simulation.
- Use a genuine negotiable request, including possible changes to freight, setup costs, unit price or payment terms. Do not promise future orders, invent competing quotations, misstate buyer/company identity or commit funds outside the user's authority.
- Human can monitor, pause/take over and terminate the conversation. Disclosure of AI participation and permissions for transcription, recording and demo sharing are captured separately. A supplier's willingness to give a quote is not automatically willingness to appear in a public recording.
- Obtain written confirmation through the supplier's legitimate channel or authenticated supplier participation. Extracted transcript text is a proposal until terms are confirmed. Record who confirmed, when, quote validity and any conditions.
- Minimum confirmation path: a supplier quote portal, or the original written quotation from a contact matched to the supplier's official published channel and checked by the human buyer. Bind its source artifact/hash, quote identifier and exact revision to the reviewed request. A model assertion that the supplier confirmed is insufficient. Incomplete fees or a missing confirmation remain pending.
- No purchase, payment, deposit, contract acceptance, credit application or shipping-address disclosure beyond approved scope occurs automatically. The product still ends at reviewed approval/request/reservation; completing an actual purchase requires the user's specific authority.

Permission-loss default: stop the session or recording immediately when the relevant permission is withdrawn. Remove recording/transcript assets from the app's demo and public-sharing surfaces; record a minimal permission-change event without copying the withdrawn content. Keep independently permitted written commercial quotations separate from audio permission. If a recommendation depends on evidence that is no longer usable, mark it stale and block a new approval until replacement evidence exists. Verify provider recording-retention/deletion controls before promising deletion from a provider; do not claim inaccessible remote copies were deleted.

Supplier recruitment and buyer details are the leading dependency. The assistant can research public candidates and prepare messages; selecting a candidate does not itself authorize sending a message or placing a call. No outreach or expenditure has been authorized in this planning exchange.

## Evidence and savings

Retain the initial and final supplier-issued quotation, exact configuration, quantity, condition, warranty, delivery, tax/freight/setup charges, validity and source. Store the actual call/transcript only where permission permits, with source links or event IDs. Link quotations to the underlying evidence rather than treating a scraped retail price as the supplier's offer.

Report three separate outcomes:

1. **Negotiated quote reduction:** initial supplier-confirmed all-in total minus final confirmed all-in total for the same quantity, specifications, condition, warranty and delivery terms. Percentage uses the initial total as denominator. It may be zero or negative.
2. **Changed-scope option:** show a different quantity, material, deadline or warranty as a separate option. Do not attribute that difference entirely to bargaining. A quantity break or existing coupon is identified as such, not a new concession won by NaiNai.
3. **Realized purchase saving:** only after an actual paid/fulfilled order is evidenced, report the actual final amount against the documented equivalent initial quote, adjusted for subsequent fees/refunds. Until then use “confirmed negotiated quote reduction” or “potential saving,” not “money saved.”

If tax/freight/setup fees or required terms remain unknown, display an estimate and prevent the offer from being labeled confirmed all-in or approval-ready. A gift, sponsorship or demo participation discount is identified separately and is not evidence of ordinary negotiation performance.

No discount is guaranteed. A refusal, unchanged quote, unavailable stock, expired offer or supplier withdrawal must remain a valid recorded outcome. Do not reset or prearrange a winning result while presenting it as unscripted negotiation.

## Demo plan

The primary evidence must come from a genuine interaction conducted by the working system during the event. Do not rely on a supplier being available during the Sunday judging window.

1. Open authentic before/after supplier quotes, with equal-scope terms and their actual reduction, if any.
2. Play a short permitted excerpt of the actual negotiation, explicitly labeled as a recording, and open the corresponding transcript/quote event. If recording permission is unavailable, use allowed written quotations and a properly permissioned transcript or summary instead.
3. In the live app, inspect original evidence, recompute the actual total, question the recommendation and show human approval controls. A changed request invalidates the recommendation.
4. Conduct a live follow-up with the actual supplier only if specifically arranged; otherwise do not label replay or simulated responses as a fresh live negotiation.
5. Show a paid receipt or delivered goods only if a real purchase is separately authorized and completed. Delivery after the hackathon is acceptable for a genuine quotation demo; never promise production timing from a website alone.

Success is a real, well-evidenced negotiation. The presentation may include a zero saving honestly. Physical stickers, a higher price baseline, a staged concession or an actor pretending to be a merchant cannot substitute for the required real counterparty.

## Architecture and worker changes

Retain the original request, quote, recommendation, approval and reservation contracts, with category-specific required fields. Add SupplierContact/Authorization (approved endpoint, channel, buyer identity/scope, AI/recording/sharing permissions), CallSession (provider/call IDs, actual participants, status and takeover), QuoteConfirmation (who/where/when/validity/conditions), and SavingsComparison (equal-scope checks, baseline/final quote revisions and quote-versus-realized status).

| Owner | Revised scope |
|---|---|
| Lead | Real-purchase configuration, authority boundaries, approval/reservation, integration and evidence consistency |
| Worker 1 | Real call/session status, original/final quote comparison, human takeover controls and honest reduction labels |
| Worker 2 | Verified Cartesia real-supplier channel, Claude negotiation, stop/takeover, call failure/reconnect, event capture and no duplicate outbound attempts |
| Worker 3 | Public supplier/spec research, authentic quote ingestion/confirmation, equal-scope comparison and failure/evaluation cases |
| Human | Choose an actual desired purchase and cap; authorize contact scope; arrange an actual willing supplier; decide whether to purchase and whether permitted evidence can be published |

Tests retain simulator fixtures, explicitly segregated from the real negotiation dashboard and submission evidence. Add refusal/zero reduction, conditional/verbal offer, missing confirmation, changed scope, changed fees, duplicate call attempts, revoked permissions and interrupted call cases. A disconnected session cannot silently redial or accept terms.

## Track and schedule tradeoffs

Prioritize Visa, Cartesia, Microsoft, Apify and Figma as five primary program evidence targets, with Hyphenate as a conditional sixth. Real supplier contact strengthens the credibility of commerce, voice and measured usefulness; it does not automatically establish superiority, track eligibility or a win. Hyphenate still needs a meaningful company finance world, roles, policy/budget history, approval and traceable financial state; a separately labeled synthetic finance test workspace can demonstrate controls without pretending this personal purchase is a company expense. Anthropic still needs a named validated community and substantial Claude use.

Prioritize real supplier access, audio, quote confirmation and evidence before CREAO/Factory, Nessie or other stretch tools. Preserve a permitted recorded real negotiation so Sunday supplier availability does not determine the whole presentation. No new track is added simply because telephony is used.

## Researched candidate channels, not endorsements or booked suppliers

- [The Sticker Smith](https://tssprint.com/) advertises custom stickers, quotes, Bay Area pickup and a starting $47.50 for 50 matte 2-by-2-inch stickers in its displayed configuration. Actual price/configuration and taxes need confirmation. It states 24-hour proof and 3-5 business days production; do not promise Sunday physical delivery.
- [Urban Sticker](https://www.urbansticker.co/) in South San Francisco offers a quote channel. Its posted hours are weekdays 9-5, weekends closed. Any weekend conversation would need a specific arrangement; testimonials about fast turnaround do not establish this order's deadline.
- [StickerGiant quote FAQ](https://support.stickergiant.com/hc/en-us/articles/40697344061844-Frequently-Asked-Questions) says tailored email quotes typically take 2-3 business days, making passive email a weak event-time dependency.
- [Central Computers corporate sales](https://www.centralcomputer.com/business) offers quotes and says same-day quotes are possible. Its special manufacturer pricing language concerns larger deals; do not assume a discount on one monitor.
- [Cartesia phone-agent capabilities](https://www.cartesia.ai/product/ai-phone-agent) describes inbound/outbound calling and Twilio/SIP options. Actual account access and the end-to-end provider path remain unverified.

Next work follows the selected-pilot development plan; the user asked to shift emphasis from shopping research to building and judge evidence. Supplier outreach and actual buying still require specific contact/purchasing authority; delivery and inspection details remain open. Product implementation still follows the official event period.
