/**
 * Guard: pale Tailwind accent text on light theme (light-on-light).
 *
 * Dark-first utilities like `text-amber-200/90` and `text-emerald-200/80` are
 * designed for dark surfaces. On light paper they fail contrast (~washed out).
 * Prefer semantic tokens: text-brand-warn | text-brand-mcp | text-brand-violet | text-brand-sky.
 *
 * Usage:
 *   node scripts/theme-light-contrast-guard.mjs           # report + exit 1 if hits
 *   node scripts/theme-light-contrast-guard.mjs --fix    # rewrite to brand tokens
 *   node scripts/theme-light-contrast-guard.mjs --warn     # report only, exit 0
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src");

const args = new Set(process.argv.slice(2));
const doFix = args.has("--fix");
const warnOnly = args.has("--warn");

/** Families that read as washed-out pastels on light paper (200/300 band especially). */
const FAMILY_TO_BRAND = {
	amber: "brand-warn",
	yellow: "brand-warn",
	orange: "brand-warn",
	emerald: "brand-mcp",
	lime: "brand-mcp",
	green: "brand-mcp",
	violet: "brand-violet",
	purple: "brand-violet",
	fuchsia: "brand-violet",
	sky: "brand-sky",
	cyan: "brand-sky",
	blue: "brand-sky",
};

const PALE_STEPS = "50|100|200|300";

/**
 * Match text / hover:text / group-hover:text pale accents, including opacity
 * modifiers like /80 or /[0.18].
 */
const TEXT_CLASS_RE = new RegExp(
	String.raw`((?:group-)?(?:hover:)?)text-(${Object.keys(FAMILY_TO_BRAND).join("|")})-(${PALE_STEPS})(?:\/(?:\[[^\]]+\]|\d+(?:\.\d+)?))?`,
	"g",
);

const BORDER_CLASS_RE = new RegExp(
	String.raw`((?:group-)?(?:hover:)?)border-(${Object.keys(FAMILY_TO_BRAND).join("|")})-(${PALE_STEPS})(?:\/(?:\[[^\]]+\]|\d+(?:\.\d+)?))?`,
	"g",
);

const DECORATION_CLASS_RE = new RegExp(
	String.raw`((?:group-)?(?:hover:)?)decoration-(${Object.keys(FAMILY_TO_BRAND).join("|")})-(${PALE_STEPS})(?:\/(?:\[[^\]]+\]|\d+(?:\.\d+)?))?`,
	"g",
);

/** Files scanned. */
const EXT = new Set([".astro", ".css", ".ts", ".tsx", ".js", ".mjs"]);

/** Skip generated / vendor noise. */
function shouldSkip(rel) {
	return (
		rel.includes("node_modules/") ||
		rel.includes("dist/") ||
		rel.endsWith("theme-compat.css") // remaps are intentional
	);
}

function walk(dir, out = []) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const abs = path.join(dir, ent.name);
		const rel = path.relative(root, abs).split(path.sep).join("/");
		if (ent.isDirectory()) {
			if (ent.name === "node_modules" || ent.name === "dist") continue;
			walk(abs, out);
		} else if (EXT.has(path.extname(ent.name)) && !shouldSkip(rel)) {
			out.push(abs);
		}
	}
	return out;
}

function brandFor(family, kind) {
	const base = FAMILY_TO_BRAND[family];
	if (kind === "text" || kind === "decoration") return base;
	if (kind === "border") {
		if (base === "brand-warn") return "brand-warn-border";
		if (base === "brand-mcp") return "brand-mcp-border";
		return base; // violet/sky borders use color token + opacity elsewhere
	}
	return base;
}

/**
 * @returns {{ line: number, col: number, match: string, suggestion: string, kind: string }[]}
 */
