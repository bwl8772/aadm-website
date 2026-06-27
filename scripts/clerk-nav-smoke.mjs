/**
 * Playwright smoke for the @clerk/astro nav.
 *
 * - Loads `/`, captures hrefs/buttons signed-out users see.
 * - Clicks Sign in (Account Portal link) to confirm navigation to Clerk-hosted sign-in.
 * - Loads `/mcp`, confirms Get access / Sign in CTAs are anchors with expected ids/text.
 * - Asserts unsigned `/member` redirects; forged sync param must not expose credentials.
 *
 * Run: BASE_URL=http://127.0.0.1:4321 npm run test:clerk-smoke
 *      BASE_URL=https://aadm.io npm run test:clerk-smoke
 */
import { chromium } from "playwright";

const base = (process.env.BASE_URL || "http://127.0.0.1:4321").replace(
	/\/$/,
	"",
);
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 45000);

function log(section, data) {
	console.log(`\n=== ${section} ===`);
	console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
}

const browser = await chromium.launch({
	headless: process.env.HEADFUL !== "1",
});
const context = await browser.newContext({
	viewport: { width: 1280, height: 800 },
	userAgent:
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});

let exitCode = 0;
try {
	const page = await context.newPage();
	const navigations = [];
	page.on("framenavigated", (frame) => {
		if (frame === page.mainFrame())
			navigations.push({ t: Date.now(), url: frame.url() });
	});

	await page.goto(`${base}/`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.waitForTimeout(1500);

	const homeData = await page.evaluate(() => {
		const headerButtons = Array.from(
			document.querySelectorAll("header button"),
		).map((b) => ({
			text: b.textContent?.trim() || null,
			dataset: { ...b.dataset },
		}));
		const headerLinks = Array.from(document.querySelectorAll("header a")).map(
			(a) => ({
				text: a.textContent?.trim() || null,
				href: a.getAttribute("href"),
			}),
		);
		return { headerButtons, headerLinks };
	});
	log("Home page (signed-out)", { url: page.url(), ...homeData });

	navigations.length = 0;
	const signInLink = page.locator("header a", { hasText: "Sign in" }).first();
	await signInLink.click({ timeout: 10000 });
	await page
		.waitForLoadState("domcontentloaded", { timeout: timeoutMs })
		.catch(() => {});
	await page.waitForTimeout(2000);

	log("After clicking Sign in (portal link)", {
		finalUrl: page.url(),
		title: await page.title(),
		isClerkPortal:
			/accounts\..+/.test(new URL(page.url()).hostname) ||
			/clerk\.accounts\.dev/.test(new URL(page.url()).hostname),
		mainText: ((await page.locator("body").innerText()).slice(0, 280) || "")
			.replace(/\s+/g, " ")
			.trim(),
	});
	log("Main-frame navigations (chronological)", navigations);

	await page.goto(`${base}/mcp`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.waitForTimeout(1500);

	const mcpData = await page.evaluate(() => {
		const get = (sel) => {
			const el = document.querySelector(sel);
			return el
				? {
						tag: el.tagName.toLowerCase(),
						text: el.textContent?.trim() || null,
					}
				: null;
		};
		return {
			getAccess: get("#get-access"),
			heroSignIn:
				Array.from(document.querySelectorAll("main a"))
					.find((el) => /Sign in/i.test(el.textContent || ""))
					?.textContent?.trim() || null,
		};
	});
	log("/mcp page (signed-out CTAs)", { url: page.url(), ...mcpData });

	// Unauthenticated /member should redirect to Clerk sign-in (Account Portal)
	navigations.length = 0;
	await page.goto(`${base}/member`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.waitForTimeout(2500);
	const memberUrl = page.url();
	const memberRedirectOk =
		/accounts\..+/.test(new URL(memberUrl).hostname) ||
		/clerk\.accounts\.dev/.test(new URL(memberUrl).hostname) ||
		/sign-in/.test(memberUrl);
	log("/member (signed-out redirect)", {
		finalUrl: memberUrl,
		redirectedToClerk: memberRedirectOk,
		navigations,
	});
	if (!memberRedirectOk) {
		throw new Error(
			`/member did not redirect to Clerk sign-in; stayed at ${memberUrl}`,
		);
	}

	// Forged satellite sync param — SSR must show sync shell only (no credentials).
	// Use API request so Clerk client JS does not navigate to accounts (422 on localhost).
	const syncReq = await context.request.get(
		`${base}/member?__clerk_synced=false`,
	);
	const syncHtml = await syncReq.text();
	const syncStatus = syncReq.status();
	const leaksCredentials =
		/data-copy-oauth-id=/i.test(syncHtml) ||
		/clerk-user-profile/i.test(syncHtml) ||
		/Connectors OAuth/i.test(syncHtml);
	log("/member?__clerk_synced=false (unsigned sync shell)", {
		httpStatus: syncStatus,
		hasSyncShell: /Syncing your session/i.test(syncHtml),
		leaksCredentials,
	});
	if (leaksCredentials) {
		throw new Error(
			"Unsigned /member?__clerk_synced=false leaked member credentials or UserProfile UI",
		);
	}
	if (!/Syncing your session/i.test(syncHtml)) {
		throw new Error(
			"Unsigned /member?__clerk_synced=false did not render satellite sync shell",
		);
	}
} catch (err) {
	console.error("Smoke failed:", err);
	exitCode = 1;
} finally {
	await browser.close();
	process.exit(exitCode);
}
