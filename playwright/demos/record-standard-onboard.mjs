/**
 * One-shot capture for standard-onboard (short pauses).
 * MUST visit /member/mcp-oauth. MUST NOT click Copy client ID / Client ID.
 *
 * Run: node playwright/demos/record-standard-onboard.mjs
 * Env: BASE_URL (default https://aadm.io), DEMO_SIGNUP_*, DEMO_SIGNIN_PASSWORD (optional)
 *      DEMO_HEADED=1 (or HEADED=1) — visible Chromium window
 *      DEMO_SHORT_PAUSE_MS — station pause (default 450)
 *      DEMO_RETURN_HOME_MS — hold on aadm.io after GitHub (default 2000)
 *      DEMO_STORAGE_STATE — path to Playwright storageState JSON (saved Clerk session)
 *      DEMO_HUMAN_PASSWORD=1 — headed only: wait for you to paste password
 *
 * Save session (headed — you pass Cloudflare + sign in once):
 *   DEMO_HEADED=1 node playwright/demos/save-clerk-storage-state.mjs
 */
import { spawnSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	renameSync,
	writeFileSync,
} from "node:fs";
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
const captureIntent = process.env.DEMO_CAPTURE_INTENT?.trim() || "final";
/** When true: click password and wait for human paste. Default off (headless auto-types). */
const HUMAN_PASSWORD = process.env.DEMO_HUMAN_PASSWORD === "1";
const HUMAN_PASSWORD_WAIT_MS = Number(
	process.env.DEMO_HUMAN_PASSWORD_WAIT_MS || 180000,
);
const DEFAULT_STORAGE_STATE = join(
	process.cwd(),
	"playwright/demos/.auth/clerk-storage-state.json",
);
const storageStatePath =
	process.env.DEMO_STORAGE_STATE?.trim() ||
	(existsSync(DEFAULT_STORAGE_STATE) ? DEFAULT_STORAGE_STATE : "");
const hasStorageState = Boolean(
	storageStatePath && existsSync(storageStatePath),
);

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

/** Inject saved Clerk cookies after the unsigned login VO (same tab, no extra pages). */
async function applyStorageStateAfterLoginVo(context) {
	if (!hasStorageState) return false;
	const state = JSON.parse(readFileSync(storageStatePath, "utf8"));
	const cookies = Array.isArray(state.cookies) ? state.cookies : [];
	if (cookies.length) {
		await context.addCookies(cookies);
	}
	log(
		"6-create-account",
		`Injected storageState for member stations (${cookies.length} cookies).`,
	);
	return true;
}

