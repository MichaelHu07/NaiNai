# OpenBooks — coverage strategy and proposed subagent split

Historical proposal. The user selected NaiNai for small businesses on October 23, 2026. [HACK.md](HACK.md) and the [NaiNai draft design](docs/superpowers/specs/2026-10-23-nainai-mvp-design.md) now govern scope, coverage and worker ownership. Keep this file for prior research and the calhacks-kit review.

Status: exploration proposal, October 23, 2026. No product implementation or kit installation has been performed. The second submission stays deferred.

Workflow update: [HACK.md](HACK.md) is the current working brief, [AGENTS.md](AGENTS.md) gives persistent workspace instructions, and [OPENBOOKS_WORKFLOW.md](OPENBOOKS_WORKFLOW.md) contains validation materials, evidence gates, a draft timed demonstration and submission checks. These operationalize the useful hackathon advice for OpenBooks; product scope and provider capabilities remain proposals until validated.

## Recommendation

Commit to **six sponsor programs with convincing evidence**, leave room for **eight** by doing genuine workflow-tool work, and treat **ten as a conditional stretch ceiling** for one solo build. These are planning estimates, not confirmed eligibility or predicted wins.

The six-program baseline is Hyphenate, Microsoft, Anthropic, Capital One/Nessie, one meaningful runtime integration (CREAO preferred, Factory alternative), and Figma. Mana and Notability can bring the portfolio to eight if they actually contribute from the start. Relevant live CRS and Apify integrations can bring it to ten.

Execution priority: keep broad credible coverage as the objective, and sequence it around the same working user journey. Every added integration needs an explicit user outcome or required evidence, an acceptance check, and a time budget. Begin the queue/evidence/approval experience early with labeled fixtures, integrate real services promptly, and reserve time for actual user feedback, reliability and rehearsal. A higher track count alone does not justify breaking the demo.

Count sponsor programs separately from award categories. Microsoft's two awards, CREAO's three categories, CRS's four categories, Figma's four awards and Apify's Best Actor do not increase the number of sponsor integrations. Finishing one application does not guarantee selection or eligibility for every category.

## Product proposal

**OpenBooks helps company finance teams investigate discrepancies across invoices, payments and ledger records, and approve evidence-backed resolutions.**

The proposed initial users are controllers, accountants and bookkeepers at small and midsize companies. The broader vision is company financial review and month-end reconciliation. A narrow accounts-payable workflow bounds the hackathon implementation; student organizations do not bound the market. This positioning is a hypothesis, not established user research. Validate it with a reachable finance professional. For Anthropic, a specific professional community can supply the audience; substantiate its problem through lived experience or a real conversation.

The demo should make the accounting work visible: compare the source invoice, payment and ledger entry; show the discrepancy and supporting evidence; distinguish a suspicious duplicate from two legitimate equal-amount invoices; and let a controller approve an explicit proposed resolution. Agents investigate messy records and explain uncertainty; application logic enforces arithmetic, permissions, approval versions and duplicate-action protection. No claim of comprehensive audit assurance is supported by this prototype.

One complete journey:

1. A vendor invoice enters the queue with supporting documents and prior records.
2. The system compares it with ledger entries and sandbox bank transactions.
3. It catches a duplicate, changed payment details, or inconsistent amount and gathers supporting evidence.
4. An investigation agent explains the discrepancy, cites the underlying records, and requests a specific approval.
5. A controller approves a proposed correction or rejects/escalates the item.
6. The application records the authorized result and a chronological audit trail; rerunning cannot create a second payment or entry.

Show one ordinary successful case, one duplicate, and one changed-payment-detail case. Include an uncertainty/error case. Prepare a resettable dataset and an answer key so judges can change an input and inspect the result.

Bank-detail changes can be detected against historical company records. **Do not claim CRS verifies bank ownership, vendors, or business identity unless its actual sandbox endpoints prove that capability.**

Limit the MVP to one organization, one currency, an invoice/payment queue, one approval surface, an evidence view, and an audit history. Use synthetic company documents and the providers' specified test identities. Live payment execution, payroll, tax compliance, lending decisions and a full accounting suite are outside the proposed first demo.

## Coverage matrix

Source baseline: [current track record](CAL_HACKS_13_TRACKS.md) and its linked official sources. All matches below are proposed and must be demonstrated.

