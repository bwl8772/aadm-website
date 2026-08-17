/**
 * One-shot capture for standard-onboard (short pauses).
 * MUST visit /member/mcp-oauth. MUST NOT click Copy client ID / Client ID.
 *
 * Run: node playwright/demos/record-standard-onboard.mjs
 * Env: BASE_URL (default https://aadm.io), DEMO_SIGNUP_*, DEMO_SIGNIN_PASSWORD (optional)
 */
import { chromium } from "playwright";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const BASE = (process.env.BASE_URL || "https://aadm.io").replace(/\/$/, "");
const PAUSE = Number(process.env.DEMO_SHORT_PAUSE_MS || 450);
const PERSONAS =
	"https://github.com/bwl8772/aadm-standard/blob/main/docs/udali-personas.md";
const LAYERS =
	"https://github.com/bwl8772/aadm-standard/blob/main/docs/udali-22-layer-model.md";

const firstName = process.env.DEMO_SIGNUP_FIRST_NAME?.trim() || "Auto";
const lastName = process.env.DEMO_SIGNUP_LAST_NAME?.trim() || "Composer";
const email =
	process.env.DEMO_SIGNUP_EMAIL?.trim() ||
	`auto.composer+clerk_test@example.com`;
const password = process.env.DEMO_SIGNUP_PASSWORD?.trim() || "";

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = join(
	process.cwd(),
	"test-results",
	"demos",
	`standard-onboard-${stamp}`,
);
mkdirSync(outDir, { recursive: true });

const timeline = [];
function log(scene, msg) {
	const row = { t: Date.now(), scene, msg };
	timeline.push(row);
	console.log(`[${scene}] ${msg}`);
}

async function pause(page, ms = PAUSE) {
	await page.waitForTimeout(ms);
}

async function main() {
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		viewport: { width: 1920, height: 1080 },
		deviceScaleFactor: 1,
		colorScheme: "light",
		recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
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

		// 3-udali — prefer personas URL (prod may still open /standards)
		log("3-udali-github", "Open UDALI on GitHub.");
		const udaliLink = page.locator("#sections a").filter({ hasText: "Open on GitHub" }).nth(1);
		const [popup] = await Promise.all([
			page.context().waitForEvent("page", { timeout: 8000 }).catch(() => null),
			udaliLink.click({ timeout: 5000 }).catch(() => null),
		]);
		let gh = popup || page;
		if (popup) await popup.waitForLoadState("domcontentloaded");
		if (!gh.url().includes("udali-personas")) {
			await gh.goto(PERSONAS, { waitUntil: "domcontentloaded" });
		}
		await pause(gh);
		await gh.mouse.wheel(0, 400);
		await pause(gh);

		// 4-layers
		log("4-layers-github", "Here are the UDALI layers — L1 through L22.");
		await gh.goto(LAYERS, { waitUntil: "domcontentloaded" });
		await pause(gh);
		await gh.mouse.wheel(0, 350);
		await pause(gh);
		if (popup) await popup.close();

		// 5-return
		log("5-return-aadm", "Come back to aadm.io. Create your account.");
		await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
		await pause(page);

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
		await pause(page, 800);

		// 6-create-account — speak to viewer: your name / your email
		log("6-create-account", "Enter your name. Enter your email.");
		await page.waitForTimeout(1000);
		const first = page.locator('input[name="firstName"], input[autocomplete="given-name"]').first();
		const last = page.locator('input[name="lastName"], input[autocomplete="family-name"]').first();
		const emailInput = page.locator('input[name="emailAddress"], input[type="email"]').first();
		const passInput = page.locator('input[name="password"], input[type="password"]').first();

		if (await first.isVisible().catch(() => false)) {
			await first.click();
			await first.fill(firstName);
			await pause(page);
		}
		if (await last.isVisible().catch(() => false)) {
			await last.click();
			await last.fill(lastName);
			await pause(page);
		}
		if (await emailInput.isVisible().catch(() => false)) {
			await emailInput.click();
			await emailInput.fill(email);
			await pause(page, 700);
		}
		if (password && (await passInput.isVisible().catch(() => false))) {
			log("6-create-account", "Choose your password. (value not logged)");
			await passInput.click();
			await passInput.fill(password);
			await pause(page);
		} else {
			log("6-create-account", "Hold on sign-up — your password field (no password in env).");
			if (await passInput.isVisible().catch(() => false)) {
				await passInput.click();
				await pause(page, 600);
			}
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
			const signEmail = page.locator('input[name="identifier"], input[type="email"]').first();
			if (password && (await signEmail.isVisible().catch(() => false))) {
				await signEmail.fill(email);
				await pause(page);
				const cont = page.getByRole("button", { name: /Continue|Sign in/i }).first();
				if (await cont.isVisible().catch(() => false)) await cont.click();
				await pause(page, 800);
				const sp = page.locator('input[type="password"]').first();
				if (await sp.isVisible().catch(() => false)) {
					await sp.fill(password);
					await page.getByRole("button", { name: /Continue|Sign in/i }).first().click();
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

		const oauthNav = page.getByText("Connectors OAuth", { exact: false }).first();
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
		await page.getByRole("heading", { name: /Connectors OAuth/i }).first().scrollIntoViewIfNeeded().catch(() => {});
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
				forbidClientIdClick: true,
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
			console.log(`Wrote ${webmPath} (ffmpeg mp4 skipped: ${ff.stderr?.slice(0, 200) || "n/a"})`);
		}
	}
	console.log(`Artifacts: ${outDir}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
