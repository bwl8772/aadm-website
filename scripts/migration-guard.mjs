/**
 * Fails if a SQL migration bumps a version counter without a content guard.
 * A bump like `SET version = version + 1` must only fire when the content
 * changed, so re-running the migration (or replaying the same body) adds no
 * phantom version. The guard is a hash or content comparison in the same
 * statement: `IS DISTINCT FROM`, `<>` or `!=` on a hash or content column,
 * or a `NOT EXISTS` check.
 * Scans db/migrations and migrations (or MIGRATIONS_DIR). No folder → OK.
 * Run: node scripts/migration-guard.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = process.cwd();
const dirs = process.env.MIGRATIONS_DIR
	? [process.env.MIGRATIONS_DIR]
	: ["db/migrations", "migrations"];

const bump =
	/\b(\w*(?:version|revision|rev|counter|seq))\s*=\s*(?:\w+\.)?\1\s*\+\s*1\b/i;
const guard =
	/\b\w*(?:sha256|hash|checksum|content|body)\w*\s*(?:IS\s+DISTINCT\s+FROM|<>|!=)|\bNOT\s+EXISTS\b/i;

function sqlFiles(dir) {
	return readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		if (statSync(p).isDirectory()) return sqlFiles(p);
		return n.endsWith(".sql") ? [p] : [];
	});
}

/** Splits on `;` outside quotes and `$$` bodies; drops `--` comments. */
function statements(sql) {
	const out = [];
	let cur = "";
	let line = 1;
	let start = 1;
	let quote = null;
	for (let i = 0; i < sql.length; i++) {
		const c = sql[i];
		if (c === "\n") line++;
		if (!quote && c === "-" && sql[i + 1] === "-") {
			while (i < sql.length && sql[i] !== "\n") i++;
			line++;
			cur += "\n";
			continue;
		}
		if (!quote && sql.startsWith("$$", i)) {
			quote = "$$";
			cur += "$$";
			i++;
			continue;
		}
		if (quote === "$$" && sql.startsWith("$$", i)) {
			quote = null;
			cur += "$$";
			i++;
			continue;
		}
		if (!quote && c === "'") quote = "'";
		else if (quote === "'" && c === "'") quote = null;
		if (!quote && c === ";") {
			out.push({ text: cur, line: start });
			cur = "";
			start = line;
			continue;
		}
		if (!cur.trim()) start = line;
		cur += c;
	}
	if (cur.trim()) out.push({ text: cur, line: start });
	return out;
}

const bad = [];
let scanned = 0;
for (const d of dirs) {
	const abs = resolve(root, d);
	if (!existsSync(abs)) continue;
	for (const f of sqlFiles(abs)) {
		scanned++;
		for (const s of statements(readFileSync(f, "utf8"))) {
			const m = s.text.match(bump);
			if (m && !guard.test(s.text))
				bad.push(
					`${relative(root, f)}:${s.line} bumps ${m[1]} with no content guard (add e.g. WHERE content_sha256 IS DISTINCT FROM <new hash>)`,
				);
		}
	}
}
if (bad.length) {
	console.error(`migration-guard FAILED\n${bad.join("\n")}`);
	process.exit(1);
}
console.log(`migration-guard OK (${scanned} migration files)`);
