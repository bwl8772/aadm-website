/**
 * Field home smoke — empty /field/main behind the same sign-in/sync as /member.
 *
 * Always (unsigned):
 * - /field/main and /field/main/e/{id} hand off to Clerk sign-in (302 or sync shell),
 *   redirect_url returns to the same path, no Field markup served (lib/auth-gate.mjs).
 *
 * When `MEMBER_SMOKE_STORAGE_STATE` is set (signed-in cookies):
 * - [data-field-screen="home"] visible (empty state or fixture data).
 * - Still no MemberNavTabs.
 *
 * Run:
 *   BASE_URL=http://127.0.0.1:4321 node scripts/field-home-smoke.mjs
 *   BASE_URL=http://127.0.0.1:4321 MEMBER_SMOKE_STORAGE_STATE=./.member-storage.json node scripts/field-home-smoke.mjs
 */
import { chromium } from "playwright";
import { assertHandsOffToSignIn } from "./lib/auth-gate.mjs";

const base = (process.env.BASE_URL || "http://127.0.0.1:4321").replace(
	/\/$/,
	"",
);
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 45000);
const storageState = process.env.MEMBER_SMOKE_STORAGE_STATE?.trim() || "";

function log(section, data) {
	console.log(`\n=== ${section} ===`);
	console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
}

function assert(cond, msg) {
	if (!cond) throw new Error(msg);
}

const browser = await chromium.launch({
	headless: process.env.HEADFUL !== "1",
});

let exitCode = 0;
try {
	const anon = await browser.newContext();
	const gate = await assertHandsOffToSignIn(anon.request, base, "/field/main");
	log("Unsigned /field/main", gate);
	const wb = await assertHandsOffToSignIn(anon.request, base, "/field/main/e/00000000-0000-4000-8000-000000000000");
	log("Unsigned /field/main/e/{id}", wb);
	await anon.close();

	if (!storageState) {
		log(
			"Signed-in checks",
			"Skipped (set MEMBER_SMOKE_STORAGE_STATE to a Playwright storageState JSON)",
		);
	} else {
		const context = await browser.newContext({
			viewport: { width: 1280, height: 800 },
			storageState,
		});
		const page = await context.newPage();
		await page.goto(`${base}/field/main`, {
			waitUntil: "domcontentloaded",
			timeout: timeoutMs,
		});
		await page.waitForTimeout(1200);

		// Stable marker, not copy: survives heading/text changes.
		await page.locator('[data-field-screen="home"]').waitFor({ state: "visible", timeout: 20000 });
		assert(
			(await page.locator(".member-nav-tabs").count()) === 0,
			"signed-in /field/main must not add a MemberNavTabs tab",
		);
		assert(
			(await page.locator("[data-site-header]").count()) === 0,
			"signed-in /field/main must not show the marketing SiteHeader",
		);
		assert(
			(await page.locator("[data-field-header]").count()) === 1,
			"signed-in /field/main must show the Field product header",
		);
		assert(
			(await page.getByRole("navigation", { name: "Field" }).count()) === 1,
			"signed-in /field/main must show the Field menu",
		);
		log("Signed-in /field/main", { ok: true, url: page.url() });
		await context.close();
	}

	console.log("\nfield-home smoke OK");
} catch (err) {
	exitCode = 1;
	console.error("\nfield-home smoke FAILED");
	console.error(err);
} finally {
	await browser.close();
	process.exit(exitCode);
}
