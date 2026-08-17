/**
 * One-shot capture for standard-onboard (short pauses).
 * MUST visit /member/mcp-oauth. MUST NOT click Copy client ID / Client ID.
 *
 * Run: node playwright/demos/record-standard-onboard.mjs
 * Env: BASE_URL (default https://aadm.io), DEMO_SIGNUP_*, DEMO_SIGNIN_PASSWORD (optional)
 *      DEMO_HEADED=1 (or HEADED=1) — visible Chromium window
 *      DEMO_SHORT_PAUSE_MS — station pause (default 450)
 *      DEMO_RETURN_HOME_MS — hold on aadm.io after GitHub (default 2000)
 *      DEMO_LAND_LOGIN_MS — home→login land budget, not full signup (default 8000)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = (process.env.BASE_URL || "https://aadm.io").replace(/\/$/, "");
const PAUSE = Number(process.env.DEMO_SHORT_PAUSE_MS || 450);
const HEADED =
	process.env.DEMO_HEADED === "1" ||
	process.env.HEADED === "1" ||
	process.env.HEADFUL === "1";
/** Hold on aadm.io home after leaving GitHub (before Create account). */
const RETURN_HOME_HOLD_MS = Number(process.env.DEMO_RETURN_HOME_MS || 2000);
/**
 * Wall time from home-after-GitHub → signup/sign-in visible (not completing login).
 * Includes RETURN_HOME_HOLD_MS; pads so the beat is not rushed.
 */
const LAND_LOGIN_BUDGET_MS = Number(process.env.DEMO_LAND_LOGIN_MS || 8000);
const PERSONAS =
	"https://github.com/bwl8772/aadm-standard/blob/main/docs/udali-personas.md";
const LAYERS =
	"https://github.com/bwl8772/aadm-standard/blob/main/docs/udali-22-layer-model.md";

const firstName = process.env.DEMO_SIGNUP_FIRST_NAME?.trim() || "your";
const lastName = process.env.DEMO_SIGNUP_LAST_NAME?.trim() || "name";
const fullName =
	process.env.DEMO_SIGNUP_FULL_NAME?.trim() || `${firstName} ${lastName}`;
const email =
	process.env.DEMO_SIGNUP_EMAIL?.trim() || "your.email+clerk_test@aadm.io";
/** Clerk rejects short passwords — env must be ≥12 chars or we use the demo default. */
const DEMO_PASSWORD_DEFAULT = "YourPassword-demo-4242!";
const passwordFromEnv = process.env.DEMO_SIGNUP_PASSWORD?.trim() || "";
const password =
	passwordFromEnv.length >= 12 ? passwordFromEnv : DEMO_PASSWORD_DEFAULT;
