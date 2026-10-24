# NaiNai

**Grandma means business.** A small buying team that makes quote terms, missing costs and human controls visible.

This is a working **local, fixture-only MVP**. The coffee table is a real personal need; the GPU case is an evaluation with no actual workload or company buyer. Every supplier quote, conversation and tax amount in the app is synthetic. Claude, Cartesia and Apify are placeholders. No supplier is contacted, no purchase is made and no GPU capacity is reserved.

## Run locally

Use **Node 24.19.0** and **pnpm 11.25.0**. Dependencies are locked in `pnpm-lock.yaml`.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env
pnpm dev
```

Open **http://127.0.0.1:5173**. The API runs at port 3001. The terminal prints the location of `local-access-key.txt`; copy its contents into the startup-passphrase form. The key itself is never printed by the server. On Windows the default file is `%LOCALAPPDATA%\NaiNai\cal-hacks\local-access-key.txt`.

This machine has a bundled pnpm executable if `pnpm` is absent from PATH:

```powershell
& 'C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd' dev
```

SQLite and the local key live outside the checkout/OneDrive by default. Set `NAINAI_DATA_DIR` to use a separate rehearsal workspace. An optional `NAINAI_PASSPHRASE` must be at least 12 characters. Provider keys may remain `REPLACE_ME`; entering a key does not enable live integrations. The server rejects live mode or `NAINAI_CONTACT_ENABLED=true` in this build.

For a built frontend:

```powershell
pnpm build
pnpm start
```

Then open **http://127.0.0.1:3001**. This is a local development service; production hosting is outside this milestone.

## Try the workflow

1. Open **Coffee table**. Inspect the synthetic source and full cost breakdown. Delivery service starts unresolved; select doorstep only for a rehearsal of that requirement.
2. Start a **synthetic conversation**. Pause, take over or stop it, or explicitly advance the deterministic script. No audio or model API is involved.
3. Select **Missing cost**. Review and save incomplete findings; review does not change them into a qualifying quote.
4. Switch to **GPU compute**, choose **Longer minimum term**, and compare the $2 hourly rate's $2,688 commitment with the complete fixture's $1,728. Neither is a real offer or saving.
5. Open **Review findings**, expand the synthetic fee-change test and change a fee. Attempting to mark the old snapshot reviewed returns a conflict. Review the current findings, then **Save quote packet**.

Saved reviews are immutable. Current request, quote, evidence, permissions and quote validity determine whether a review is current. Sharing withdrawal redacts source content in later exports; existing downloads cannot be recalled. Restarting an interrupted rehearsal marks it failed and pauses future conversations until explicitly resumed.

The app has no accept, checkout, order, payment, deposit, reservation or provisioning operation. Source URLs and deterministic cost checks do not establish supplier authenticity by themselves.

## Check the build

```powershell
pnpm test
pnpm typecheck
pnpm build
pnpm test:browser
```

Browser checks use installed Microsoft Edge and a running frontend at port 5173. Ten route-isolated tests exercise the UI without providers. An additional local API smoke runs only when `NAINAI_UI_SMOKE_KEY` supplies the access key for a dedicated fixture server; use a temporary `NAINAI_DATA_DIR`, never a real supplier workspace. [Reliability evidence](docs/NAINAI_RELIABILITY.md) distinguishes passing local checks from unimplemented live-service gates.

## Scope and evidence

- [Current design](docs/superpowers/specs/2026-10-23-nainai-quote-only-mvp-design.md)
- [Implementation plan](docs/superpowers/plans/2026-10-23-nainai-quote-only.md)
- [Demo and rehearsal](docs/NAINAI_DEMO.md)
- [Working brief and remaining gates](HACK.md)
- [Track requirements](CAL_HACKS_13_TRACKS.md)

Visa, Cartesia, Microsoft, Apify and Figma are conditional targets, not earned eligibility. No real negotiation, customer validation, backup recording, Devpost submission or measured savings has been completed by this fixture build.
