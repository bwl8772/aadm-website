# Playwright narrated demo capture — spec V2 (aadm-website)

**Status:** Governing operating specification for narrated product demo captures in **this Astro repo** (`aadm.io`).  
**Companion DoD:** [`DEMO_CAPTURE_DEFINITION_OF_DONE.md`](./DEMO_CAPTURE_DEFINITION_OF_DONE.md)  
**Portable how-to:** [`../playwright/demos/README.md`](../playwright/demos/README.md)  
**Auth / hosts:** [`CLERK-AUTH.md`](./CLERK-AUTH.md)

**Recorder nature:** a **presentation runtime** on top of Playwright APIs — **not** a second Playwright smoke suite (`test:clerk-smoke`, `test:mobile-nav` stay separate).

Normative keywords: **MUST** / **MUST NOT** / **SHOULD** / **MAY** (RFC 2119 sense).

This file owns **normative capture requirements**. It does **not** own long how-tos, credentials, or Clerk CNAME policy — see CLERK-AUTH and the demos README.

---

## Architectural principle (first)

> **A valid recording is the consequence of a validated customer walk.  
> Video capture never defines, discovers, or repairs the walk.**

Consequence:

- Architecture and intent **MUST** be explicit before execution.  
- User flows and boundaries **MUST** be established before implementation of capture.  
- Requirements **MUST** become a measurable walk (stations + verbs) and **MUST** be validated **before** final video.  
- A green MP4 **MUST NOT** be treated as proof that the walk is correct.

---

## Walk status machine (normative — no jumps)

Every shipping demo **MUST** carry exactly one of these statuses. Advances **MUST** be adjacent only. **MUST NOT** jump.

```text
DRAFT → WALK DEFINED → WALK VALIDATED → CAPTURE READY → CAPTURE VERIFIED
```

| Status | Meaning | Enter when | Leave only by |
|--------|---------|------------|---------------|
| **DRAFT** | Intent / blockers named; walk not yet specified | Tour named; gap notes if blocked | Completing walk specification artifacts |
| **WALK DEFINED** | Customer walk is explicit and measurable | Walk spec + adapters + `*.demo.ts` aligned | Passing walk validation |
| **WALK VALIDATED** | Non-recording proof that the walk is the story | Order / contract checks green | Human capture-readiness (rehearsal **SHOULD** inform this) |
| **CAPTURE READY** | Allowed to run final capture | Readiness kinds (§2) + H5 | Completing final capture **and** artifact/UX verification |
| **CAPTURE VERIFIED** | Shipping cut accepted | Final MP4 + metadata + H6 | (terminal for that cut; material walk edits reset toward DRAFT / DEFINED) |

**No-jump rule:** from status *S*, the only legal next status is the immediate successor. Illegal examples: DRAFT → WALK VALIDATED; WALK DEFINED → CAPTURE READY; using video to “prove” the walk into CAPTURE VERIFIED.

**Activities vs statuses:** rehearsal (`--rehearse` / `--dry-run`) and final capture (`--capture` / `--final`) are **activities**, not statuses.

- Rehearsal **MAY** run only at **WALK VALIDATED** (or later).  
- `--capture` / `--final` **MUST** require at least **WALK VALIDATED** and **SHOULD** require **CAPTURE READY**.  
- **CAPTURE VERIFIED** **MUST** wait for artifact + UX verification after the final cut — the MP4 alone is not verification.

### Gate rule (non-negotiable)

> **NO FINAL VIDEO CAPTURE MAY BEGIN UNTIL THE WALK IS AT LEAST WALK VALIDATED AND CAPTURE READY.**

Operationally (when the demo CLI exists):

- **WALK VALIDATED** = `npm run demo:validate-walks` (or equivalent order/contract check + stamp).  
- **CAPTURE READY** = readiness report YES after `--validate-walk` + `--rehearse` (blocking gaps 0).  
- **Final capture** = `npm run demo:record -- <name> --capture --require-mp4` (refuse without stamp + CAPTURE READY; override only via documented env if introduced).  
- **CAPTURE VERIFIED** = post-cut artifact + UX verification (H6).

`--rehearse` / `--dry-run` **MUST NOT** produce the shipping MP4. `--validate-walk` **MUST NOT** require a final video.

---

## Status entry criteria (detail)

