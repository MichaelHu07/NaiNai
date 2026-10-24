# OpenBooks — execution and demo workflow

Historical product script. NaiNai is now the selected direction; use [HACK.md](HACK.md) and the [NaiNai draft design](docs/superpowers/specs/2026-10-23-nainai-mvp-design.md) for current scope, demo and worker ownership. Retain this file's article-based research and process materials as references.

Updated October 23, 2026. This document changes the working process. All product descriptions and scripts below are proposals; no software, user interviews, integrations or measured results are claimed complete.

## Article applied, with event-specific judgment

Reviewed Gary-Yau Chan's [Ultimate 8 Step Guide to Winning Hackathons](https://medium.com/garyyauchan/ultimate-8-step-guide-to-winning-hackathons-84c9dacbe8e), published February 12, 2015.

Its useful themes are focused ambition, complementary roles, audience awareness, deliberate API/design choices, economical UI work, real validation, rehearsed presentation, and follow-through. We adapt them to a solo builder using coding agents.

Use the current Cal Hacks rubric and live-demo requirements. Retain a backend for secrets, permissions and financial integrity. Show real progress and disclose fixtures. Use sponsor conversations to clarify fit; a conversation is not an eligibility guarantee. Keep all implementation within event rules.

The specific decisions, scenarios, budgets and acceptance criteria below are our OpenBooks proposals.

## What changes from the earlier strategy

The target remains broad credible track coverage. The proposed audience is company controllers, accountants and bookkeepers, initially at small and midsize businesses. The scheduling rule changes: an integration must improve the one invoice/payment/ledger investigation journey, supply required evidence, or replace an overlapping tool. A higher count alone is insufficient reason to disrupt a working flow.

Two demonstrable capabilities define the project:
1. Investigate a suspicious or inconsistent claim using source evidence.
2. Resolve it with an authorized human decision and an audit record.

The queue and evidence view should work early with labeled local fixtures so interaction problems surface before provider integration. Keep OpenBooks as the working name. Use suitable existing components and one visual system. Avoid adding organization onboarding, decorative analytics or elaborate branding.

Optional features receive a short assessment: user outcome, sponsor requirement, evidence, setup cost, failure surface, acceptance check and what gets cut to make room. The lead makes the choice under the user's existing scope.

## Stage gates and evidence

| Gate | Required output | Decision |
|---|---|---|
| Problem | Specific community, actual workflow evidence, problem statement and explicit unknowns | Keep or revise the proposed user framing |
| Provider feasibility | Real successful calls and documented exact capabilities for chosen central providers | Keep, replace or drop a sponsor dependency |
| First complete journey | User can open a claim, inspect evidence, decide, and see a persisted outcome | Integrate this before adding another feature |
| Reliability | Core case matrix and reset/failure recovery work | Freeze scope if fragile |
| Submission | Reproducible app, required artifacts, saved Devpost draft and rehearsal evidence | Only then consider a second submission |

Check the event clock at every substantial milestone. Proposed cutoffs are relative to the confirmed deadline: T−12h stop optional features; T−6h freeze optional integrations. Finish unresolved core work and required artifacts. These are planning defaults, not an excuse to postpone the first integration.

## User validation materials

The human selects a reachable participant from the intended community. Agents can organize the evidence but cannot stand in for a real interview. No messages or interviews have been conducted.

Suggested initial conversation:

1. Walk through the last vendor invoice or payment discrepancy you investigated, including the ledger records you checked.
2. Which documents, transaction records and messages did you compare?
3. Tell me about a recent duplicate, mismatch or unclear approval.
4. What would make you refuse an automated recommendation?
5. Who may approve a correction, and what evidence must be retained?
6. Can we watch you review a synthetic example and tell us where our flow differs from your actual work?

Observe behavior before explaining the proposed solution. Collect a recent example with identifying details removed if the participant chooses to share it. Ask before retaining or showing a quote or image.

Aspirational research budget: three short conversations plus one workflow walkthrough; this is a target, not a claim. Start with one relevant participant when that is all we can reach. Do not block all independent planning while awaiting it.

