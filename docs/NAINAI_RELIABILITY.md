# NaiNai reliability acceptance and readiness

October 24, 2026. **Planning only: every product check below is NOT RUN.** No scaffold, installation, service call, supplier contact, real quotation or measured result exists. This document implements the gates in the [canonical plan](superpowers/plans/2026-10-23-nainai-quote-only.md), under the [quote-only spec](superpowers/specs/2026-10-23-nainai-quote-only-mvp-design.md). It is not a new product scope.

## Finish line

One buyer can research, separately authorize quote-only negotiation, inspect original evidence and full costs, review the current findings and save a packet. Both the real personal table case and evaluation-only compute case use that same journey. Missing information, refusal and no response stay honest outcomes; no purchasing or capacity action is available. A robust fixture journey proves software behavior, not real negotiation or sponsor integration.

## Acceptance matrix

Owner references: lead core (Task 1), evidence worker (Task 2), voice worker/lead dispatch (Task 3), UI worker (Task 4), lead/reliability integration (Task 5). During execution replace NOT RUN with PASS/FAIL/BLOCKED and append the actual command, assertion count or permitted artifact/run ID. Do not turn an account blocker into a passing runtime check.

| ID | Scenario | Required result | Owner / status |
|---|---|---|---|
| R01 | Both case journeys, initially synthetic | Request -> evidence -> current assessment -> review -> saved packet; persistent intent/origin labels | UI + integration / NOT RUN |
| R02 | Complete confirmed table quote at 14999 / 15000 cents | First may qualify; second fails exclusive cap; delivery/tax/mandatory fees included | Evidence / NOT RUN |
| R03 | Missing fee, tax, stock, hard spec or required delivery detail | Unknown remains unknown; no qualifying or complete-cost claim; save incomplete findings allowed | Evidence + UI / NOT RUN |
| R04 | Different SKU, new-to-open-box condition, warranty or commitment | Separate scope/baseline; inspection and buyer acceptance evidence required for condition alternative; no equivalent-savings claim | Evidence / NOT RUN |
| R05 | GPU 8 x 72 x $3 versus 8 x 168 x $2 | 172800 versus 268800 cents before extras; second is longer commitment, not equivalent savings; evaluation-only throughout | Evidence / NOT RUN |
| R06 | GPU fractional $0.001 x 8 x 72 | 58 cents after one final rounding; original decimal rate retained | Evidence / NOT RUN |
| R07 | GPU wrong topology/VRAM/interruption; unknown extras/availability | Failed or unknown checks visible; no actual-workload validation or reserved-capacity claim | Evidence / NOT RUN |
| R08 | Public listing or model/transcript extraction | Observation/proposal remains unconfirmed; authenticated human verification plus original evidence needed for confirmed terms | Evidence / NOT RUN |
| R09 | Actual refusal/no response versus transport/model error | Preserve distinct source-backed outcomes; no response is never inferred solely from missing quote/network failure | Voice + evidence / NOT RUN |
| R10 | Quote/request/evidence/permission revision changes | Old review cannot be treated as current; stale write returns 409/STALE_REVISION; refresh without automatic re-review | Core + UI / NOT RUN |
| R11 | Duplicate/concurrent review, including null quote | Same immutable record for same snapshot; conflicting idempotency-key payload rejects | Core / NOT RUN |
| R12 | Restart after save; old quote expires | Durable review/evidence survive; expiry checked on current display; old qualification is historical, not current | Core + integration / NOT RUN |
| R13 | Two simultaneous initial contacts or repeated action key | One durable dispatch; global active/uncertain conversation lock; max five approved distinct suppliers across cases | Lead dispatch / NOT RUN |
| R14 | Crash/timeout after possible provider send | delivery_unknown persisted; no automatic redial/resend; reconcile provider status before another conversation | Lead recovery / NOT RUN |
| R15 | Forged, duplicate or out-of-order callbacks | Authentication/schema/session binding enforced; replay deduplicates; terminal/AI-control state never reactivates | Lead callbacks / NOT RUN |
| R16 | Pause/revoke/takeover while model/tool work is pending | Recheck authority before send; cancel late AI actions; pause prevents future dispatch; takeover grants no new supplier permission | Lead dispatch + voice / NOT RUN |
| R17 | Explicit stop or audio disconnect; provider slow to acknowledge | Stop AI actions and attempt termination; owner can stop after pause/contact revocation; show pending/failure truthfully; block another conversation until reconciled | Voice + UI / NOT RUN |
| R18 | Unauthenticated/cross-buyer access, cross-origin write, leaked client configuration | Reject access/write; server-only credentials; no private address, token or unauthorized recording in logs/export | Core + integration / NOT RUN |
| R19 | Recording/sharing permission withdrawn after historical review | Current display/export redacts affected assets; preserve only permitted metadata/artifacts; no promise to recall downloads | Core + UI / NOT RUN |
| R20 | Supplier prompt injection or source redirect to private network | Treat text as data; reject unauthorized tools/URLs/redirects; no capability or credential escalation | Evidence + core / NOT RUN |
| R21 | Source slow/empty/blocked; Actor failed or still running | Bound time/work, record real state/run ID; no invented rows; max three research jobs and 100 genuine observations | Evidence / NOT RUN |
| R22 | Live service unavailable or cached evidence used | Visible error or cached timestamp; no silent fixture fallback and no claim of live service use | All + UI / NOT RUN |
| R23 | Synthetic quote fixture with live credentials configured | Isolated workspace cannot contact suppliers or modify authentic evidence | Core + integration / NOT RUN |
| R24 | Attempt accept/pay/order/deposit/reserve/provision, even through model output | Reject unknown/commercial actions at application boundary; review/save has zero commercial effects | Core + integration / NOT RUN |
| R25 | Real browser voice, interruption and harmless tool; separate telephony test | Actual provider events/IDs preserved; tool authority enforced; consented test person labeled simulated counterparty | Voice + lead / NOT RUN |
| R26 | Specifically authorized actual table attempt | Preserve authentic initial/final terms and outcome if obtained; no concession or reply assumed; no paid-savings claim | Voice + lead / NOT RUN |
| R27 | Fresh checkout, missing credentials, offline reload, narrow screen and keyboard | Documented pinned-runtime/npm-ci setup; clear provider status, durable saved evidence, usable controls and honest labels | UI + integration / NOT RUN |