### DRAFT

**MUST** answer before treating the tour as specified:

| Field | Meaning |
|-------|---------|
| Persona / tour name | e.g. `marketing-home`, `mcp-setup`, `member-credentials` |
| Audience outcome | What the viewer should believe after watching |
| Value stations | Ordered product stations that **must** appear |
| Blockers | Product / auth gaps that prevent shipping |
| Public vs authenticated | Public Astro pages vs Account Portal → `/member` |

**MUST NOT** open an authenticated tour while P0 blockers remain (Clerk misconfig, broken `/member`, missing env). Blocked tours remain **DRAFT**.

---

### WALK DEFINED

**MUST** exist as an explicit walk before the walkthrough is treated as authoritative and before any final recording:

1. Short walk note or `playwright/demos/walk-specs/<name>.walk-spec.v1.ts` (when the schema lands) — stations, verbs, public vs auth.  
2. Path helpers in `playwright/demos/adapters/` — locators, soft-skips (product-specific).  
3. Walkthrough in `playwright/demos/walkthroughs/*.demo.ts` — product story only; one `scene` per station.  

**MUST NOT** put product locators in `framework/`.  
**MUST NOT** implement executable Playwright as the first artifact of a new tour — stations first.  
**MUST NOT** shorten a full station path to satisfy a duration budget.

---

### WALK VALIDATED

Static / contract proof that **story order** and **station preservation** hold. **MUST** pass before rehearsal is treated as trustworthy and **MUST** pass before `--capture`.

| Check | Mechanism |
|-------|-----------|
| Scene order matches contract | Walk / contract tests when present |
| Required stations present (no gutting) | Order QA asserts scene ids |
| Capture-gate coherent | Framework gate tests when present |

```bash
npm run demo:validate-walks
```

(When wired: writes a stamp under `test-results/demos/` used by `--capture`.)

**MUST NOT** treat a green final MP4 as substitute for **WALK VALIDATED**.

---

### CAPTURE READY

Reached only from **WALK VALIDATED**. Evidence **SHOULD** include dry-run / headed rehearsal; rehearsal **MUST NOT** skip validation.

```bash
npm run demo:record -- <name> --rehearse --profile=fast
npm run demo:record -- <name> --capture --require-mp4
```

Technical + data + capture readiness **MUST** be green before final. See DoD H5 / READY TO CAPTURE.

**MUST** use default profile `narrated` unless an intentional exception is documented.  
**MUST** target local Astro (or staging) via `PLAYWRIGHT_BASE_URL` / `BASE_URL` — default **`http://127.0.0.1:4321`** (`npm run dev`). **MUST NOT** treat production-only capture as the only validation path; prefer local/staging first.

---

### CAPTURE VERIFIED

Reached only from **CAPTURE READY**, after final capture **and** verification:

1. `metadata.json` has `ok: true`, `captureIntent: "final"`, scene bounds.  
2. `demo.mp4` exists when `--require-mp4`.  
3. Spot-check: light theme (or intentional brand theme), pointer visible, stations present, **no secret leakage** (Clerk keys, `aadm_…`, `ak_…`, passwords) in logs/timeline/VO.  
4. Voiceover re-synced or explicitly deferred.  
5. Soft-skips logged during the run are noted as product debt if needed.

Material walk edits **MUST** regress status — never stay **CAPTURE VERIFIED** while the walk diverges.

---

## 0. Hard invariants (never relax)

