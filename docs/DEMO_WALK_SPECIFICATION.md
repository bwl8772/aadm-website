# Demo walk specification (aadm-website)

**Status:** Walk preparation standard for narrated demos on this Astro site.  
**Normative capture / status machine:** [`PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md`](./PLAYWRIGHT_NARRATED_DEMO_CAPTURE_SPEC_V2.md)  
**DoD:** [`DEMO_CAPTURE_DEFINITION_OF_DONE.md`](./DEMO_CAPTURE_DEFINITION_OF_DONE.md)  
**Machine path contracts:** [`../playwright/demos/adapters/`](../playwright/demos/adapters/)  
**Tour envelopes:** [`../playwright/demos/walk-specs/`](../playwright/demos/walk-specs/)

A **Demo Walk Spec** is the measurable customer path: ordered **value stations**, per-station **click path** (Reading → Clicking / Typing / Asking), and public vs authenticated start.

---

## What “value station” means

A **value station** is a viewer-clear product moment the shipping cut **MUST** hit — not a locator, not a duration target.

| Tour owns | Station owns |
|-----------|--------------|
| Audience outcome | Scene id (locked for order QA) |
| Full ordered station list | Path / URL or portal host |
| Public vs auth | Intent (what the viewer should believe) |
| Soft-skip policy | Ordered beats (verb + affordance + locator hint) |

**MUST NOT** delete a station to shorten runtime. Soft-skip one hung control inside a station; keep the station.

---

## Artifact layout

| Artifact | Role |
|----------|------|
| `playwright/demos/walk-specs/<tour>.walk-spec.v1.ts` | Tour envelope: outcome, auth mode, ordered `sceneId`s |
| `playwright/demos/adapters/<tour>-success-path.v1.ts` | Click path: stations → beats → affordances |
| `playwright/demos/walkthroughs/<tour>.demo.ts` | Executable story (when runtime exists) — one `scene` per station |

Status **WALK DEFINED** requires walk-spec + success-path aligned. **WALK VALIDATED** requires order QA against the locked `sceneId` list.

---

## Auth boundary (this site)

| Mode | Start | Notes |
|------|-------|--------|
| **Public-page** | Astro route on `aadm.io` (local `:4321`) | No Account Portal |
| **Authenticated** | Clerk Account Portal (`accounts.aadm.io` / portal URLs) → `/member` | See [`CLERK-AUTH.md`](./CLERK-AUTH.md) |

**MUST NOT** invent a marketing-host SignIn page. **MUST NOT** show raw `aadm_…` / `ak_…` / passwords in VO or timeline.

---

## Shipping tours (station ids locked)

| Tour | Success path | Walk spec |
|------|--------------|-----------|
| `standard-onboard` (lead) | [`standard-onboard-success-path.v1.ts`](../playwright/demos/adapters/standard-onboard-success-path.v1.ts) | [`standard-onboard.walk-spec.v1.ts`](../playwright/demos/walk-specs/standard-onboard.walk-spec.v1.ts) |
| `marketing-home` | [`marketing-home-success-path.v1.ts`](../playwright/demos/adapters/marketing-home-success-path.v1.ts) | [`marketing-home.walk-spec.v1.ts`](../playwright/demos/walk-specs/marketing-home.walk-spec.v1.ts) |
| `mcp-setup` | [`mcp-setup-success-path.v1.ts`](../playwright/demos/adapters/mcp-setup-success-path.v1.ts) | [`mcp-setup.walk-spec.v1.ts`](../playwright/demos/walk-specs/mcp-setup.walk-spec.v1.ts) |
| `member-credentials` | [`member-credentials-success-path.v1.ts`](../playwright/demos/adapters/member-credentials-success-path.v1.ts) | [`member-credentials.walk-spec.v1.ts`](../playwright/demos/walk-specs/member-credentials.walk-spec.v1.ts) |
| `basic` | [`basic-success-path.v1.ts`](../playwright/demos/adapters/basic-success-path.v1.ts) | [`basic.walk-spec.v1.ts`](../playwright/demos/walk-specs/basic.walk-spec.v1.ts) |

Catalog index: [`../playwright/demos/walk-specs/index.ts`](../playwright/demos/walk-specs/index.ts).
