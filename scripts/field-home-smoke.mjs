/**
 * Field home smoke — empty /field/main behind the same sign-in/sync as /member.
 *
 * Always (unsigned):
 * - No "AADM Field" H1 / engagement copy (credentials-equivalent content hidden).
 * - Sync shell (or sign-in redirect) present; sign-in href redirect_url ends with /field/main.
 * - No MemberNavTabs chrome.
 *
 * When `MEMBER_SMOKE_STORAGE_STATE` is set (signed-in cookies):
 * - H1 "AADM Field" visible; engagement line present.
 * - Still no MemberNavTabs.
 *
 * Run:
 *   BASE_URL=http://127.0.0.1:4321 node scripts/field-home-smoke.mjs
 *   BASE_URL=http://127.0.0.1:4321 MEMBER_SMOKE_STORAGE_STATE=./.member-storage.json node scripts/field-home-smoke.mjs
 */
import { chromium } from "playwright";

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

function redirectUrlEndsWithFieldMain(href) {
	try {
		const u = new URL(href);
		const redirect = u.searchParams.get("redirect_url");
		if (!redirect) return false;
		const path = new URL(redirect).pathname.replace(/\/+$/, "") || "/";
		return path === "/field/main" || path.endsWith("/field/main");
	} catch {
		return false;
	}
}

const browser = await chromium.launch({
	headless: process.env.HEADFUL !== "1",
});

let exitCode = 0;
try {
	const anon = await browser.newContext({
		viewport: { width: 1280, height: 800 },
	});
	const anonPage = await anon.newPage();
	await anonPage.goto(`${base}/field/main`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await anonPage.waitForTimeout(1500);

	const anonUrl = anonPage.url();
	const fieldHeading = await anonPage
		.locator('h1:text-is("AADM Field")')
		.count();
	const engagementLine = await anonPage
		.getByText("Your engagements will show here.")
		.count();
	const memberTabs = await anonPage.locator(".member-nav-tabs").count();
	const syncShell = await anonPage.locator("[data-sign-in-url]").count();
	const signInHref =
		(await anonPage.locator("[data-sync-sign-in]").getAttribute("href")) ||
		(await anonPage
			.locator("[data-sign-in-url]")
			.getAttribute("data-sign-in-url")) ||
		"";

	log("Unsigned /field/main", {
		anonUrl,
		fieldHeading,
		engagementLine,
		memberTabs,
		syncShell,
		signInHref: signInHref.slice(0, 160),
	});

	assert(
		fieldHeading === 0 && engagementLine === 0,
		"unsigned /field/main must not show Field content",
	);
	assert(memberTabs === 0, "unsigned /field/main must not show MemberNavTabs");
	assert(
		/accounts\.|sign-in|clerk/i.test(anonUrl) || syncShell > 0,
		"unsigned /field/main must show sync shell or redirect toward sign-in",
	);
	if (syncShell > 0) {
		assert(
			redirectUrlEndsWithFieldMain(signInHref),
			`sync sign-in redirect_url must end with /field/main (got ${signInHref})`,
		);
	}

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

		const h1 = page.locator('h1:text-is("AADM Field")');
		await h1.waitFor({ state: "visible", timeout: 20000 });
		await page
			.getByText("Your engagements will show here.")
			.waitFor({ state: "visible", timeout: 10000 });
		assert(
			(await page.locator(".member-nav-tabs").count()) === 0,
			"signed-in /field/main must not add a MemberNavTabs tab",
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