| # | Sponsor program | Priority and actual role | Evidence required / gate |
|---|---|---|---|
| 1 | Hyphenate | Anchor: autonomous reconciliation, investigation and controller approval | Conflicting records, role boundaries, history, approvals, audit trail, live demo, video opening with the strongest moment, seats filled, correctness evidence |
| 2 | Microsoft | Anchor: a useful finance agent with responsible design | Working full journey, specific customer, measured usefulness, limitations and credible production path; no Microsoft technology requirement was stated |
| 3 | Anthropic | Baseline after community validation: Claude reasons about evidence and uncertainty | Real problem evidence from a narrow community; Claude does substantive runtime work; using Claude only to write code does not establish this fit |
| 4 | CREAO | Preferred runtime: own central reconciliation/investigation work | Call a real CREAO agent for core work, capture agent ID and a run share link, include both in Devpost README and select track |
| 5 | Capital One / Nessie | Baseline: source of sandbox banking transactions | Real sandbox call and meaningful matching against invoice/ledger records; distinguish fixtures from API responses |
| 6 | Figma | Deliberate build workflow: prototype approval/evidence flow, then build it | Public files, required Figma Slides, demo video ≤3 min, embedded Make/prototype evidence, stage log ≤200 words per stage with tools, reasons, minutes, ratings and outcomes |
| 7 | Mana | Optional workflow expansion | A meaningful prototype/planning/debugging contribution, 1–2 public pages/chats, and one demonstrated moment it improved the result; do not manufacture a token use |
| 8 | Notability | Optional workflow expansion | Actual research/notes/diagrams and idea evolution captured during the work; useful feature usage; do not reconstruct a pretend process at the end |
| 9 | CRS | Technical stretch only after capability check | Relevant live sandbox decision using only supplied test identities; correct account/endpoint access and meaningful product use are unverified |
| 10 | Apify | Technical stretch: collect public evidence useful to a specific investigation | A real Actor/API/MCP call influencing a result; event-built Actor can support Best Actor consideration; a decorative web panel is insufficient |

**CREAO / Claude division:** CREAO must own a central operation with a traceable outcome; Claude can do evidence reasoning and user-facing investigation as a separate substantial role. Do not route the same trivial prompt through multiple providers just to name them. First verify the available CREAO API/tool capabilities. If this split does not work, simplify and drop a track rather than imply a mock call qualifies.

**Factory alternative:** substitute Factory for CREAO if its SDK is a better fit for a triggered, bounded investigation. It must run inside OpenBooks, do real work, and expose steps/results with restricted access. Using Factory merely for development does not qualify. Adding both is possible, but would consume the budget for another stretch integration.

**Where the sponsor awards fit:**

- Hyphenate: one challenge with three placement prizes.
- Microsoft: Built for the Real World and Customer Impact consideration from the same project.
- CREAO: One-Person Company is a natural positioning; AI-First Disruptor and Team Empowerment may also fit the actual product. Do not assume three wins or that a category's team-size rules are settled.
- CRS: Overall, Financial AI Agent, Identity/Fraud Innovation and Unexpected Use are possible categories only where the implemented work supports them.
- Figma: the linked brief's Design, Creative, Workflow and Stage Log awards; Devpost currently differs.
- Apify: main challenge plus Best Actor if the event-built Actor meets that requirement. The combined sponsor pool is $5,000.

### Alternatives that should replace scope, rather than accumulate

| Program | Possible fit | Why it is not in the committed portfolio |
|---|---|---|
| Bright Data | A public-web-data investigation product | Public data must be indispensable. OpenBooks cannot honestly satisfy that with optional supplier enrichment. Pursue only if counterparty investigation becomes the core product; could replace Apify/another stretch |
| Spacetime | Persistent shared investigation/approval state | Could be chosen as the core backend from the beginning, but adds architectural risk. It must own meaningful state, not duplicate a second database just for eligibility |
| Atlassian | Forge-based approvals/governance | A deployed Forge app is a second product surface. A ticket webhook alone is weak evidence. Better deferred or substituted for a stretch |
| Factory alongside CREAO | Distinct triggered investigation role | More runtime and failure boundaries; not a free consequence of using coding agents |
| Visa | Vendor purchasing and comparison | Reimbursements/reconciliation are not inherently a reimagined shopping experience; would require a procurement-first scope |
| Meta | Collaboration and trust among club members | Shared dashboards alone do not establish meaningful human connection; not a strong initial pitch |
| Cartesia / Moss | Voice-first treasury assistant or agent memory | Voice/memory must contribute to the core experience; another interface is outside the first journey |
| Fetch.ai | ASI:One interface to the complete workflow | Requires ACP, Agentverse discoverability, the entire main workflow inside ASI:One, public code and separate submission artifacts |
| Coinbase | x402 payment/earning agent | Requires real product relevance and separate account/participation conditions; ordinary invoice accounting does not satisfy it |
| Elastic / Bitdeer | Alternate agent/search/model infrastructure | Add only when product needs justify them, replacing overlapping components |
| Convex / Tiger Data / Snowflake | Alternative storage/data/AI choice | Avoid multiple competing databases or interchangeable models used only for tags |
| SpaceXAI | Space-specific project with Cursor and Grok APIs | Changes the product theme |
| Armadin / AfterQuery / Annapurna | Rules pending in the researched snapshot | Cannot responsibly count eligibility on unpublished criteria |