### Evidence log — blank until actual research

| Participant label / role | Date | Recent workflow observed | Problem evidence | Implication | Quote/demo-use permission |
|---|---|---|---|---|---|
| Pending | — | — | — | — | — |

### Usability check after the first working flow

Give the participant one synthetic claim and ask them to decide what to do. Record completion, uncertainty, evidence consulted, mistakes and whether prompting was needed. Then ask what they would use instead.

| Participant | Task | Completed unaided? | Observed time | Error or hesitation | Change made |
|---|---|---|---|---|---|
| Pending | — | — | — | — | — |

Do not equate a friendly reaction with willingness to adopt. Record negative findings and scope changes. Distinguish quotations from paraphrases and hypotheses.

## Evaluation and truthfulness

Create an answer key independent of the model's output for the seeded cases. Initial proposed matrix:

| Case | Required behavior |
|---|---|
| Valid unpaid claim | Match evidence and request the configured human decision |
| Previously paid claim | Identify the matching payment and prevent another result |
| Equal amount, different legitimate claim | Avoid a false duplicate conclusion; distinguish claimant, event, receipt and payment evidence |
| Changed payment details | Flag inconsistency against historical evidence; do not assert proven fraud |
| Different amount / conflicting receipt | Cite the conflict and ask for clarification |
| Missing evidence | Return an explicit unknown; avoid a confident conclusion |
| Provider timeout | Show which source is unavailable and offer a legitimate retry/escalation |
| Changed record after review | Reject a stale approval and require a fresh review |
| Replayed approval/request | No duplicate ledger result or payment |
| Instructions inside a receipt | Treat document content as data; do not grant permissions or authorize an action |

Measure observed case handling against the answer key. If reporting reviewer time, compare equivalent tasks under stated conditions. Use counts and denominators, distinguish synthetic from user cases, and report sample size. No accuracy, savings, market-size or adoption number is filled in yet.

Record model/provider identity and source IDs for the demonstrated run without exposing credentials or sensitive user data. A replayed provider result must be labeled as a replay. Do not present invented chain-of-thought as an actual model trace; show tool actions, evidence, conclusions and decisions.

## Subagent work orders

All workers receive the current HACK.md snapshot, assigned files/modules, shared contracts, a runnable scenario, prohibited overlaps and acceptance criteria. Maximum concurrent workers: three, plus the lead.

Early worker priorities:
- Domain worker: deterministic matching and a known-answer fixture set.
- Runtime worker: a successful central provider operation and source-grounded investigation results.
- Experience worker: queue, evidence comparison, decision and outcome; start against agreed labeled fixtures.

Lead integrates frequently and owns the shared plan. The human can validate the problem and handle account access while bounded development work proceeds during the authorized build period.

After the core journey works, rotate workers into reliability review, submission evidence, and at most one approved technical stretch. Do not let every worker add a new sponsor independently.

### Worker handoff format

- User-visible result:
- Owned files/modules and changes:
- Verification command/check and observed result:
- Core scenario and demo-script effect:
- Track requirement supported by evidence:
- Live/seeded/simulated boundaries:
- Limitations and next dependency:

“Code written” alone is not a completion signal.

## Judge-facing presentation

Current research is in [OPENBOOKS_JUDGES.md](OPENBOOKS_JUDGES.md): 14 priority profiles, with Slack event evidence separated from public professional corroboration and uncertainty. The researched sample includes fintech/business context, enterprise agents, agent evaluation, full-stack review/approval, growth and distributed-systems expertise. No table assignments were found. Use these backgrounds to prepare the same-amount counterexample, provenance trace, stale/retry behavior and adoption evidence; do not infer personal scoring preferences or add unrelated features.

One consistent product, with a different evidence emphasis according to the published rubric:

| Audience interest | Evidence ready to show |
|---|---|
| Finance autonomy | Which finance roles are covered; exception handling, history, permissions and approval |
| Sponsor integration | Actual central API/agent operation and the outcome it changes |
| Engineering | A changed input, failure handling, exact calculations and duplicate-action protection |
| User value | Real problem evidence and observed usability findings |
| Design/workflow | Why the evidence comparison and decision are understandable; actual Figma stage log |

