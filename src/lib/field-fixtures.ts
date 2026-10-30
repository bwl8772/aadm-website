/**
 * Example-data loader for Field. Fixtures are found by glob, so deleting
 * `src/components/field/fixtures/` strips every example with no code change.
 * A fixture's default export is either a value or a function of the page's
 * query (the stand-in for what the backend would do with `?agent=`,
 * `?artifact=`, `?filter=`). Returns `unknown`: callers parse it with the
 * screen's schema (RES-05).
 */
const modules = import.meta.glob<{ default: unknown }>(
	"../components/field/fixtures/*.fixture.ts",
	{
		eager: true,
	},
);

export function fieldFixture(
	name: string,
	query: Record<string, string> = {},
): unknown {
	if (import.meta.env.PUBLIC_FIELD_FIXTURES !== "1") return null;
	const fixture =
		modules[`../components/field/fixtures/${name}.fixture.ts`]?.default ?? null;
	return typeof fixture === "function" ? fixture(query) : fixture;
}

/** The page's search params as a plain record for `fieldFixture`. */
export function queryRecord(url: URL): Record<string, string> {
	return Object.fromEntries(url.searchParams.entries());
}
