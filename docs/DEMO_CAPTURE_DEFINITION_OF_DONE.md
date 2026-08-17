# Demo capture — definition of done (aadm-website)

**Status:** Operational companion to capture V2 — roles, lifecycle, checklists, troubleshooting.  
**Normative MUST/SHOULD:** [`PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md`](./PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md) (this file **MUST NOT** invent conflicting rules).  
**Walk preparation:** [`DEMO_WALK_SPECIFICATION.md`](./DEMO_WALK_SPECIFICATION.md).  
**How to run:** [`../playwright/demos/README.md`](../playwright/demos/README.md).  
**Auth / hosts:** [`CLERK-AUTH.md`](./CLERK-AUTH.md).

---

## Lifecycle

```text
DEMO INTENT
    ↓
WALK SPEC
    ↓
HUMAN UX REVIEW
    ↓
VALIDATE-WALK
    ↓
REHEARSE
    ↓
CAPTURE READINESS GATE
    ↓
ONE CONTINUOUS CAPTURE
    ↓
ARTIFACT + UX REVIEW
    ↓
APPROVED DEMO
```

| Step | Status (V2) | Primary artifact |
|------|-------------|------------------|
| DEMO INTENT | **DRAFT** | Persona, stations, blockers |
| WALK SPEC | **WALK DEFINED** | Walk note / `*.walk-spec.v1.ts` + path helpers |
| HUMAN UX REVIEW | still DEFINED | Affordances, transitions, cursor story |
| VALIDATE-WALK | **WALK VALIDATED** | `demo:validate-walks` stamp + `--validate-walk` |
| REHEARSE | evidence toward READY | `--rehearse` (no shipping MP4) |
| CAPTURE READINESS GATE | **CAPTURE READY** | Readiness report `CAPTURE READY: YES` |
| ONE CONTINUOUS CAPTURE | activity | `--capture --require-mp4` |
| ARTIFACT + UX REVIEW | → **CAPTURE VERIFIED** | MP4 + metadata + H6 |
| APPROVED DEMO | **CAPTURE VERIFIED** | Shipping cut accepted |

**MUST NOT** jump statuses. Video **MUST NOT** define or repair the walk.

---

## Roles / ownership

| Role | Owns | Does not own |
|------|------|--------------|
| **Product / demo owner** | Persona, customer story, stations, outcomes, experience approval | Locators, FFmpeg, pointer timing |
| **UX reviewer** | Affordance clarity, transitions, cursor orientation | Clerk infra fixes, encoding |
| **Engineering** | Deterministic state, adapters, locators, Astro/Clerk readiness | Redefining customer outcome in code without walk intent |
| **Demo runtime** | Timing, pointer, capture, metadata, encoding | Product nouns in `framework/` |
| **Validator** | Structural gates, rehearsal evidence, final artifact verification | Approving product story content |

Human checkpoints H1–H6: capture V2 §5.

---

## DO NOT RECORD YET

Stop before `--capture` / `--final` if **any** apply:

- [ ] No walk intent / stations written (still **DRAFT**)  
- [ ] Status below **WALK VALIDATED** / validation stamp missing or stale  
- [ ] `--validate-walk` failed structure/env  
- [ ] No successful `--rehearse` with affordance rehearsal PASS  
- [ ] Readiness report shows `CAPTURE READY: NO`  
- [ ] Blocking gaps &gt; 0 (or soft-skips undocumented)  
- [ ] Required value stations missing from walkthrough  
- [ ] Deterministic state / Clerk credentials / test user not ready  
- [ ] Astro not up at `http://127.0.0.1:4321` (or documented staging URL)  
- [ ] Using recording to “see what’s broken” (that is rehearsal or product fix — not capture)  
- [ ] Plan to show live production API keys / dashboard tokens on camera without redaction  

---

## READY TO CAPTURE

Proceed to `--capture --require-mp4` only when **all** apply:

- [ ] Walk approved (identity + full station path for the tour)  
- [ ] Human UX review done (viewer-clear story — not only “clicks worked”)  
- [ ] `npm run demo:validate-walks` green (when present)  
- [ ] `npm run demo:record -- <name> --validate-walk` PASS where required  
- [ ] `npm run demo:record -- <name> --rehearse --profile=fast` completed; report acceptable  
- [ ] Capture readiness summary shows **CAPTURE READY: YES**  
- [ ] Soft skips accepted and logged; blocking gaps = 0  
- [ ] FFmpeg available if `--require-mp4`  
- [ ] Target base URL is local Astro `:4321` or approved staging (not an accidental wrong host)  
- [ ] Profile for final cut is **`narrated`** unless documented exception  
- [ ] VO stub exists or explicitly deferred  
- [ ] Auth tour: Account Portal + `/member` path matches [`CLERK-AUTH.md`](./CLERK-AUTH.md)  

---

## Verify final MP4 (CAPTURE VERIFIED)

- [ ] `metadata.json`: `ok: true`, `captureIntent: "final"`, scene bounds present  
- [ ] `demo.mp4` exists; H.264 / stable theme / 1920×1080 / no audio  
- [ ] Spot-check: pointer visible, stations present, no secret leakage in logs/timeline  
- [ ] Soft-skips from the run noted if product debt  
- [ ] Voiceover re-synced or deferred  
- [ ] Duration &gt; 8 min is **not** a defect  
- [ ] Member tour: left tabs still API keys → Connectors OAuth → Profile → Security (Bearer how-to is above the profile, not a fifth tab)  

---

## Soft-skip vs gutting (pointer)

- Broken **optional** control → soft-skip + note; **keep the station**.  
- Known product UX gap → film around it; **MUST NOT** silently remove stations (capture V2 I11).  
- Clerk / member layout regressions → fix product or adapters — do not gut the credentials story.

---

## Troubleshooting decision tree

```text
Something failed during validate / rehearse / capture
│
├─ Affordance missing, disabled, hung, or wrong product behavior on a real screen?
│     → PRODUCT BUG (or known gap) → fix product or soft-skip + note
│        MUST NOT delete the station to “make the demo green”
│
├─ Spec station order / verbs disagree with intended story?
│     → WALK-SPEC DEFECT → edit walk stations; regress status
│
├─ Clerk env, test user, redirect, or start/end world wrong?
│     → DEMO-STATE DEFECT → fix .env / test account / portal URLs (see CLERK-AUTH)
│
├─ Locator wrong, login helper wrong, soft-skip never logged, goto fallback silent?
│     → LOCATOR / ADAPTER DEFECT → fix adapters/; keep framework product-agnostic
│
├─ Pointer idle, timing, theme, continuity, recordVideo, status gate, CLI mode?
│     → RUNTIME / CAPTURE DEFECT → framework / run-demo / capture-gates
│
└─ source.webm OK but no demo.mp4, bad codec, --require-mp4 fail?
      → FFMPEG / ARTIFACT DEFECT → install/fix FFmpeg; re-encode only — do not re-author the walk
```

**Confusion trap:** green rehearsal clicks ≠ viewer-clear story → UX review / walk stations, not “capture harder.”

**Not this recorder:** `npm run test:clerk-smoke` / `test:mobile-nav` failures → fix smoke scripts or product; do not conflate with narrated capture gates.

---

## Commands (summary)

```bash
npm run dev
npm run demo:validate-walks
npm run demo:record -- <name> --validate-walk
npm run demo:record -- <name> --rehearse --profile=fast
npm run demo:record -- <name> --capture --require-mp4
```

Auth policy and hosts: CLERK-AUTH. Portable API: demos README.
