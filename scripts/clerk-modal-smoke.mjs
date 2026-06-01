/**
 * Playwright smoke: verifies the modal sign-in/sign-up CTAs do **not** navigate.
 *
 * Signed-out flow expected:
 *   - Header `Sign in` / `Sign up` are <button> elements that open the Clerk modal in-page.
 *   - `/mcp` `#get-access` is a <button> that opens the Clerk modal in-page.
 *   - URL must remain on the marketing site (no bounce to /home or external portal).
 *
 * Run: BASE_URL=http://localhost:4321 node scripts/clerk-modal-smoke.mjs
 */

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const base = (process.env.BASE_URL || "http://localhost:4321").replace(
	/\/$/,
	"",
);
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 30000);
const screenshotDir = resolve(process.cwd(), "tmp/playwright");

await mkdir(screenshotDir, { recursive: true });

function log(section, data) {
	console.log(`\n=== ${section} ===`);
	console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
}

const failures = [];
function check(label, ok, detail) {
	const tag = ok ? "PASS" : "FAIL";
	console.log(`[${tag}] ${label}${detail ? ` — ${detail}` : ""}`);
	if (!ok) failures.push(label);
}

const browser = await chromium.launch({
	headless: process.env.HEADFUL !== "1",
});
const context = await browser.newContext({
	viewport: { width: 1280, height: 800 },
});
const page = await context.newPage();

try {
	// --- Home (signed out) ---
	await page.goto(`${base}/`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.waitForTimeout(2000); // let Clerk JS hydrate
	await page.screenshot({
		path: resolve(screenshotDir, "01-home-signed-out.png"),
		fullPage: true,
	});

	const homeHeader = await page.evaluate(() => {
		const headerButtons = Array.from(
			document.querySelectorAll("header button"),
		).map((b) => ({
			text: b.textContent?.trim() || null,
			tag: b.tagName.toLowerCase(),
		}));
		const headerLinks = Array.from(document.querySelectorAll("header a")).map(
			(a) => ({
				text: a.textContent?.trim() || null,
				href: a.getAttribute("href"),
			}),
		);
		return { headerButtons, headerLinks };
	});
	log("Home header (signed-out)", homeHeader);

	const headerSignIn = page
		.locator("header button", { hasText: /^Sign in$/i })
		.first();
	const headerSignUp = page
		.locator("header button", { hasText: /Sign up|Join/i })
		.first();
	check("Home: Sign in is a <button>", (await headerSignIn.count()) === 1);
	check("Home: Sign up is a <button>", (await headerSignUp.count()) === 1);

	// --- Click Sign in → modal opens, URL stays put ---
	const urlBefore = page.url();
	await headerSignIn.click({ timeout: 10000 });
	await page.waitForTimeout(2500);
	const urlAfter = page.url();
	check(
		"Home: clicking Sign in did NOT navigate",
		urlBefore === urlAfter,
		`before=${urlBefore} after=${urlAfter}`,
	);

	// Clerk modals render either an iframe (#cl-modal) or a div with role="dialog".
	const modalCount = await page.evaluate(() => {
		const sels = [
			".cl-modalContent",
			".cl-rootBox",
			'[role="dialog"]',
			'iframe[src*="clerk"]',
			'iframe[src*="accounts."]',
		];
		return sels.reduce((n, s) => n + document.querySelectorAll(s).length, 0);
	});
	check(
		"Home: Clerk modal is visible after Sign in click",
		modalCount > 0,
		`modalElements=${modalCount}`,
	);
	await page.screenshot({
		path: resolve(screenshotDir, "02-home-after-signin-click.png"),
		fullPage: true,
	});

	// Close modal (Escape) so we're back to a clean state.
	await page.keyboard.press("Escape").catch(() => {});
	await page.waitForTimeout(800);

	// --- /mcp signed-out ---
	await page.goto(`${base}/mcp`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.waitForTimeout(2000);
	await page.screenshot({
		path: resolve(screenshotDir, "03-mcp-signed-out.png"),
		fullPage: true,
	});

	const mcpInfo = await page.evaluate(() => {
		const get = (sel) => {
			const el = document.querySelector(sel);
			return el
				? {
						tag: el.tagName.toLowerCase(),
						text: el.textContent?.trim() || null,
					}
				: null;
		};
		const buttons = Array.from(document.querySelectorAll("main button")).map(
			(b) => b.textContent?.trim() || "",
		);
		return { getAccess: get("#get-access"), mainButtons: buttons };
	});
	log("/mcp main CTAs (signed-out)", mcpInfo);
	check(
		"/mcp: #get-access is a <button> (modal trigger, signed-out)",
		mcpInfo.getAccess?.tag === "button",
		`tag=${mcpInfo.getAccess?.tag}`,
	);

	// --- Click #get-access → modal opens, URL stays put ---
	const urlBeforeMcp = page.url();
	await page.locator("#get-access").first().click({ timeout: 10000 });
	await page.waitForTimeout(2500);
	const urlAfterMcp = page.url();
	check(
		"/mcp: clicking Get access did NOT navigate",
		urlBeforeMcp === urlAfterMcp,
		`before=${urlBeforeMcp} after=${urlAfterMcp}`,
	);
	const modalCountMcp = await page.evaluate(() => {
		const sels = [
			".cl-modalContent",
			".cl-rootBox",
			'[role="dialog"]',
			'iframe[src*="clerk"]',
			'iframe[src*="accounts."]',
		];
		return sels.reduce((n, s) => n + document.querySelectorAll(s).length, 0);
	});
	check(
		"/mcp: Clerk modal is visible after Get access click",
		modalCountMcp > 0,
		`modalElements=${modalCountMcp}`,
	);
	await page.screenshot({
		path: resolve(screenshotDir, "04-mcp-after-get-access.png"),
		fullPage: true,
	});
} catch (err) {
	console.error("Smoke threw:", err);
	failures.push(`exception: ${err.message}`);
} finally {
	await browser.close();
}

if (failures.length > 0) {
	console.log(`\n=== FAILED (${failures.length}) ===`);
	for (const f of failures) console.log(` - ${f}`);
	process.exit(1);
}
console.log("\n=== ALL CHECKS PASSED ===");