async function main() {
	console.log(
		`standard-onboard · BASE=${BASE} · headed=${HEADED} · pause=${PAUSE}ms · storageState=${hasStorageState ? storageStatePath : "(none)"} · out=${outDir}`,
	);
	const browser = await chromium.launch({
		headless: !HEADED,
		slowMo: HEADED ? 40 : 0,
		// System Chrome reduces Cloudflare friction vs stock Chromium for headed capture.
		...(HEADED ? { channel: "chrome" } : {}),
	});
	const context = await browser.newContext({
		viewport: { width: 1920, height: 1080 },
		deviceScaleFactor: 1,
		colorScheme: "dark",
		locale: "en-US",
		recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
		// NEVER load storageState here — login VO must show Create account unsigned.
		// Session cookies are injected only after station 6 (see applyStorageStateAfterLoginVo).
	});
	// Keep GitHub / external links in the same tab for the lead tour.
	await context.addInitScript(() => {
		window.open = (url) => {
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
		const udaliLink = page
			.locator("#sections a[href*='udali-personas']")
			.first();
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
		await page.waitForLoadState("domcontentloaded");

		// Always show unsigned Create account land (~8s). Do NOT use storageState yet.
		log(
			"6-create-account",
			`Navigated to Account Portal (${Date.now() - returnStart}ms so far). Login VO (unsigned).`,
		);

		const landElapsed = Date.now() - returnStart;
		const landPad = Math.max(0, LAND_LOGIN_BUDGET_MS - landElapsed);
		if (landPad > 0) await pause(page, landPad);
		log(
			"6-create-account",
			`Landed on login/sign-up (${Date.now() - returnStart}ms / ${LAND_LOGIN_BUDGET_MS}ms). Enter your name. Enter your email.`,
		);
		await pause(page, 1200);

		// Optional: type into form if fields are visible (no CF). Never required for the cut.
		const passInput = page.locator('input[type="password"]').first();
		const formVisible = await passInput.isVisible().catch(() => false);
		if (formVisible && !hasStorageState) {
			async function clickAndType(locator, value, label) {
				await locator.waitFor({ state: "visible", timeout: 10000 });
				await locator.click({ timeout: 5000 });
				await locator.fill("");
				await locator.pressSequentially(value, { delay: 45 });
				log(
					"6-create-account",
					`Clicked + typed ${label} (${value.length} chars; value not logged).`,
				);
				await pause(page);
			}
			const first = page
				.locator(
					'input[name="firstName"], input[autocomplete="given-name"], input[name="first_name"]',
				)
				.first();
			const last = page
				.locator(
					'input[name="lastName"], input[autocomplete="family-name"], input[name="last_name"]',
				)
				.first();
			const emailInput = page
				.locator(
					'input[name="emailAddress"], input[name="email_address"], input[type="email"], input[autocomplete="email"]',
				)
				.first();
			if (await first.isVisible().catch(() => false)) {
				await clickAndType(first, firstName, "first name");
			}
			if (await last.isVisible().catch(() => false)) {
				await clickAndType(last, lastName, "last name");
			}
			if (await emailInput.isVisible().catch(() => false)) {
				await clickAndType(emailInput, email, "email");
			}
			if (HUMAN_PASSWORD) {
				log(
					"6-create-account",
					"PASSWORD: paste in window — script waits (no auto-type).",
				);
				await passInput.click({ timeout: 5000 });
				await page.waitForFunction(
					() => {
						const el = document.querySelector('input[type="password"]');
						return Boolean(el?.value && el.value.length >= 12);
					},
					{ timeout: HUMAN_PASSWORD_WAIT_MS },
				);
			} else {
				await clickAndType(passInput, password, "password");
			}
			await pause(page, 800);
		} else if (!formVisible) {
			log(
				"6-create-account",
				"SOFT-SKIP typing — form/CF not interactive; holding on Create account frame for VO.",
			);
			await pause(page, 1500);
		}

		// Login VO is filmed. Inject saved session, then go to member (same tab).
		if (hasStorageState) {
			await applyStorageStateAfterLoginVo(context);
		}

		log("7-member-shell", "You’re in the member area.");
		await page.goto(`${BASE}/member`, { waitUntil: "domcontentloaded" });
		await pause(page, 800);

		const onMember =
			page.url().includes("/member") && !page.url().includes("accounts.");
		if (!onMember) {
			if (hasStorageState) {
				log(
					"7-member-shell",
					`SOFT-SKIP: storageState did not admit /member (now ${page.url()}). Not typing into Cloudflare sign-in.`,
				);
			} else {
				log(
					"7-member-shell",
					"SOFT-SKIP: no saved Clerk session — member/OAuth will not load. Save session first.",
				);
			}
		}

		if (onMember) {
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
		} else {
			log(
				"8-connectors-oauth",
				"SOFT-SKIP Connectors OAuth — not authenticated on /member.",
			);
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
				captureIntent,
				headed: HEADED,
				base: BASE,
				totalMs: Date.now() - walkT0,
				forbidClientIdClick: true,
				sameTabGithub: true,
				storageState: hasStorageState ? storageStatePath : null,
				returnHomeHoldMs: RETURN_HOME_HOLD_MS,
				landLoginBudgetMs: LAND_LOGIN_BUDGET_MS,
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

	writeFileSync(
		join(outDir, "metadata.json"),
		JSON.stringify(
			{
				ok: true,
				tour: "standard-onboard",
				captureIntent,
				profile: "narrated-short-pauses",
				base: BASE,
				headed: HEADED,
				viewport: { width: 1920, height: 1080 },
				colorScheme: "dark",
				forbidClientIdClick: true,
				sameTabGithub: true,
				totalMs: Date.now() - walkT0,
				artifacts: {
					timeline: "timeline.json",
					mp4: "demo.mp4",
					webm: "source.webm",
				},
				voiceover: "playwright/demos/voiceovers/standard-onboard.voiceover.md",
				recordedAt: new Date().toISOString(),
			},
			null,
			2,
		),
	);

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
