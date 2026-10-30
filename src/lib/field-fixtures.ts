/**
 * Example-data loader for Field. Fixtures are found by glob, so deleting
 * `src/components/field/fixtures/` strips every example with no code change.
 * Returns `unknown`: callers parse it with the screen's schema (RES-05).
 */
const modules = import.meta.glob<{ default: unknown }>("../components/field/fixtures/*.fixture.ts", {
	eager: true,
});

export function fieldFixture(name: string): unknown {
	if (import.meta.env.PUBLIC_FIELD_FIXTURES !== "1") return null;
	return modules[`../components/field/fixtures/${name}.fixture.ts`]?.default ?? null;
}
