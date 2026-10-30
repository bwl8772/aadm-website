/**
 * Field contract tests (PRD §A7 "a reply-shape fixture fails loudly on
 * drift"; RES-05). Every fixture must parse with its screen's schema for every
 * query the fixture answers, and the schemas must reject what the contracts
 * forbid. Runs on Node's test runner with type stripping — no bundler.
 *
 * Run: npm run test:field-contracts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
	ActionSchema,
	BlockSchema,
	CommandRequestSchema,
	MyFieldViewSchema,
	StreamEntrySchema,
	StreamSchema,
	StudioViewSchema,
	WorkbenchViewSchema,
	WorkspaceViewSchema,
} from "../src/components/field/field-types.ts";
import myField from "../src/components/field/fixtures/my-field.fixture.ts";
import studio from "../src/components/field/fixtures/studio.fixture.ts";
import workbench from "../src/components/field/fixtures/workbench.fixture.ts";
import workspace from "../src/components/field/fixtures/workspace.fixture.ts";

const ENGAGEMENT = "6f278bf1-408e-5452-a2bc-0ea4bf42c816";

function mustParse(schema, value, label) {
	const r = schema.safeParse(value);
	assert.ok(
		r.success,
		`${label} drifted from its contract:\n${r.success ? "" : JSON.stringify(r.error.issues.slice(0, 5), null, 2)}`,
	);
	return r.data;
}

test("My Field: every recorded filter view parses", () => {
	for (const [filter, view] of Object.entries(myField)) {
		mustParse(MyFieldViewSchema, view, `my-field[${filter}]`);
	}
});

test("Workbench: view and stream parse for every agent, panel and filter", () => {
	const queries = [
		{},
		{ agent: "technical-discovery" },
		{ agent: "cornerstone", panel: "artifacts", filter: "customer_visible" },
		{ agent: "no-such-agent", panel: "nope", filter: "nope" },
	];
	for (const q of queries) {
		const r = workbench(q)[ENGAGEMENT];
		assert.ok(r, "fixture answers for the engagement");
		const view = mustParse(
			WorkbenchViewSchema,
			r.view,
			`workbench view ${JSON.stringify(q)}`,
		);
		const stream = mustParse(
			StreamSchema,
			r.stream,
			`workbench stream ${JSON.stringify(q)}`,
		);
		assert.equal(
			stream.agent_id,
			view.canvas.agent_id,
			"stream is the selected agent's",
		);
		const selected = view.agent_groups
			.flatMap((g) => g.agents)
			.filter((a) => a.selected);
		assert.equal(selected.length, 1, "exactly one agent is selected");
		assert.equal(selected[0].agent_id, view.canvas.agent_id);
		assert.equal(view.artifacts.filters.filter((f) => f.selected).length, 1);
	}
	const filtered = workbench({
		panel: "artifacts",
		filter: "customer_visible",
	})[ENGAGEMENT].view;
	assert.ok(
		filtered.artifacts.items.every(
			(a) => a.visibility.id === "customer_visible",
		),
		"filter is a new read",
	);
});

test("Stream: an unknown entry type is kept as a labelled line, never dropped", () => {
	const { stream } = workbench({})[ENGAGEMENT];
	const parsed = mustParse(StreamSchema, stream, "stream");
	const unknown = parsed.entries.find((e) => e.type === "handoff");
	assert.ok(unknown && "label" in unknown, "unknown entry keeps its label");
	assert.ok(
		!StreamEntrySchema.safeParse({ entry_id: "x", type: "handoff", label: "y" })
			.success,
		"an unknown entry still needs the shared base fields",
	);
});

test("Studio: view parses for each center view and for an unknown artifact", () => {
	for (const q of [
		{},
		{ view: "stream" },
		{ view: "map" },
		{ artifact: "00000000-0000-5000-8000-000000000000" },
	]) {
		const view = mustParse(
			StudioViewSchema,
			studio(q)[ENGAGEMENT],
			`studio ${JSON.stringify(q)}`,
		);
		if (view.open_artifact_id === null) {
			assert.equal(view.state, "no_artifact_open");
			assert.ok(view.empty_state, "server sends the empty state");
			assert.equal(view.built, null);
		} else {
			assert.ok(view.built, "built version is present");
			assert.ok(view.built.content_hash, "content hash is on screen");
			assert.ok(
				view.built.versions.some((v) => v.version === view.built.version),
			);
			assert.equal(
				view.outputs.filter((o) => o.artifact_id === view.open_artifact_id)
					.length,
				1,
			);
		}
	}
});

test("Blocks: an unknown kind renders from fallback_text; a known kind must be complete", () => {
	const view = studio({})[ENGAGEMENT];
	const unknown = view.built.blocks.find(
		(b) => b.kind === "evidence_checklist",
	);
	assert.ok(
		unknown?.fallback_text,
		"fixture carries an unknown block kind with fallback text",
	);
	assert.ok(BlockSchema.safeParse(unknown).success);
	assert.ok(
		!BlockSchema.safeParse({
			block_id: unknown.block_id,
			kind: "list",
			items: ["a"],
		}).success,
		"a list without `ordered` is rejected",
	);
	assert.ok(
		!BlockSchema.safeParse({ block_id: unknown.block_id, kind: "mystery" })
			.success,
		"unknown kind without fallback_text is rejected",
	);
});

test("Workspace: both workspaces parse for every filter; one switcher entry is current", () => {
	for (const filter of ["all", "needs_me", "waiting_customer", "nope"]) {
		for (const [id, view] of Object.entries(workspace({ filter }))) {
			const v = mustParse(
				WorkspaceViewSchema,
				view,
				`workspace ${id} filter=${filter}`,
			);
			assert.equal(v.switcher.filter((w) => w.current).length, 1);
			assert.equal(v.filters.filter((f) => f.selected).length, 1);
			assert.ok(
				v.engagements.items.every((r) => r.next.title),
				"every row leads with its next item",
			);
		}
	}
});

test("Action: navigate needs href, command needs command", () => {
	const base = { label: "x", enabled: true, emphasis: "primary" };
	assert.ok(!ActionSchema.safeParse({ ...base, kind: "navigate" }).success);
	assert.ok(!ActionSchema.safeParse({ ...base, kind: "command" }).success);
	assert.ok(
		ActionSchema.safeParse({
			...base,
			kind: "command",
			command: "draft.save",
			target: "d",
			expected_version: 2,
		}).success,
	);
});

test("CommandRequest: the browser's post needs a UUID idempotency key and a command", () => {
	assert.ok(
		!CommandRequestSchema.safeParse({
			command: "draft.save",
			idempotency_key: "click-1",
		}).success,
	);
	assert.ok(
		CommandRequestSchema.safeParse({
			command: "draft.save",
			idempotency_key: "00000000-0000-4000-8000-000000000000",
			target: { kind: "draft", id: "d", expected_version: 2 },
		}).success,
	);
});