Additional MLH options: Vultr hosting and a GoDaddy project domain may be modest additions if actually used; confirm the category requirements. Gemini/Solana/Snowflake/Tiger Data need meaningful roles and are not automatic. Commit Fellowship's team requirement needs clarification for a solo entrant. Keep these separate from the ten-program sponsor count.

Main awards: target Best Solo Hack and overall consideration. Creative, technical and people-first categories can follow from demonstrated quality. Beginner status is unverified; planet-first/hardware are not part of the proposed scope. Placement prizes are not separate projects.

## Development subagents

Current capacity is **four simultaneous agents total: one lead plus up to three workers**. These are development agents; product/runtime agents are a separate system.

The lead owns scope, interfaces, merges, secrets/configuration decisions, the shared plan, and the final end-to-end result. Workers own bounded files/modules and report changed files, verification evidence, limitations and sponsor evidence. Avoid two workers editing the same shared file.

### Before parallel implementation

First agree on the user journey and module contracts. Proposed records: Claim/Invoice, BankTransaction, Evidence, InvestigationResult, ApprovalDecision and AuditEvent.

Important contract properties:

- Monetary values use integer minor units or exact decimal handling; no floating-point ledger math.
- Evidence carries source type, source record ID, retrieval time and whether it is live, seeded or simulated.
- Investigation results distinguish facts, hypotheses, unknowns and requested actions.
- Permissions and approvals are enforced in application logic, outside model text.
- Approval is bound to the exact invoice/action/version reviewed.
- Changes invalidate stale approvals; repeated requests cannot create duplicate results.
- A replay/reset command restores the demo without erasing the distinction between live API results and fixtures.

These are proposed design constraints, not implemented behavior.

### Phase A — feasibility and contracts

| Owner | Proposed assignment | Completion evidence |
|---|---|---|
| Lead | Pick the exact community and demo scenario; define schemas/ownership; gather real user evidence | One journey, planted-error answer key, contracts, initial cut list |
| Worker 1 | Check Nessie and CRS access and relevant endpoints | Minimal authenticated responses, exact capabilities, test identities, limitations; no invented bank-ownership verification |
| Worker 2 | Check CREAO core-agent invocation and Claude's separate substantial role | Successful invocation, usable agent ID/run-link path, integration contract; or a documented simplification |
| Worker 3 | Work out the approval/evidence UX and Figma artifact route | Clickable core flow and stage-log capture; no unrelated dashboard features |

When implementation is authorized, timebox a blocked provider investigation and make a keep/drop decision. Do not let an unavailable sponsor account prevent the core product from working. A mock is useful for local development but does not count as a live sponsor integration.

### Phase B — build one complete journey

| Owner | Exclusive responsibility | Acceptance criterion |
|---|---|---|
| Lead | Orchestration/API contracts and integration; shared config and HACK.md | Fresh-start demo works; real/seeded/simulated behavior is explicit |
| Worker 1 | Domain logic, ledger matching, fixtures and bank adapter | Detect seeded duplicates/mismatches, deterministic outcomes, no duplicate posting |
| Worker 2 | Runtime-agent integration, evidence assembly and bounded tool execution | Real central agent call, traceable reasoning/evidence, graceful failed-tool handling |
| Worker 3 | Queue, investigation view, approval UI, audit timeline | One user can inspect evidence, approve/reject, and see the authorized outcome |

Integrate early using agreed fixtures. The lead accepts changes one at a time and reruns the same complete scenario after each meaningful integration.

### Phase C — stretch only after baseline works

Reuse the three worker slots for: (1) one approved stretch integration, (2) adversarial/reliability review, (3) submission evidence and documentation. The lead owns the release/demo and all scope decisions.

Useful verification targets: duplicate invoice, changed amount, changed payment detail, missing/conflicting evidence, API timeout, unapproved action, stale approval, replayed request, and a malicious instruction embedded in an invoice. The judge-facing evaluation should measure detection and correct handling against known answers; time savings should come from an actual timed comparison, not a fabricated statistic.

### Freeze and submission