| # | Invariant |
|---|-----------|
| I0 | Recording is consequence of a validated walk; video never defines/discovers/repairs the walk. |
| I0b | Status machine advances with **no jumps**. |
| I1 | Playwright **smoke** scripts **MUST NOT** turn on suite-wide `video` to “also capture demos.” Demo video is **only** via the demo session `recordVideo` path. |
| I2 | One `walkthrough.run(demo)` **MUST** equal one browser context and one continuous recording. **MUST NOT** stitch clips. |
| I3 | Every shipping authenticated demo **MUST** start at Clerk sign-in (`accounts.aadm.io` / portal) unless the walk explicitly declares a **public-page** demo. |
| I4 | Final capture viewport **MUST** be **1920×1080**, `deviceScaleFactor: 1`. |
| I5 | Final capture **MUST** force a stable light (or documented brand) theme before first paint. |
| I6 | When FFmpeg is available (or `--require-mp4`), delivery MP4 **MUST** be H.264 / `yuv420p` / `+faststart` / **no audio** (`-an`). |
| I7 | Narration dwell and technical UI readiness **MUST** remain separate (`pauseForNarration` ≠ `waitForScene`). |
| I8 | A visible presentation pointer **MUST** be used on shipping captures. |
| I9 | UX cadence **MUST** stay explicit: **Reading → Clicking / Typing / Asking**. |
| I10 | Real product navigation is preferred; `goto` is fallback, **MUST NOT** shortcut past user-visible hubs (e.g. home → MCP → member). |
| I11 | **Fill the full customer walk.** **MUST NOT** gut value stations to reduce duration. Soft-skip a broken affordance; **MUST NOT** silently delete a product station. |
| I12 | Passwords, Clerk secrets, dashboard tokens (`aadm_…`), user API keys (`ak_…`) **MUST NOT** appear in logs, timeline labels, or narration scripts. |
| I13 | Walkthroughs own the product story; `framework/` **MUST** stay product-agnostic; locators/login/state **MUST** live in `adapters/`. |
| I14 | Recording **MUST NOT** be the first validation of a walk (status **MUST** be ≥ **WALK VALIDATED** before trusting video). |

---

## 1. Purpose

Produce **one continuous viewport video** a human can voice over: cursor-led, paced like a presenter, covering the **entire user action path** and every **value station** for that tour on **aadm.io** (marketing + member credentials).

| In scope | Out of scope |
|----------|----------------|
| Deterministic walkthrough + presentation recording | Clerk smoke / mobile-nav regression video |
| Checklist verbs + real commits (clicks that matter) | Silent `goto` tours that skip hubs |
| Soft-skip hung controls | Deleting stations to hit a duration budget |
| Separate human voiceover script | Synthesized audio in the MP4 |
| Lifecycle statuses before final capture | Using `demo:record` to define or repair the walk |
| | Capturing raw secret values on screen as the “demo” |

---

## 2. Readiness kinds (definitions)

| Kind | Meaning | Examples |
|------|---------|----------|
| **Technical readiness** | App + recorder + env can run the walk | `npm run dev` up; `/health` OK; FFmpeg on PATH for final MP4; Chromium launches; `BASE_URL` → `:4321` |
| **UX readiness** | Presentation behavior is correct | Pointer on targets; Reading lead before Click; narration pauses on stable screens |
| **Data / state readiness** | Account / env supports the story | Clerk keys present for signed-in tours; test user available; portal redirects work |
| **Narration readiness** | Human VO can be laid under the cut | Script covers every value station; ~145 WPM; timed to `metadata.json` or marked re-sync |
| **Capture readiness** | Process gate for **CAPTURE READY** | Walk-validation stamp fresh; human H5; `--capture` allowed |

---

## 3. Capture contract (MUST)

| Requirement | Spec |
|-------------|------|
| Base URL | `PLAYWRIGHT_BASE_URL` or `BASE_URL` → **`http://127.0.0.1:4321`** for local shipping captures (Astro `npm run dev`) |
| Auth hosts | Sign-in/up on **`accounts.aadm.io`** (or Clerk Account Portal in local/dev); member UI on **`/member`** — see CLERK-AUTH |
| Viewport | **1920×1080**, `deviceScaleFactor: 1` |
| Theme | Stable light / brand theme before first paint |
| Cursor | Visible presentation pointer; hide OS cursor during recording |
| Continuity | One browser context login → `finish()`; **MUST NOT** stitch |
| Audio | None in file; VO separate |
| MP4 | H.264, `yuv420p`, `+faststart` when converting; `--require-mp4` fails if missing |
| Profile | Default **`narrated`** (~**145 WPM** + lead/tail) |
| Secrets | **MUST NOT** log or narrate passwords, `sk_…`, `aadm_…`, `ak_…` |
| Final gate | `--capture` / `--final` **MUST** refuse without walk-validation stamp (when CLI lands) |
| Dry run | `--rehearse` / `--dry-run` **MUST NOT** enable `recordVideo` |

**CLI (target — wire when framework lands):**

```bash
npm run dev
npm run demo:validate-walks
npm run demo:record -- --list
npm run demo:record -- <name> --rehearse --profile=fast
npm run demo:record -- <name> --capture --require-mp4
```