if (passwordFromEnv && passwordFromEnv.length < 12) {
	console.warn(
		`DEMO_SIGNUP_PASSWORD is ${passwordFromEnv.length} chars (too short for Clerk); using demo default length.`,
	);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = join(
	process.cwd(),
	"test-results",
	"demos",
	`standard-onboard-${stamp}`,
);
mkdirSync(outDir, { recursive: true });

const walkT0 = Date.now();
const timeline = [];
function log(scene, msg) {
	const row = {
		t: Date.now(),
		elapsedMs: Date.now() - walkT0,
		scene,
		msg,
	};
	timeline.push(row);
	const sec = (row.elapsedMs / 1000).toFixed(1);
	console.log(`[+${sec}s][${scene}] ${msg}`);
}

async function pause(page, ms = PAUSE) {
	await page.waitForTimeout(ms);
}

async function stripBlankTargets(page) {
	await page.evaluate(() => {
		document.querySelectorAll("a[target=_blank]").forEach((a) => {
			a.removeAttribute("target");
		});
	});
}

async function main() {
	console.log(
		`standard-onboard · BASE=${BASE} · headed=${HEADED} · pause=${PAUSE}ms · out=${outDir}`,
	);
	const browser = await chromium.launch({
		headless: !HEADED,
		slowMo: HEADED ? 35 : 0,
	});
	const context = await browser.newContext({
		viewport: { width: 1920, height: 1080 },
		deviceScaleFactor: 1,
		colorScheme: "dark",
		recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
	});
	// Keep GitHub / external links in the same tab for the lead tour.
	await context.addInitScript(() => {
		window.open = function (url) {
			if (url) location.assign(String(url));
			return window;
		};
	});
	const page = await context.newPage();

	try {
		// 1-home
		log("1-home", "Start here on aadm.io.");
		await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
		await pause(page);
		const openStd = page
			.getByRole("link", { name: /Open AADM standard/i })
			.first();
		await openStd.click();
		await page.waitForURL(/\/standard/);
		await pause(page);

		// 2-standard-page
		log("2-standard-page", "Browse the sections.");
		await page.getByRole("link", { name: /Browse sections/i }).click();
		await pause(page);
		await page.locator("#sections").scrollIntoViewIfNeeded();
		await page.mouse.wheel(0, 280);
		await pause(page);

		// 3-udali — SAME TAB (never open a second window)
		log("3-udali-github", "Open UDALI on GitHub.");
		await stripBlankTargets(page);
		const githubLoopStart = Date.now();
		const udaliLink = page.locator("#sections a[href*='udali-personas']").first();
		if ((await udaliLink.count()) > 0) {
			await udaliLink.click({ timeout: 8000 });
		} else {
			await page
				.locator("#sections a")
				.filter({ hasText: "Open on GitHub" })
				.nth(1)
				.click({ timeout: 8000 });
		}
		await page.waitForURL(/github\.com/, { timeout: 20000 });
		if (!page.url().includes("udali-personas")) {
			await page.goto(PERSONAS, { waitUntil: "domcontentloaded" });
		}
		await pause(page);
		await page.mouse.wheel(0, 400);
		await pause(page);

		// 4-layers
		log("4-layers-github", "Here are the UDALI layers — L1 through L22.");
		await page.goto(LAYERS, { waitUntil: "domcontentloaded" });
		await pause(page);
		await page.mouse.wheel(0, 350);
		await pause(page);
		const githubLoopMs = Date.now() - githubLoopStart;
		log(
			"4-layers-github",
			`GitHub loop (same tab) ${githubLoopMs}ms · tabs=${context.pages().length}`,
		);

		// 5-return — 2s hold on aadm.io, then pace to login land in ~8s total
		log("5-return-aadm", "Come back to aadm.io. Create your account.");
		const returnStart = Date.now();
		await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
		await pause(page, RETURN_HOME_HOLD_MS);
		log(
			"5-return-aadm",
			`Held on aadm.io home ${RETURN_HOME_HOLD_MS}ms after GitHub.`,
		);

		const create = page.getByRole("link", { name: /Create account/i }).first();
		const getAccess = page.locator("#get-access").first();
		if (await create.isVisible().catch(() => false)) {
			await create.click();
		} else if (await getAccess.isVisible().catch(() => false)) {
			await getAccess.click();
		} else {
			await page.goto("https://accounts.aadm.io/sign-up", {
				waitUntil: "domcontentloaded",
			});
		}
		await page
			.waitForURL(/accounts\.aadm\.io|sign-up|sign-in/, { timeout: 20000 })
			.catch(() => {});
		await page.waitForLoadState("domcontentloaded");

		// Pad so “landing on login” (not completing login) takes ~8s from return.
		const landElapsed = Date.now() - returnStart;
		const landPad = Math.max(0, LAND_LOGIN_BUDGET_MS - landElapsed);
		if (landPad > 0) await pause(page, landPad);
		log(
			"6-create-account",
			`Landed on login (${Date.now() - returnStart}ms budget target ${LAND_LOGIN_BUDGET_MS}ms). Enter your name. Enter your email.`,
		);
		const first = page
			.locator('input[name="firstName"], input[autocomplete="given-name"]')
			.first();
		const last = page
			.locator('input[name="lastName"], input[autocomplete="family-name"]')
			.first();
		const emailInput = page
			.locator('input[name="emailAddress"], input[type="email"]')
			.first();
		const passInput = page
			.locator('input[name="password"], input[type="password"]')
			.first();

		if (await first.isVisible().catch(() => false)) {
			await first.click();
			await first.fill(firstName);
			await pause(page);
		}
		if (await last.isVisible().catch(() => false)) {
			await last.click();
			await last.fill(lastName);
			await pause(page);
		} else {
			// Single name field (some Clerk Account Portal configs)
			const nameOnly = page
				.locator(
					'input[name="name"], input[autocomplete="name"], input[name="username"]',
				)
				.first();
			if (await nameOnly.isVisible().catch(() => false)) {
				await nameOnly.click();
				await nameOnly.fill(fullName);
				await pause(page);
			}
		}
		if (await emailInput.isVisible().catch(() => false)) {
			await emailInput.click();
			await emailInput.fill(email);
			await pause(page, 700);
		}
		if (await passInput.isVisible().catch(() => false)) {
			log("6-create-account", "Choose your password. (value not logged)");
			await passInput.click();
			await passInput.fill(password);
			await pause(page);
		} else {
			log("6-create-account", "Hold on sign-up — password field not visible.");
		}
		// Hold on signup page (key frame)
		await pause(page, 1200);

		// Reach member for Connectors OAuth — prefer existing session via sign-in if signup incomplete
		log("7-member-shell", "You’re in the member area.");
		await page.goto(`${BASE}/member`, { waitUntil: "domcontentloaded" });
		await pause(page, 800);

		if (!page.url().includes("/member") || page.url().includes("accounts.")) {
			log("7-member-shell", "Not on member yet — open sign-in if needed.");
			await page.goto("https://accounts.aadm.io/sign-in", {
				waitUntil: "domcontentloaded",
			});
			await pause(page, 600);
			const signEmail = page
				.locator('input[name="identifier"], input[type="email"]')
				.first();
			if (await signEmail.isVisible().catch(() => false)) {
				await signEmail.fill(email);
				await pause(page);
				const cont = page
					.getByRole("button", { name: /Continue|Sign in/i })
					.first();
				if (await cont.isVisible().catch(() => false)) await cont.click();
				await pause(page, 800);
				const sp = page.locator('input[type="password"]').first();
				if (await sp.isVisible().catch(() => false)) {
					await sp.fill(password);
					await page
						.getByRole("button", { name: /Continue|Sign in/i })
						.first()
						.click();
					await pause(page, 1200);
				}
			}
			await page.goto(`${BASE}/member`, { waitUntil: "domcontentloaded" });
			await pause(page);
		}

		// 8-connectors-oauth — MUST visit; MUST NOT click Client ID
		log(
			"8-connectors-oauth",
			"Open Connectors OAuth. Look only — do not click Client ID.",
		);
		await page.goto(`${BASE}/member/mcp-oauth`, {
			waitUntil: "domcontentloaded",
		});
		await pause(page, 700);

		const oauthNav = page
			.getByText("Connectors OAuth", { exact: false })
			.first();
		if (await oauthNav.isVisible().catch(() => false)) {
			await oauthNav.click({ timeout: 3000 }).catch(() => {});
			await pause(page);
		}

		// Explicitly avoid Copy client ID
		const copyBtn = page.getByRole("button", { name: /Copy client ID/i });
		if (await copyBtn.isVisible().catch(() => false)) {
			log(
				"8-connectors-oauth",
				"Copy client ID visible — NOT clicking (forbid).",
			);
		}
		await page
			.getByRole("heading", { name: /Connectors OAuth/i })
			.first()
			.scrollIntoViewIfNeeded()
			.catch(() => {});
		await pause(page, 900);
		const help = page.locator("#oauth-help-claude");
		if (await help.isVisible().catch(() => false)) {
			await help.scrollIntoViewIfNeeded();
			await pause(page, 800);
		}

		log("done", "Capture path complete.");
	} finally {
		await context.close();
		await browser.close();
	}

	writeFileSync(
		join(outDir, "timeline.json"),
		JSON.stringify(
			{
				ok: true,
				tour: "standard-onboard",
				captureIntent: "final",
				headed: HEADED,
				base: BASE,
				totalMs: Date.now() - walkT0,
				forbidClientIdClick: true,
				sameTabGithub: true,
				viewerLines: {
					name: "your name",
					email: "your email",
					password: "your password",
				},
				timeline,
			},
			null,
			2,
		),
	);

	// Pick newest webm in outDir
	const { readdirSync, renameSync } = await import("node:fs");
	const webms = readdirSync(outDir).filter((f) => f.endsWith(".webm"));
	if (webms.length) {
		const src = join(outDir, webms[0]);
		const webmPath = join(outDir, "source.webm");
		if (src !== webmPath) renameSync(src, webmPath);
		const mp4 = join(outDir, "demo.mp4");
		const ff = spawnSync(
			"ffmpeg",
			[
				"-y",
				"-i",
				webmPath,
				"-c:v",
				"libx264",
				"-pix_fmt",
				"yuv420p",
				"-movflags",
				"+faststart",
				"-an",
				mp4,
			],
			{ encoding: "utf8" },
		);
		if (ff.status === 0 && existsSync(mp4)) {
			console.log(`Wrote ${mp4}`);
		} else {
			console.log(
				`Wrote ${webmPath} (ffmpeg mp4 skipped: ${ff.stderr?.slice(0, 200) || "n/a"})`,
			);
		}
	}
	console.log(`Artifacts: ${outDir}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