## Human inputs and account gates

| Dependency | Current evidence | What closes it |
|---|---|---|
| Claude API | Deferred/unverified; use placeholder | Successful bounded model/tool smoke during authorized live integration; no API key in this file |
| Cartesia browser audio | Deferred/unverified; use placeholder | Actual microphone/playback/interruption/tool/stop smoke |
| Telephone route, callback authentication and takeover/termination | Deferred/unverified | One documented route, successful call with an explicitly consenting test participant, no assumed phone access from TTS credits |
| Apify | Deferred/unverified; use placeholder | Successful bounded public-source run per category, tested build/run/dataset IDs and failure handling |
| Figma Edu | Deferred/unverified | Actual verification plus public files, required Slides/stage log and workflow evidence; optional if access is unavailable, with track dropped honestly |
| Personal table delivery/service/deadline, assembly and inspection choices | Partially specified | Buyer supplies the remaining preferences; unknown hard requirements cannot be silently invented |
| Supplier contact scope | Not granted | Buyer separately authorizes exact supplier/endpoint, purpose, limits and relevant AI/transcription/recording/sharing permissions |
| Real supplier response and complete quotation | None | Authorized actual response/artifacts; refusal/no response remains a valid saved finding but does not prove completed negotiation |
| Actual SMB/community validation | None | Human lived experience or real participants; personal table need is not business adoption; compute remains evaluation-only |

The user answered the account-status question with **"use placeholders for now"** on October 24. G1/G2 use injected fake adapters and explicitly synthetic evidence; no account setup is required for those milestones. Planned provider keys use REPLACE_ME, provider mode is fixture, and contact is disabled. Dummy values must report unconfigured and never reach provider APIs. Preserve real auth/revision enforcement. This preference supplies no account verification, sponsor evidence or supplier-contact permission. Do not put credentials here or obtain contacts/accounts/send messages to resolve these gates without appropriate authority.

## Program evidence and demonstration

Five primary targets remain Visa, Cartesia, Microsoft, Apify and Figma, subject to the [recorded rules](../CAL_HACKS_13_TRACKS.md). All eligibility is unearned. Visa needs the actual shopping experience; Cartesia actual central runtime voice; Apify material public research with run/source evidence; Microsoft working usefulness/responsible execution without claiming company adoption; Figma actual Edu-verified workflow and artifacts. Hyphenate, new backend integrations, new feature brainstorms and a second submission remain deferred.

The [120-second demo](NAINAI_DEMO.md) is unchanged. Show the actual table outcome, shorter compute evaluation and isolated synthetic stale-review check; no supplier must answer during judging. Preserve a permitted saved-evidence/recording backup, with cached/recorded labels. Missing permissions or unavailable integrations remain explicit; a backup is not a fabricated live run.

## Completion record template

For each task/gate record: what the buyer can now do; command/results and actual evidence IDs; both cases exercised or inspected; demo script changed/unchanged; sponsor requirement supported or still unmet; real/public/indicative/synthetic boundaries; weakest judging dimension and next action in HACK.md. Mark only executed matrix rows PASS. Never infer product reliability from documentation checks.

Before submission: applicable critical matrix rows pass, real-negotiation objective/evidence status explicitly reported, reproducible setup verified, required links/artifacts and Devpost draft saved, permitted backup captured, and three rehearsals <=120 seconds. No optional feature after Sunday October 25 00:00 Eastern; no optional integration after 06:00 Eastern; core repairs/artifacts continue until the noon Eastern deadline.