Do not invent judges' backgrounds or change claims to flatter them. Use confirmed rubric details. If seeking mentor feedback, prepare a short question and let the user decide whether to ask it.

Draft sponsor-fit questions:
- Hyphenate: does this bounded reconciliation/controller workflow demonstrate the autonomy and evidence you want?
- CREAO: does the proposed core-agent responsibility meet the qualifying requirement, and how should the run link be submitted?
- CRS: which supplied test identities/endpoints support this specific investigation, and what must we avoid claiming?
- Figma: confirm submission selections match the linked four-award brief and verify required artifact access.

These are prepared questions; none has been sent.

## Draft two-minute demo

This is a rehearsal script for the proposed product, not a report of current functionality. The $480 claim and every company record in the story are synthetic.

| Time | On screen | Draft narration / action |
|---|---|---|
| 0–12 sec | Open the flagged $480 vendor invoice | “This invoice appears to have been paid already. OpenBooks connected the prior payment and ledger entry to this new submission and held it for controller review.” Say clearly that this is a seeded test case. |
| 12–25 sec | Show the company's review queue | Explain the controller/accountant's manual review problem. Replace the hypothesis with actual research evidence when available. |
| 25–55 sec | Compare invoice, prior submission, bank transaction, ledger entry and sources | Run the actual investigation. Identify the central provider's real contribution and show the matching/conflicting evidence. |
| 55–80 sec | Human decision and audit result | Reject or escalate the duplicate; show the recorded authorized result and attempt a repeat action to demonstrate duplicate protection. |
| 80–100 sec | Change an input or open the missing-evidence case | Demonstrate that uncertainty or changed evidence alters the outcome. Skip this segment if necessary to stay inside the short live slot. |
| 100–120 sec | Result and evidence/limits summary | State the observed evaluation result if measured, the meaningful integrations, the explicit limits, and the next user test. Make no invented customer or production claims. |

Prepare a 30-second interruption version and a ≤3-minute recording where required. Hyphenate's video should start with the strongest evidence of judgment. Cartesia or other unused tracks do not shape this script.

Avoid spending the opening on framework names, the full sponsor list or team introductions. Each claimed integration must be explainable when asked. Keep technical details and the evidence appendix available for follow-up questions.

### Q&A preparation

Prepare concise, evidence-backed answers:
- Why is an agent needed rather than a fixed duplicate checker?
- Which outcome is deterministic and which requires uncertain interpretation?
- Why must a human approve?
- What happens if a provider fails or a record changes?
- Which data are live, seeded or simulated?
- What specifically did each sponsor tool do?
- What did an actual user change about the design?
- Who would adopt it first, and what would they replace?
- What would have to change for production use?

Business model, adoption channel and competitor comparisons remain hypotheses until researched. A plausible initial adoption path is a small pilot with the validated community; no pilot is claimed secured.

## Rehearsal and submission checklist

- [ ] Confirm the current deadline and sponsor submission rules.
- [ ] Fresh setup/deployment and dataset reset work.
- [ ] Main scenario and critical failure cases have verification evidence.
- [ ] Required services are available; backup replay/recording is labeled.
- [ ] Demo access uses synthetic data and preserves authorization boundaries.
- [ ] Devpost draft saved early; repo/image/demo links correct.
- [ ] Each selected track has actual evidence and required links.
- [ ] CREAO ID/run link, Figma Slides/stage log/public files, and any other selected-track artifacts are complete.
- [ ] Live pitch rehearsed three times, timed, with a late-arriving judge interruption.
- [ ] Another person can identify user, problem, outcome and limits from the demonstration.
- [ ] OpenBooks is understandable without a ten-logo slide.
- [ ] Second submission remains deferred until the first is ready and entry/reuse rules are confirmed.

## After the event

Preserve the evaluation and participant feedback. Make a small next-step list tied to observed problems. If the user wants follow-up with participants/sponsors, obtain explicit messaging authorization then; no outreach or recurring automation is scheduled by this document.