Allocate the final portion of the event to fixes, video, the sponsor-specific evidence matrix and rehearsal. Submit an early Devpost draft. Prepare a short live pitch, a slightly longer recorded walkthrough and explicit sponsor-specific segments (Figma and other video limits still apply). Online integrations need real calls during relevant demos; a clearly labeled replay is a backup, not evidence of a live API call.

**Second submission gate:** consider it only when the primary app is deployed/reproducible, all three core demo scenarios pass, the video and required artifacts are finished, and the Devpost draft is saved. Confirm organizers allow multiple distinct submissions by one hacker and any code reuse. Do not merely rename the same application.

## calhacks-kit review

Inspected main at [209a9095e6dc0771596dabdf77cc604d0959a70e](https://github.com/georgeykalangi/calhacks-kit/commit/209a9095e6dc0771596dabdf77cc604d0959a70e), labeled v1.0.0. No kit commands were installed or run.

It contains six Markdown skills, a shared plan template, a 33-repository catalog, an HTML slide template and examples, and a Python catalog validator. It supplies no OpenBooks domain code, financial controls, sponsor adapters, agent runtime or multi-agent orchestration.

Recommended use:

- Adapt [HACK.template.md](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/skills/hack-scope/HACK.template.md) into a short lead-owned scope/status document.
- Borrow [hack-check](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/skills/hack-check/SKILL.md) for periodic evidence/scope reviews and honest disclosure of fixtures.
- Borrow [hack-ship](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/skills/hack-ship/SKILL.md) and [hack-pitch](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/skills/hack-pitch/SKILL.md) for reproducibility, backup recording and rehearsal.
- The optional HTML deck is useful for a general pitch, but it does **not** replace the Figma Slides required by that track.
- Use the catalog only for a specific missing need. It does not include Hyphenate, Microsoft, CRS or CREAO entries. Its validator checks schema/GitHub metadata, not security, installability or sponsor eligibility.

Caveats relevant here:

- Its event preset is unofficial, has deadline TBA and includes prior-event precedent. Use the current organizer guide and Slack for rules and deadline.
- Its shared HACK.md becomes a contention point if every subagent edits it. Only the lead should write it.
- Claude Code slash/plugin commands are not Codex app commands. The README's Codex route uses a separate Node-based npx installer; selected Markdown can instead be reviewed and adapted without installing.
- Some commands assume Bash or a macOS Chrome path and need PowerShell equivalents.
- Its example secret scans print matched lines. Adapt them to report file/line locations without exposing secret values.
- The kit is MIT licensed; preserve the notice if redistributing substantial copied content. Catalog dependencies have separate licenses.
- Development-tool usage is distinct from runtime sponsor eligibility. Kit usage alone does not qualify OpenBooks for Factory, Anthropic or other runtime tracks.

Sources: [README](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/README.md), [event preset](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/skills/hack-scope/events/calhacks-13.md), [catalog](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/skills/hack-stack/catalog.yaml), [validator](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/scripts/check_catalog.py), [license](https://github.com/georgeykalangi/calhacks-kit/blob/209a9095e6dc0771596dabdf77cc604d0959a70e/LICENSE).

## Track source links

- [Official hacker guide](https://docs.google.com/document/d/1RQrueC9wm5u8uxtWSC2gadIchp05hVayhGUrIjxT9dE/edit)
- [Hyphenate detailed brief](https://docs.google.com/document/d/1u4iN8R97ILY3kfHTPKC82zdutHrGx4ze5eCAP-J92w4/edit)
- [CREAO sponsor requirements](https://cal-hacks-13-0.slack.com/archives/C0C71495G5P/p1792652472670929)
- [Figma detailed brief](https://docs.google.com/document/d/1HjzThDGveSLiilIdEPEHq12ZVLZ5eS0T8CQC5_m_-rg/edit)
- [CRS sponsor announcement](https://cal-hacks-13-0.slack.com/archives/C0C6SV1K9PV/p1792686910485229)
- [Apify sponsor announcement](https://cal-hacks-13-0.slack.com/archives/C0C7TGUC924/p1792528380692499)
- [Bright Data sponsor requirements](https://cal-hacks-13-0.slack.com/archives/C0C6SULMV2P/p1792701277628089)
- [Atlassian detailed brief](https://docs.google.com/document/d/12Y2Vamxbm9W_l2Eo4AM530R7HfNAYCXI-UI6F6Xnggw/edit)

## Open decision

Which specific company finance community can the builder reach quickly enough to validate the invoice/payment/ledger investigation problem? This affects the product language, scenarios, usefulness claims and Anthropic fit. Company accounting integrations and production deployment remain unverified.

