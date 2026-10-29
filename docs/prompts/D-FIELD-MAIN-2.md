**APP: AADM (aadm-website)**
# D-FIELD-MAIN-2 · Field home mock, redone around plan work (design only; dev branch; replaces the rejected mock)
Use the frontend design skill. Repo aadm-website, branch `dev`. You write only `.tmp/field-main-mock.html` (overwrite; one self-contained file, inline CSS, no external requests) and screenshots in `.tmp/`. No commit, no staging, nothing touched outside `.tmp/`.
**Why:** Brian rejected the last mock ("do forward deployed engineers even do these things?? monitor infrastructure???"). An FDE plans and delivers for a customer. This page is where they do that plan work, one click from home. Spec: `ux-field-post-login.md` v0.3 and PRD v0.13.7 D41 (Blueprint files; summarized here).
**Words, in AADM's meaning (put none of the banned things on the page):**
- Five phases, a loop: Strategy, Plan, Readiness, Adopt, Governance. **Health** = a phase's open items and drift.
- **Readiness** = the customer's organizational and data readiness to adopt (data quality and trust, relevance, access, governance). It is never infrastructure.
- **Delivery status** (Plan phase): **On plan**, **Drifting** (an open DRIFT verdict or an unprocessed replan) or **Blocked** (a gate refuses the next plan step; name the reason). It is judged only against the delivery map and its verdicts.
- **BANNED anywhere:** server health, regions, uptime, latency, sample bands, infrastructure status, "Healthy"/"Needs attention" chips.
**Confirm first (read-only; report each as CONFIRMED or DIFFERENT before you design):**
1. `src/styles/theme.css`: dark is the default (`html.dark`), light overrides the same names (read Oct 25 at `31f6af6`).
2. `src/components/SiteHeader.astro` uses square corners (`rounded-none`) (read Oct 25 at `31f6af6`).
3. `src/components/MemberNavTabs.astro` has 4 tabs: API keys, Connectors OAuth, Profile, Security (read Oct 25 at `31f6af6`).
4. `src/pages/field/main.astro` renders inside `Layout.astro`, not `MemberShell` (read Oct 25 at `31f6af6`).
**Style:** only `theme.css` tokens (copy the values you use into the file's `:root`/`.dark`, citing the token name); dark by default with a light toggle; square corners as in SiteHeader; one primary button per state.
**Layout: a workspace page, not a settings tab.** Header: "AADM Field", a plan badge, and a user menu (open in one state) holding API keys, Connectors OAuth, Profile, Security, Plan, Sign out. No member tab strip.
**Zones, top to bottom:**
1. **Continue**: "Northwind Claims · Stage 2 of 5 · Build", "Slice 'Load claim history': prompt ready", button **Continue** (opens that slice and its prompt).
2. **Waiting on you**, across engagements: "Coder report on 'Map adjuster codes' waiting for a verdict (ON PLAN or DRIFT)"; "Slice 'Validate policy numbers' is ready for Go"; "Write the prompt for 'Export to ledger'"; "Cornerstone: 3 open questions"; "Chunking: 1 slice too big (slice_issues)".
3. **Waiting on the customer**: "Cornerstone v2 sign-off: Dana Ruiz (decision owner), since Oct 21"; "eval_owner co-sign: Sam Okafor"; "Use case approval: Contoso Billing"; "Access ACC-4 (read, claims data): requested Oct 20".
4. **Your engagements**, one row each with: name and customer; your role; where it is in the plan; the next plan work; the delivery status with its reason; and one quiet line of open-item counts for the five phases.
   - Northwind Claims: Stage 2 of 5 · Build; On plan.
   - Contoso Billing: Plan · Chunk and slice, mid-slicing: "2 of 4 stages sliced"; Blocked ("1 blocking CS- finding").
   - Fabrikam Intake: Stage 4 of 5 · Pilot; Drifting ("DRIFT on 'Route referrals'").
   - Tailspin Onboarding: Cornerstone · C4 Challenge; Blocked ("eval_owner co-sign missing").
   Delivery map stage names come from each map, e.g. Discovery, Requirements, Build, Pilot, Go-live.
5. One-time card "Connect your AI coder", with Set up connection and Dismiss.
**States (one labeled section each, stacked):**
- Active (the above); Waiting-on-you empty ("Nothing is waiting on you."); No engagement yet (one **Start an engagement**).
- Code-only offer ("AADM Field is a separate plan" · "Plan customer engagements end to end: Cornerstone requirements, delivery maps, slices and prompts for your AI coder, and customer sign-offs." · **Add AADM Field**); Free ("Choose a plan to start" · **See plans**).
- Lost access ("Your engagements are kept and can be exported." + offer); Backend down ("We can't load your engagements right now." · **Try again**); Syncing ("Finishing authentication…").
**Screenshots:** `.tmp/field-main-1280-light.png`, `.tmp/field-main-375-dark.png` and `.tmp/field-main-375-light.png`, full page, with headless Playwright or the repo's existing browser tooling. Install nothing new; if no tool exists, stop and ask.
**Rules (verbatim):**
- VL-4 "If the dev server shows a stale or cached error, stop and ask Brian; never edit config files or nudge containers to force a reload."
- VL-6 "Other coder sessions may be open on this repo; that's fine. Touch and stage only your named files and ignore changes to other files; stop only if one of your named files changes and you didn't change it."
**Stop and report:**
- the 4 confirm-first results;
- the files written, with byte sizes;
- the 3 screenshot paths;
- a grep of the HTML for region|uptime|latency|server health|Healthy, which must show 0 hits;
- anything you couldn't do.
Then stop. Do not commit or stage.
