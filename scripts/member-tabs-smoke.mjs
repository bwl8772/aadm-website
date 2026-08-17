/**
 * Member area tabs smoke — Astro owns top tabs; no Clerk split-pane chrome.
 *
 * Always:
 * - Unsigned `/member` must not expose credentials (redirect to sign-in).
 *
 * When `MEMBER_SMOKE_STORAGE_STATE` points to a Playwright storageState JSON
 * (signed-in cookies for aadm.io):
 * - Visit api-keys, mcp-oauth, account, security at 375px and 1280px.
 * - Assert top tablist, active tab, and panel content selectors.
 * - Assert Clerk sidenav is not the member chrome (no visible .cl-navbar).
 *
 * Run:
 *   BASE_URL=http://127.0.0.1:4321 npm run test:member-tabs
 *   BASE_URL=https://aadm.io MEMBER_SMOKE_STORAGE_STATE=./.member-storage.json npm run test:member-tabs
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

const routes = [
	{
		path: "/member/api-keys",
		tab: "api-keys",
		content: "#api-keys-guide-heading",
	},
	{
		path: "/member/mcp-oauth",
		tab: "mcp-oauth",
		content: "#oauth-heading",
	},
	{
		path: "/member/account",
		tab: "account",
		content: "[data-cred-panel='account']",
	},
	{
		path: "/member/security",
		tab: "security",
		content: "[data-cred-panel='security']",
	},
];

const viewports = [
	{ name: "mobile", width: 375, height: 812 },
	{ name: "desktop", width: 1280, height: 800 },
];

const browser = await chromium.launch({
	headless: process.env.HEADFUL !== "1",
});

let exitCode = 0;
try {
	const anon = await browser.newContext({
		viewport: { width: 1280, height: 800 },
	});
	const anonPage = await anon.newPage();
	await anonPage.goto(`${base}/member`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await anonPage.waitForTimeout(1500);
	const anonUrl = anonPage.url();
	const anonHasCreds = await anonPage
		.locator("#oauth-heading, #api-keys-guide-heading, [data-member-area-root]")
		.count();
	log("Unsigned /member", { anonUrl, anonHasCreds });
	assert(
		/accounts\.|sign-in|clerk/i.test(anonUrl) || anonHasCreds === 0,
		"unsigned /member must redirect to sign-in or show no credential chrome",
	);
	await anon.close();

	if (!storageState) {
		log(
			"Signed-in checks",
			"Skipped (set MEMBER_SMOKE_STORAGE_STATE to a Playwright storageState JSON)",
		);
	} else {
		for (const vp of viewports) {
			const context = await browser.newContext({
				viewport: { width: vp.width, height: vp.height },
				storageState,
			});
			const page = await context.newPage();

			for (const route of routes) {
				await page.goto(`${base}${route.path}`, {
					waitUntil: "domcontentloaded",
					timeout: timeoutMs,
				});
				await page.waitForTimeout(1200);

				const tablist = page.locator(".member-nav-tabs [role='tablist']");
				await tablist.waitFor({ state: "visible", timeout: 15000 });

				const tabsBox = await tablist.boundingBox();
				const contentEl = page.locator(route.content).first();
				await contentEl.waitFor({ state: "visible", timeout: 20000 });
				const contentBox = await contentEl.boundingBox();

				const activeTab = page.locator(
					`.member-nav-tabs__tab--active[data-member-tab="${route.tab}"]`,
				);
				assert(
					(await activeTab.count()) === 1,
					`${vp.name} ${route.path}: expected active tab ${route.tab}`,
				);

				const clerkNavbarVisible = await page.evaluate(() => {
					const nav = document.querySelector(".cl-navbar");
					if (!nav) return false;
					const cs = getComputedStyle(nav);
					return cs.display !== "none" && cs.visibility !== "hidden";
				});
				assert(
					!clerkNavbarVisible,
					`${vp.name} ${route.path}: Clerk .cl-navbar must stay hidden (Astro owns tabs)`,
				);

				assert(
					!!tabsBox && !!contentBox,
					`${vp.name} ${route.path}: missing boxes`,
				);
				assert(
					contentBox.y >= tabsBox.y - 2,
					`${vp.name} ${route.path}: content must sit below top tabs (got tab.y=${tabsBox.y} content.y=${contentBox.y})`,
				);

				log(`${vp.name} ${route.path}`, {
					activeTab: route.tab,
					tabsY: tabsBox.y,
					contentY: contentBox.y,
					clerkNavbarVisible,
				});
			}

			await context.close();
		}
	}

	console.log("\nmember-tabs smoke OK");
} catch (err) {
	exitCode = 1;
	console.error("\nmember-tabs smoke FAILED");
	console.error(err);
} finally {
	await browser.close();
	process.exit(exitCode);
}
