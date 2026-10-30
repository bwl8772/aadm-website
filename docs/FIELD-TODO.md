# Field: loose ends and code smells

Oct 30, 2026. Working list for the Field web shell (`src/components/field/`, `src/pages/field/main/`). Delete each line when it is done.

## Loose ends

### Decisions and docs
- [ ] Commit the uncommitted docs: `PRD-aadm-delivery-maps.md` (v0.20), `contracts/FIELD-MY-FIELD.md`, `contracts/FIELD-WORKSPACE.md`.
- [ ] The PRD copy on the Desktop is v0.16; the repo copy (v0.20) is current. Retire or refresh the Desktop copy.
- [ ] `FIELD-CONTRACTS.md` §11 read models (`getFieldHome` with `critical_path`, `waiting_on_you`, `customer_commitments`) no longer match `MyFieldView`. Update or mark superseded by `contracts/`.
- [ ] `FIELD-VISION.md` points at `.tmp/field-*-mock.html`; the real mock sources are the Desktop PNGs and zips. Fix the pointer.
- [ ] Migrations safe to re-run: add to F1-a1's done-check (one transaction per file, `IF NOT EXISTS`, refuse an edited file, run twice gives the same schema). None exist yet in either repo. `npm run check` already runs `scripts/migration-guard.mjs`, which fails a migration that bumps a version counter without a content guard; it also needs to run in aadm-mcp, where the migrations will live.
- [ ] PRD §20 v0.20 items: Clerk org ↔ workspace, model key per engagement or workspace, Slack channel for a multi-workspace engagement, restating TEN-06 and ARCH-01 in aadm-mcp.

### Contracts not yet in code
- [ ] Workbench schemas and fixture to `FIELD-WORKBENCH.md`: separate stream read, typed entries, the shared Action shape, all five lenses with links, `panels`, `uploads`.
- [ ] Studio schemas and fixture to `FIELD-STUDIO.md`: typed blocks with `fallback_text`, `content_hash`, `versions`, `header_actions`, flat `share_options`, map `nodes` and `edges`.
- [ ] Workspace screen: schema, fixture, `src/pages/field/main/w/[workspaceId].astro`, switcher in the header.
- [ ] Commands: one client helper that sends the PRD §A7 envelope to `POST /api/v1/commands`; wire `ActionControl` to it. Nudge, Capture and every command button are no-ops today.
- [ ] Live updates: subscribe to `view.invalidated` and re-read.
- [ ] Pagination: `actions.next_cursor` is ignored.
- [ ] States: Loading skeleton, Forbidden, Stale, and problem-format errors (`code`, `title`, `detail`). The Unavailable text is written by the client today.
- [ ] Uploads and Capture: `POST /api/v1/uploads`, then `capture.create`.

### Verification
- [ ] A signed-in visual check of all three screens has never been done. Needs `MEMBER_SMOKE_STORAGE_STATE` for the smoke's signed-in half.
- [ ] Review My Field against FLD-02: the summary counts, filter counts, "Blocked" pills and lens chips must sit below the action, never lead.

## Code smells

### Actions written in the client, not sent by the server
The contracts say the client shows only actions the server sent. These buttons are hard-coded and do nothing:
- [ ] `FieldHeader.tsx:65` Capture (gated by `captureAvailable`, but not an Action).
- [ ] `workbench/EngagementWorkbench.tsx:40-42` Brief, Open in Claude, Share in Slack → `client_links` Actions.
- [ ] `studio/ArtifactStudio.tsx:38` Open in Claude.
- [ ] `studio/BuiltView.tsx:29-30` Edit, Save version → `header_actions`.
- [ ] `studio/BuiltView.tsx:33` Share menu items are `<button>`s with no action; should render `share_options`.
- [ ] `studio/CollectionsRail.tsx:83` Edit → shown only when `can_edit_layout`.
- [ ] `workbench/InventoryList.tsx:19` Import file → an Action from `land`.
- [ ] `workbench/DraftCard.tsx:82` Edit draft → the draft's own actions.

### Content written in the client
- [ ] `workbench/DraftCard.tsx:44-74` "Not saved yet" and the section headings (Confirmed findings, Assumptions, Unresolved questions, Decision needed) decide what a draft means; the contract sends sections with headings.
- [ ] `studio/MapView.tsx:30-45` "Built from", "This artifact", "Produces" assume three fixed columns; the contract sends nodes by role and relation labels.
- [ ] `home/EngagementCard.tsx:50` "Lay of the land" label for `land_label`. Inventories are not in the PRD yet.

Fixed chrome (table column headings in `home/ActionsPanel.tsx`, "Agents", "Collections", "Pinned", "Connected", "Thinking", screen-reader labels) is fine.

### React keys from labels, not ids
Duplicate labels will collide and labels can change. Use server ids:
- [ ] `ScreenHeader.tsx:32`, `home/EngagementCard.tsx:40`, `home/ContinueCard.tsx:20`, `studio/MapView.tsx:33,48`, `studio/BuiltView.tsx:23,47,52,71,76`, `workbench/AgentRail.tsx:26`.

### Other
- [ ] `ActionControl` renders commands as disabled-looking no-ops with no feedback; after wiring, show pending and the server's error.
- [ ] `studio/BuiltView.tsx:69` renders every artifact in a monospace block; blocks should choose their own component per `kind`.
