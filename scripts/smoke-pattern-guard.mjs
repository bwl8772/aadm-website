/**
 * Fails if a smoke script re-implements the Clerk hand-off check or gates on copy.
 * The only allowed hand-off check is scripts/lib/auth-gate.mjs.
 * Run: node scripts/smoke-pattern-guard.mjs
 */
import { readdirSync, readFileSync } from "node:fs";

const banned = [
	{ re: /locator\(\s*["']\[data-sync-sign-in\]["']\s*\)\s*\.getAttribute/, why: "unguarded sync-shell read hangs on a 302 — use lib/auth-gate.mjs" },
	{ re: /h1:text-is\(/, why: "gating on heading copy breaks on copy edits — use [data-field-screen]" },
];

const dir = new URL("./", import.meta.url);
const bad = [];
for (const f of readdirSync(dir).filter((n) => n.endsWith(".mjs") && n !== "smoke-pattern-guard.mjs")) {
	readFileSync(new URL(f, dir), "utf8")
		.split("\n")
		.forEach((line, i) => {
			for (const b of banned) if (b.re.test(line)) bad.push(`${f}:${i + 1} ${b.why}`);
		});
}
if (bad.length) {
	console.error(`smoke-pattern-guard FAILED\n${bad.join("\n")}`);
	process.exit(1);
}
console.log("smoke-pattern-guard OK");