**Artifacts** (per run): `test-results/demos/<name>-<timestamp>/`

| File | Role |
|------|------|
| `source.webm` | Raw Playwright recording (absent on rehearse) |
| `demo.mp4` | Delivery cut (no audio) |
| `metadata.json` | Scene bounds + timeline + `captureIntent` |

---

## 4. Station preservation & soft-skip

### Fill the walk, do not gut it

- **MUST** hit every value station for that tour (§7).  
- Soft-skip **MUST** be one hung/missing control, never an entire layer (e.g. do not drop the whole member area).  
- Duration **> 8 minutes** is fine. Completeness beats an arbitrary budget.  
- Gap notes **MUST NOT** be treated as permission to delete scenes.

### Soft-skip vs hard failure

| Soft-skip (allowed) | Hard failure (MUST fail the run) |
|---------------------|----------------------------------|
| Missing / disabled / hung affordance with logged soft-skip | Missing login when story requires auth |
| Short “still loading” line then continue the station | Deleted `demo.scene` for a required station |
| Optional third-party pane delayed | Silent `goto` chain that skips hubs as the happy path |
| | Secrets printed in logs / timeline / VO |
| | `--capture` without walk validation |
| | Enabling smoke-suite `video` to “also capture demos” |

### Prohibited shortcuts

- Gutting stations for duration.  
- Using recording to define, discover, or repair the walk.  
- Jumping walk statuses.  
- Stitching multiple contexts into one “final” MP4.  
- Inventing on-screen copy at record time (use hardcoded walk strings).  
- Showing create/revoke of live production API keys as a commit in a public cut — use a disposable test user / redact.  
- Sign out + password change + demote seed personas as commits in shipping demos unless the walk explicitly requires them.

---

## 5. Human approval checkpoints

| Checkpoint | When | Approves |
|------------|------|----------|
| **H1 Intent** | Entering / leaving **DRAFT** | Persona, stations, blockers |
| **H2 Spec review** | Entering **WALK DEFINED** | Scene order vs product story |
| **H3 Validation green** | Entering **WALK VALIDATED** | Contract / order QA |
| **H4 Rehearsal UX** | Evidence toward **CAPTURE READY** | Pointer, cadence, no gutting, soft-skips acceptable |
| **H5 Capture readiness** | Entering **CAPTURE READY** (before `--capture`) | All readiness kinds; FFmpeg; seed/data |
| **H6 Artifact accept** | Entering **CAPTURE VERIFIED** | Theme, stations, metadata, VO sync plan |

Agents **MAY** run validation and rehearsal and draft checklists. **H1, H4, H5, H6** **SHOULD** have a human sign-off for shipping cuts. Agents **MUST NOT** jump statuses.

---

## 6. Four verbs (always)

| Verb | Meaning |
|------|---------|
| **Reading** | Pointer on affordance; pause; no commit |
| **Clicking** | After Reading lead, click same control |
| **Typing** | After focus, type full string at narrated pace |
| **Asking** | Type into a prompt/input **and** Click submit (when the product has that pattern) |

Log: `UX <Verb> → <affordance> (beat <id>)`. Mouse **MUST NOT** teleport between beats.

---

## 7. Shipping tours (aadm-website — minimal)

Walk prep + locked scene ids: [`DEMO_WALK_SPECIFICATION.md`](./DEMO_WALK_SPECIFICATION.md).  
Click paths (beats): `playwright/demos/adapters/*-success-path.v1.ts`.  
Tour envelopes: `playwright/demos/walk-specs/`.

| Name | Value stations (must hit) | Auth | Scene ids (locked) |
|------|---------------------------|------|--------------------|
| **`standard-onboard`** (lead) | Home → `/standard` → GitHub UDALI → L1–L22 → return → Create account (**your name** / **your email**) → `/member` → **Connectors OAuth** (look only — **never** click Client ID) | Authenticated | `1-home` … `8-connectors-oauth` |
| **`marketing-home`** | Home hero → three lanes → Connect production agents → `/mcp` land | Public | `1-home-hero` … `4-mcp-land` |
| **`mcp-setup`** | MCP hero → endpoint → two ways → Bearer → OAuth → credentials CTA | Public | `1-mcp-hero` … `6-credentials-cta` |
| **`member-credentials`** | Account Portal → `/member` + Bearer how-to → API keys → Connectors OAuth → Profile → Security | Authenticated | `1-sign-in` … `6-security` |
| **`basic`** | Home smoke → unsigned `/member` gate | Public | `1-home-smoke`, `2-member-unsigned` |

