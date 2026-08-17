/**
 * Save a Clerk session for demos.
 *
 * Playwright-controlled Chrome is often blocked by Cloudflare even when the
 * script does not type. This saver is hands-off and uses a persistent profile.
 *
 * Preferred (you drive Chrome; lowest CF friction):
 *   1. Open your own Chrome:
 *      /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\
 *        --remote-debugging-port=9222 \\
 *        --user-data-dir="$PWD/playwright/demos/.auth/chrome-profile"
 *   2. Sign in at accounts.aadm.io until aadm.io/member loads.
 *   3. DEMO_CDP_URL=http://127.0.0.1:9222 node playwright/demos/save-clerk-storage-state.mjs
 *
 * Fallback (Playwright opens Chrome, still hands-off):
 *   DEMO_HEADED=1 node playwright/demos/save-clerk-storage-state.mjs
 *
 * Walk credentials (pinned):
 *   email:    your.email+clerk_test@aadm.io
 *   password: YourPassword-demo-4242!
 *   name:     your / name
 *
 * Writes (gitignored): playwright/demos/.auth/clerk-storage-state.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright";

const BASE = (process.env.BASE_URL || "https://aadm.io").replace(/\/$/, "");
const outPath = resolve(
	process.env.DEMO_STORAGE_STATE?.trim() ||
		join(process.cwd(), "playwright/demos/.auth/clerk-storage-state.json"),
);
const profileDir = resolve(
	process.env.DEMO_CHROME_PROFILE?.trim() ||
		join(process.cwd(), "playwright/demos/.auth/chrome-profile"),
);
const waitMs = Number(process.env.DEMO_STORAGE_WAIT_MS || 600000);
const mode = (process.env.DEMO_AUTH_MODE || "sign-up").trim();
const cdpUrl = process.env.DEMO_CDP_URL?.trim() || "";

mkdirSync(dirname(outPath), { recursive: true });
mkdirSync(profileDir, { recursive: true });

function isMemberUrl(url) {
	try {
		const u = new URL(url);
		return (
			(u.hostname === "aadm.io" || u.hostname === "www.aadm.io") &&
			u.pathname.startsWith("/member")
		);
	} catch {
		return false;
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function livePages(browser, context) {
	const pages = [];
	const contexts = browser?.contexts?.() ?? (context ? [context] : []);
	for (const ctx of contexts) {
		for (const p of ctx.pages()) pages.push(p);
	}
	return pages;
}

async function findMemberPage(browser, context) {
	for (const p of livePages(browser, context)) {
		try {
			if (isMemberUrl(p.url())) return p;
		} catch {
			/* tab closed */
		}
	}
	return null;
}

async function waitForMember(browser, context) {
	const deadline = Date.now() + waitMs;
	while (Date.now() < deadline) {
		const page = await findMemberPage(browser, context);
		if (page) return page;
		await sleep(1000);
	}
	return null;
}

function sessionLooksUsable(state) {
	const cookies = state.cookies || [];
	const names = cookies.map((c) => c.name);
	const hasClerk =
		names.some((n) => n === "__session" || n.startsWith("__session_")) ||
		names.some((n) => n.includes("client_uat"));
	const hasAadmHost = cookies.some(
		(c) =>
			c.domain === "aadm.io" ||
			c.domain === ".aadm.io" ||
			c.domain === "accounts.aadm.io" ||
			c.domain === ".accounts.aadm.io",
	);
	return { hasClerk, hasAadmHost, count: cookies.length, names };
}

async function main() {
	const path = mode === "sign-in" ? "sign-in" : "sign-up";
	const startUrl = `https://accounts.aadm.io/${path}?redirect_url=${encodeURIComponent(`${BASE}/member`)}`;

	console.log("");
	console.log("=== SAVE CLERK SESSION (hands-off) ===");
	console.log(`Will write: ${outPath}`);
	console.log("");
	console.log("YOU drive the browser. This script will NOT type or click.");
	console.log("Credentials for this walk:");
	console.log("  email:    your.email+clerk_test@aadm.io");
	console.log("  otp:      424242");
	console.log("  password: YourPassword-demo-4242!");
	console.log("  name:     your / name");
	console.log("Stay until the address bar is https://aadm.io/member …");
	console.log("");

	let browser = null;
	let context;

	if (cdpUrl) {
		console.log(`Connecting to existing Chrome at ${cdpUrl}`);
		browser = await chromium.connectOverCDP(cdpUrl);
		context = browser.contexts()[0];
		if (!context) {
			throw new Error(
				"CDP Chrome has no context — is Chrome running with --remote-debugging-port?",
			);
		}
		const tabs = livePages(browser, context).map((p) => {
			try {
				return p.url();
			} catch {
				return "(closed)";
			}
		});
		console.log(
			`Watching ${tabs.length} tab(s): ${tabs.join(" | ") || "(none)"}`,
		);
		console.log(
			`If you do not see a yellow “AADM DEMO WINDOW” page, that Chrome is not this session.`,
		);
	} else {
		console.log(`Playwright Chrome (persistent profile): ${profileDir}`);
		console.log(
			"If Cloudflare still blocks, stop and use DEMO_CDP_URL with your own Chrome.",
		);
		console.log("");
		context = await chromium.launchPersistentContext(profileDir, {
			headless: false,
			channel: "chrome",
			viewport: { width: 1280, height: 900 },
			colorScheme: "dark",
			locale: "en-US",
			args: ["--disable-blink-features=AutomationControlled"],
			ignoreDefaultArgs: ["--enable-automation"],
		});
		await context.addInitScript(() => {
			Object.defineProperty(navigator, "webdriver", { get: () => undefined });
		});
		const page = context.pages()[0] || (await context.newPage());
		await page.goto(startUrl, { waitUntil: "domcontentloaded" });
	}

	const page = await waitForMember(browser, context);
	if (!page) {
		if (!cdpUrl) await context.close();
		throw new Error(
			`Timed out waiting for ${BASE}/member. Finish Cloudflare + auth, then retry.`,
		);
	}

	await page.goto(`${BASE}/member`, { waitUntil: "domcontentloaded" });
	await sleep(2000);
	if (!isMemberUrl(page.url())) {
		if (!cdpUrl) await context.close();
		throw new Error(`Expected /member, got ${page.url()}`);
	}

	const state = await context.storageState();
	const check = sessionLooksUsable(state);
	if (!check.hasClerk || !check.hasAadmHost) {
		console.warn(
			`Session may be incomplete (clerkCookie=${check.hasClerk} aadmHost=${check.hasAadmHost} n=${check.count}).`,
		);
	}
	writeFileSync(outPath, JSON.stringify(state, null, 2));
	console.log("");
	console.log(`Saved ${check.count} cookies → ${outPath}`);
	console.log(
		"Recorder stays unsigned through Create account, then injects these cookies for /member.",
	);
	console.log("Next: node playwright/demos/record-standard-onboard.mjs");

	if (!cdpUrl) {
		await context.close();
	}
	// CDP: leave Chrome open. browser.close() can take the window down.
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
