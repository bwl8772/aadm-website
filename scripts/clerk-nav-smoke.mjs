/**
 * Playwright smoke for the @clerk/astro nav.
 *
 * - Loads `/`, captures hrefs/buttons signed-out users see.
 * - Clicks Sign in (Account Portal link) to confirm navigation to Clerk-hosted sign-in.
 * - Loads `/mcp`, confirms Get access / Sign in CTAs are anchors with expected ids/text.
 * - Asserts unsigned `/member` redirects to Account Portal (or the session gate).
 * - Unverifiable Clerk cookies must get the 200 recovery gate (never a bounce to
 *   the Portal — that was the redirect loop), set `aadm_auth_bounce`, and leak no
 *   credentials; the pass after the limit must show the stop page with a request id.
 * - `/health` reports the release and Clerk key state without values.
 *
 * Run: BASE_URL=http://127.0.0.1:4321 npm run test:clerk-smoke
 *      BASE_URL=https://aadm.io npm run test:clerk-smoke
 */
import { chromium } from "playwright";
import { assertHandsOffToSignIn } from "./lib/auth-gate.mjs";

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

	// Unsigned /member goes to Account Portal immediately (no 20s sync wait).
	navigations.length = 0;
	console.log(
		"\n=== Unsigned /member hand-off ===",
		await assertHandsOffToSignIn(context.request, base, "/member", "/member"),
	);
	await page.goto(`${base}/member`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.waitForTimeout(1500);
	const memberUrl = page.url();
	const syncShell = await page.locator("[data-sign-in-url]").count();
	const hasSyncCopy = await page.getByText("Syncing your session").count();
	const signInHref =
		(syncShell > 0 &&
			(await page
				.locator("[data-sync-sign-in]")
				.first()
				.getAttribute("href"))) ||
		(syncShell > 0 &&
			(await page
				.locator("[data-sign-in-url]")
				.first()
				.getAttribute("data-sign-in-url"))) ||
		"";
	const credUi = await page
		.locator(
			"#oauth-heading, #api-keys-guide-heading, [data-member-area-root], [data-cred-panel]",
		)
		.count();
	const onAccounts = /accounts\.|sign-in|clerk/i.test(memberUrl);
	const redirectEndsWithMember = (() => {
		try {
			const href = onAccounts ? memberUrl : signInHref;
			const redirect = new URL(href).searchParams.get("redirect_url");
			if (!redirect) return onAccounts;
			const path = new URL(redirect).pathname.replace(/\/+$/, "") || "/";
			return path === "/member" || path.endsWith("/member");
		} catch {
			return false;
		}
	})();
	log("/member (signed-out)", {
		finalUrl: memberUrl,
		onAccounts,
		syncShell,
		hasSyncCopy,
		credUi,
		signInHref: signInHref.slice(0, 160),
		redirectEndsWithMember,
		navigations,
	});
	if (!onAccounts && (syncShell === 0 || hasSyncCopy === 0)) {
		throw new Error(
			`unsigned /member must redirect to sign-in or show sync shell; stayed at ${memberUrl}`,
		);
	}
	if (credUi > 0) {
		throw new Error("unsigned /member must not expose API key / credential UI");
	}
	if (!onAccounts && !redirectEndsWithMember) {
		throw new Error(
			`[data-sync-sign-in] redirect_url must end with /member (got ${signInHref})`,
		);
	}

	// Unverifiable Clerk cookies (client says signed in, token is junk) — SSR must
	// serve the recovery gate: 200, no credentials, bounce cookie set, and no 302
	// to the Portal (that bounce is the redirect loop). API request so clerk-js
	// does not run.
	// Do not match MemberShell marketing copy ("Connectors OAuth") — only real
	// credential chrome / profile mounts.
	const leaks = (html) =>
		/data-copy-oauth-id=/i.test(html) ||
		/clerk-user-profile/i.test(html) ||
		/data-member-area-root/i.test(html) ||
		/data-cred-panel=/i.test(html) ||
		/id="(?:api-keys-guide-heading|oauth-heading)"/i.test(html);
	const forgedCookies = "__client_uat=1700000000; __session=not-a-jwt";
	const recoverReq = await context.request.get(`${base}/member`, {
		headers: { cookie: forgedCookies, accept: "text/html" },
		maxRedirects: 0,
	});
	const recoverHtml = await recoverReq.text();
	const recoverSetCookie = recoverReq.headers()["set-cookie"] || "";
	const recoverGate = recoverHtml.match(/data-session-gate="([^"]+)"/)?.[1];
	log("/member with unverifiable cookies (recovery gate)", {
		httpStatus: recoverReq.status(),
		gate: recoverGate ?? null,
		bounceCookieSet: /aadm_auth_bounce=1/.test(recoverSetCookie),
		leaksCredentials: leaks(recoverHtml),
	});
	if (leaks(recoverHtml)) {
		throw new Error(
			"/member with unverifiable cookies leaked member credentials or UserProfile UI",
		);
	}
	if (recoverReq.status() !== 200 || recoverGate !== "recover") {
		throw new Error(
			`unverifiable cookies must get the 200 recovery gate, got ${recoverReq.status()} gate=${recoverGate}`,
		);
	}
	if (!/aadm_auth_bounce=1/.test(recoverSetCookie)) {
		throw new Error("recovery gate must set aadm_auth_bounce=1");
	}

	// Past the bounce limit — a visible stop page with a request id, never a loop.
	const stopReq = await context.request.get(`${base}/member`, {
		headers: {
			cookie: `${forgedCookies}; aadm_auth_bounce=2`,
			accept: "text/html",
		},
		maxRedirects: 0,
	});
	const stopHtml = await stopReq.text();
	const stopGate = stopHtml.match(/data-session-gate="([^"]+)"/)?.[1];
	const stopRequestId = stopHtml.match(/data-request-id>([0-9a-f-]{36})</)?.[1];
	log("/member past the bounce limit (stop page)", {
		httpStatus: stopReq.status(),
		gate: stopGate ?? null,
		requestId: stopRequestId ?? null,
		leaksCredentials: leaks(stopHtml),
	});
	if (leaks(stopHtml)) {
		throw new Error("stop page leaked member credentials or UserProfile UI");
	}
	if (stopReq.status() !== 200 || stopGate !== "stop" || !stopRequestId) {
		throw new Error(
			`bounce limit must show the stop page with a request id, got ${stopReq.status()} gate=${stopGate}`,
		);
	}

	// /health: release + Clerk key state (never values).
	const healthReq = await context.request.get(`${base}/health`);
	const health = await healthReq.json();
	log("/health", { httpStatus: healthReq.status(), ...health });
	if (
		!health.release ||
		!health.clerk ||
		!["ok", "degraded"].includes(health.status) ||
		(health.status === "ok") !== (healthReq.status() === 200)
	) {
		throw new Error("/health must report release, clerk key state and 200/503");
	}
} catch (err) {
	console.error("Smoke failed:", err);
	exitCode = 1;
} finally {
	await browser.close();
	process.exit(exitCode);
}