**Lead tour pacing:** `standard-onboard` documents profile **`fast`**, target **~20s** (`STANDARD_ONBOARD_CAPTURE_HINTS`) — intentional exception vs default `narrated`. Soft-skip long Clerk OTP waits if needed; **MUST NOT** delete stations. Layers doc is **L1–L22** ([`udali-22-layer-model.md`](https://github.com/bwl8772/aadm-standard/blob/main/docs/udali-22-layer-model.md)).

**Blocked until ready:** any tour that needs production secrets on camera, or Clerk flows that fail local/staging — remain **DRAFT** (walk-spec `approval: "draft"` until H2).

Order QA **MUST** fail if required `sceneId`s disappear from a success-path or walkthrough.

---

## 8. Voiceover (human track)

MP4 has **no audio**. Author scripts under `playwright/demos/voiceovers/` when a tour ships.

| Rule | Spec |
|------|------|
| Rate | ~**145 WPM** (130–160 OK) |
| Timing | Sync to `metadata.json` scene `startMs` / `endMs` |
| Cadence | Speak on **stable** screens; follow cursor |
| Coverage | Entire value-station path; present tense; no secrets |
| Soft-skip VO | One short line; no long apology |

---

## 9. Definition of done

Authoritative checklists: [`DEMO_CAPTURE_DEFINITION_OF_DONE.md`](./DEMO_CAPTURE_DEFINITION_OF_DONE.md).

### CAPTURE VERIFIED (summary)

1. Status path honored; walk was **WALK VALIDATED** and **CAPTURE READY** before `--capture`.  
2. Every required value station (§7) hit.  
3. Checklist verbs ran (or soft-skipped with log).  
4. `metadata.json`: `ok: true`, `captureIntent: "final"`, scene bounds.  
5. `demo.mp4` exists when `--require-mp4`.  
6. Artifact + UX verification (H6) complete.  
7. Voiceover exists or explicitly deferred.  
8. Duration may exceed 8 minutes — **not** a defect.  
9. Video was **not** used to define, discover, or repair the walk.

---

## 10. Agent / PR checklist

Before merging walk changes / shipping MP4:

- [ ] Did **not** remove a value station to shorten runtime  
- [ ] Soft-skips per-control; debt noted if product  
- [ ] `npm run demo:validate-walks` passes (when present)  
- [ ] Did **not** use recording to define/discover/repair the walk  
- [ ] Did **not** enable smoke-suite video for demos  
- [ ] Shipping cut: DoD READY TO CAPTURE then `--capture --require-mp4`  
- [ ] No secrets in artifacts / VO  

---

## 11. Layering

```text
playwright/demos/framework/     presentation runtime (product-agnostic) — when added
playwright/demos/adapters/      login, locators, soft-skips (Astro + Clerk)
playwright/demos/walkthroughs/  product stories (aadm.io tours)
playwright/demos/examples/      public smoke (basic)
playwright/demos/voiceovers/    human VO scripts
playwright/demos/run-demo.ts    CLI + lifecycle flags
scripts/*-smoke.mjs             regression smokes — NOT the narrated recorder
```

---

## 12. Related

| Doc | Role |
|-----|------|
| [`DEMO_WALK_SPECIFICATION.md`](./DEMO_WALK_SPECIFICATION.md) | Walk prep; station + click-path ownership |
| [`DEMO_CAPTURE_DEFINITION_OF_DONE.md`](./DEMO_CAPTURE_DEFINITION_OF_DONE.md) | Roles, checklists, troubleshooting |
| [`../playwright/demos/README.md`](../playwright/demos/README.md) | Portable how-to |
| [`../playwright/demos/adapters/`](../playwright/demos/adapters/) | Success-path click beats |
| [`CLERK-AUTH.md`](./CLERK-AUTH.md) | Login / member / CNAME — **not** redefined here |
| [`../AGENTS.md`](../AGENTS.md) | Agent auth constraints |
