# Narrated demo recorder (aadm-website)

Portable **presentation runtime** for this Astro marketing site. Practical how-to for `playwright/demos/`.

**Doctrine starts at:** [`docs/PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md`](../../docs/PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md)

| Need | Doc |
|------|-----|
| Normative capture / status machine | [`PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md`](../../docs/PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md) |
| Walk prep / value stations | [`DEMO_WALK_SPECIFICATION.md`](../../docs/DEMO_WALK_SPECIFICATION.md) |
| Roles, DO NOT RECORD / READY TO CAPTURE, troubleshooting | [`DEMO_CAPTURE_DEFINITION_OF_DONE.md`](../../docs/DEMO_CAPTURE_DEFINITION_OF_DONE.md) |
| Clerk login / member / CNAME | [`CLERK-AUTH.md`](../../docs/CLERK-AUTH.md) |

**What it is:** one continuous cursor-led viewport recording (`walkthrough.run` → one context → `finish()`).  
**What it is NOT:** Playwright smoke (`scripts/*-smoke.mjs`); a discovery tool for broken product; permission to gut stations; audio in the MP4. Do **not** turn on suite-wide `video` to “also capture demos.”

**This repo vs portable framework:** `framework/` + `run-demo.ts` + this README + `examples/` are the portable recorder (add when implementing). `adapters/`, `walkthroughs/`, product walk-specs are **aadm.io**-specific (Astro pages + Clerk member). Do **not** copy another product’s tours into this tree.

---

## Status of this folder

The **normative docs** above are the source of truth. Wire `framework/`, `run-demo.ts`, and `npm run demo:*` when implementing. Until then:

- Use DoD + V2 for walk design and gate language.  
- Keep regression coverage in existing smokes (`test:clerk-smoke`, `test:mobile-nav`).  
- Do not treat a one-off Playwright script as a shipping narrated cut.

---

## Layers (target)

```text
framework/     DemoSession (product-agnostic)
adapters/      login (Account Portal), locators (/member, /mcp, home)
walk-specs/    tour envelope (machine) — optional until schema lands
walkthroughs/  product stories (aadm.io tours)
examples/      public smoke (basic)
voiceovers/    human VO
run-demo.ts    CLI
```

```ts
export const walkthrough: DemoWalkthrough = {
  name: "mcp-setup",
  async run(demo) {
    await demo.scene("mcp-page", async () => { /* ... */ });
    await demo.hold();
  },
};
```

**API (when framework lands):** `goto`, `scene` / `present`, `click` / `clickIfPresent`, `hover`, `moveTo` / `pointAt`, `type`, `select`, `scrollTo` / `scrollBy`, `waitForScene` / `waitForPath`, `pauseForNarration`, `hold`, `finish`, plus optional `ux` / ORIENT helpers.

Profiles: `narrated` (default), `standard`, `fast`.

**Anti-pattern:** silent `goto` + click chains without Reading → Clicking. Automation success ≠ viewer clarity.

---

## Commands (target)

```bash
npm run dev
# BASE_URL / PLAYWRIGHT_BASE_URL → http://127.0.0.1:4321

npm run demo:validate-walks
npx tsx playwright/demos/run-demo.ts <name> --validate-walk
npx tsx playwright/demos/run-demo.ts <name> --rehearse --profile=fast
npx tsx playwright/demos/run-demo.ts <name> --capture --require-mp4
```

Aliases: `--dry-run`→rehearse, `--final`→capture. Checklists: DoD. Artifacts: `test-results/demos/<name>-<timestamp>/`.

**Deps when implementing:** `@playwright/test` (already in repo), `tsx`, FFmpeg on `PATH` for MP4.

```json
"demo:record": "npx tsx playwright/demos/run-demo.ts",
"demo:validate-walks": "…"
```

---

## Writing a tour (order)

1. Intent + stations (V2 **DRAFT** → **WALK DEFINED**) — marketing, `/mcp`, or `/member` credentials story.  
2. Path helpers in `adapters/` (locators, soft-skips, Clerk login).  
3. Walkthrough scenes in `walkthroughs/*.demo.ts`.  
4. Human UX review → validate-walk → rehearse → capture gate → capture → verify (DoD).