function findInText(text) {
	const findings = [];
	const lines = text.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		// Skip pure documentation / comment lines (avoid flagging the guard docs themselves).
		const trimmed = line.trim();
		if (
			trimmed.startsWith("*") ||
			trimmed.startsWith("/*") ||
			trimmed.startsWith("//") ||
			trimmed.startsWith("<!--")
		) {
			continue;
		}
		for (const [re, kind] of [
			[TEXT_CLASS_RE, "text"],
			[BORDER_CLASS_RE, "border"],
			[DECORATION_CLASS_RE, "decoration"],
		]) {
			re.lastIndex = 0;
			let m;
			while ((m = re.exec(line)) !== null) {
				const prefix = m[1] || "";
				const family = m[2];
				const brand = brandFor(family, kind);
				let suggestion;
				if (kind === "text") suggestion = `${prefix}text-${brand}`;
				else if (kind === "border") {
					suggestion =
						brand.includes("-border") || brand === "brand-violet" || brand === "brand-sky"
							? brand.includes("-border")
								? `${prefix}border-${brand}`
								: `${prefix}border-${brand}/40`
							: `${prefix}border-${brand}`;
				} else suggestion = `${prefix}decoration-${brand}`;
				findings.push({
					line: i + 1,
					col: m.index + 1,
					match: m[0],
					suggestion,
					kind,
				});
			}
		}
	}
	return findings;
}

function applyFixes(text) {
	let next = text;
	next = next.replace(TEXT_CLASS_RE, (_, prefix, family) => {
		const p = prefix || "";
		return `${p}text-${brandFor(family, "text")}`;
	});
	next = next.replace(BORDER_CLASS_RE, (_, prefix, family) => {
		const p = prefix || "";
		const brand = brandFor(family, "border");
		if (brand.endsWith("-border")) return `${p}border-${brand}`;
		return `${p}border-${brand}/40`;
	});
	next = next.replace(DECORATION_CLASS_RE, (_, prefix, family) => {
		const p = prefix || "";
		return `${p}decoration-${brandFor(family, "decoration")}`;
	});
	return next;
}

const files = walk(srcRoot);
const report = [];
let fixedFiles = 0;

for (const abs of files) {
	const rel = path.relative(root, abs).split(path.sep).join("/");
	const original = fs.readFileSync(abs, "utf8");
	const findings = findInText(original);
	if (findings.length === 0) continue;

	if (doFix) {
		const next = applyFixes(original);
		if (next !== original) {
			fs.writeFileSync(abs, next);
			fixedFiles += 1;
		}
		const remaining = findInText(next);
		for (const f of remaining) {
			report.push({ rel, ...f });
		}
	} else {
		for (const f of findings) {
			report.push({ rel, ...f });
		}
	}
}

const byFile = new Map();
for (const row of report) {
	if (!byFile.has(row.rel)) byFile.set(row.rel, []);
	byFile.get(row.rel).push(row);
}

console.log(
	doFix
		? `theme-light-contrast-guard — fixed ${fixedFiles} file(s); ${report.length} remaining hit(s)`
		: `theme-light-contrast-guard — ${report.length} pale accent class hit(s) across ${byFile.size} file(s)`,
);
console.log(
	"Prefer text-brand-warn | text-brand-mcp | text-brand-violet | text-brand-sky (and *-border).",
);
console.log("");

for (const [rel, rows] of [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
	console.log(rel);
	for (const r of rows.slice(0, 40)) {
		console.log(`  ${r.line}:${r.col}  ${r.match}  →  ${r.suggestion}`);
	}
	if (rows.length > 40) console.log(`  … +${rows.length - 40} more`);
	console.log("");
}

if (report.length === 0) {
	console.log("OK — no pale Tailwind text/border/decoration accents left in src/.");
	process.exit(0);
}

if (warnOnly) {
	console.log("(--warn) exiting 0");
	process.exit(0);
}

if (doFix && report.length > 0) {
	console.error("Some hits could not be auto-fixed; edit manually.");
	process.exit(1);
}

if (!doFix) {
	console.error("Re-run with --fix to rewrite, or replace with brand tokens by hand.");
	process.exit(1);
}