Fill the **full** path; soft-skip controls only — normative: capture V2 I11 / §4.

**Auth tours:** start at Account Portal (`accounts.aadm.io` / local Clerk), then `/member`. Never invent a fake SignIn page on marketing hosts. See CLERK-AUTH.

**Secrets:** never log or narrate `aadm_…`, `ak_…`, passwords, or Clerk secret keys. Prefer disposable test users; redact key material on camera for public cuts.

---

## Portable beat template (Astro / aadm.io)

**Lead cut (`standard-onboard`, ~20s `fast`):** Home → Open standard → GitHub UDALI → L1–L22 → return → Create account → `/member`.

Other tours — replace product nouns; keep verb cadence.

| # | Beat | Verbs | Intent |
|---|------|-------|--------|
| 1 | Land home | Reading, Clicking | Orient on brand / hero |
| 2 | Open MCP setup | Reading, Clicking | Public `/mcp` story (no credential values) |
| 3 | Sign in | Typing, Clicking | Account Portal authenticate |
| 4 | Member shell | Reading | `/member` — tabs visible |
| 5 | API keys | Reading, Clicking | Clerk API keys surface |
| 6 | Connectors OAuth | Reading, Clicking | OAuth Client ID + connection help |
| 7 | Profile / Security | Reading, Clicking | Account + security (look, don’t mutate secrets) |
| 8 | Close | Reading | Stable end frame for VO |

**Verbs:** Reading (lead) → Clicking / Typing / Asking. Log `UX <Verb> → <affordance> (beat <id>)`.

---

## aadm.io tour map (click paths live here)

| Tour | Success path (stations + beats) | Walk spec |
|------|----------------------------------|-----------|
| `standard-onboard` (lead, ~20s `fast`) | [`adapters/standard-onboard-success-path.v1.ts`](./adapters/standard-onboard-success-path.v1.ts) | [`walk-specs/standard-onboard.walk-spec.v1.ts`](./walk-specs/standard-onboard.walk-spec.v1.ts) |

VO: [`voiceovers/standard-onboard.voiceover.md`](./voiceovers/standard-onboard.voiceover.md) — says **your name** / **your email**.  
**MUST** visit Connectors OAuth. **MUST NOT** click Client ID / Copy client ID.

One-shot capture: `node playwright/demos/record-standard-onboard.mjs`
| `marketing-home` | [`adapters/marketing-home-success-path.v1.ts`](./adapters/marketing-home-success-path.v1.ts) | [`walk-specs/marketing-home.walk-spec.v1.ts`](./walk-specs/marketing-home.walk-spec.v1.ts) |
| `mcp-setup` | [`adapters/mcp-setup-success-path.v1.ts`](./adapters/mcp-setup-success-path.v1.ts) | [`walk-specs/mcp-setup.walk-spec.v1.ts`](./walk-specs/mcp-setup.walk-spec.v1.ts) |
| `member-credentials` | [`adapters/member-credentials-success-path.v1.ts`](./adapters/member-credentials-success-path.v1.ts) | [`walk-specs/member-credentials.walk-spec.v1.ts`](./walk-specs/member-credentials.walk-spec.v1.ts) |
| `basic` | [`adapters/basic-success-path.v1.ts`](./adapters/basic-success-path.v1.ts) | [`walk-specs/basic.walk-spec.v1.ts`](./walk-specs/basic.walk-spec.v1.ts) |

**Signup fixture (env only):** [`adapters/demo-signup-fixture.v1.ts`](./adapters/demo-signup-fixture.v1.ts) — `DEMO_SIGNUP_FIRST_NAME` / `LAST_NAME` / `EMAIL` / `PASSWORD` / `OTP`. Defaults type **your** / **name** (VO: “your name”) · `your.email+clerk_test@aadm.io` · password default is Clerk-safe length (`YourPassword-demo-4242!` if env unset or &lt;12 chars) · OTP `424242` when unset. **Never** log passwords.

Catalog: [`walk-specs/index.ts`](./walk-specs/index.ts). Prep standard: [`docs/DEMO_WALK_SPECIFICATION.md`](../../docs/DEMO_WALK_SPECIFICATION.md).

Implement `walkthroughs/*.demo.ts` when the runtime exists — one `demo.scene(sceneId)` per locked station.
