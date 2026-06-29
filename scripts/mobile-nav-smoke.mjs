/**
 * Mobile nav pressure test — z-index, overlay, link reachability on narrow viewports.
 *
 * Run: npm run dev   (separate terminal)
 *      npm run test:mobile-nav
 */
import { chromium, devices } from "playwright";

const base = (process.env.BASE_URL || "http://127.0.0.1:4321").replace(
	/\/$/,
	"",
);
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 45000);

function assert(cond, message) {
	if (!cond) throw new Error(message);
}

const browser = await chromium.launch({
	headless: process.env.HEADFUL !== "1",
});

let exitCode = 0;
try {
	const context = await browser.newContext({
		...devices["iPhone 13"],
	});
	const page = await context.newPage();

	await page.goto(`${base}/tools`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.waitForTimeout(800);

	// Menu closed: overlay must not intercept taps on main content.
	const menuClosed = page.locator("#site-mobile-menu");
	await assert(
		!(await menuClosed.isVisible()),
		"menu should be hidden on load",
	);

	const mainLink = page.locator("main a").first();
	await assert(
		await mainLink.isVisible(),
		"main content link should be tappable when menu closed",
	);
	await mainLink.click({ trial: true, timeout: 5000 });

	// Open menu.
	const toggle = page.locator("[data-menu-toggle]");
	await assert(await toggle.isVisible(), "hamburger toggle visible on mobile");
	await toggle.click();
	await page.waitForTimeout(350);

	await assert(await menuClosed.isVisible(), "menu overlay visible after open");
	await assert(
		(await toggle.getAttribute("aria-expanded")) === "true",
		"toggle aria-expanded true",
	);

	// Menu must be portaled to body (not trapped under sticky header).
	const portalOk = await page.evaluate(() => {
		const menu = document.getElementById("site-mobile-menu");
		return menu?.parentElement === document.body;
	});
	assert(portalOk, "mobile menu must be direct child of body");

	// Z-index: menu above header and main isolate layers.
	const stacking = await page.evaluate(() => {
		const menu = document.getElementById("site-mobile-menu");
		const header = document.querySelector("[data-site-header]");
		const main = document.getElementById("main");
		const z = (el) => {
			if (!el) return 0;
			const s = getComputedStyle(el);
			return {
				zIndex: s.zIndex,
				position: s.position,
			};
		};
		return {
			menu: z(menu),
			header: z(header),
			main: main ? z(main) : null,
		};
	});
	assert(
		Number(stacking.menu.zIndex) >= 100,
		"menu z-index must beat page chrome",
	);
	assert(
		Number(stacking.menu.zIndex) > Number(stacking.header.zIndex || 0),
		"menu z-index must beat header",
	);

	// Hidden mobile-only links reachable in panel.
	const toolsLink = page.locator("#site-mobile-menu a", { hasText: "Tools" });
	await assert(
		await toolsLink.isVisible(),
		"Tools link visible in mobile menu",
	);
	await assert(await toolsLink.isEnabled(), "Tools link enabled");

	const idesLink = page.locator("#site-mobile-menu a", { hasText: "IDEs" });
	await assert(await idesLink.isVisible(), "IDEs link visible in mobile menu");

	// Backdrop closes menu.
	const backdrop = page.locator("[data-menu-backdrop]");
	const box = await backdrop.boundingBox();
	assert(box && box.width > 0, "backdrop has size");
	await page.mouse.click(box.x + 12, box.y + box.height / 2);
	await page.waitForTimeout(250);
	await assert(!(await menuClosed.isVisible()), "menu closes on backdrop tap");

	// Escape closes menu.
	await toggle.click();
	await page.waitForTimeout(200);
	await assert(await menuClosed.isVisible(), "menu open again");
	await page.keyboard.press("Escape");
	await page.waitForTimeout(200);
	await assert(!(await menuClosed.isVisible()), "menu closes on Escape");

	// Scroll long page: menu still covers viewport when open.
	await page.goto(`${base}/case-studies`, {
		waitUntil: "domcontentloaded",
		timeout: timeoutMs,
	});
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	await page.waitForTimeout(300);
	await page.locator("[data-menu-toggle]").click();
	await page.waitForTimeout(300);

	const coversViewport = await page.evaluate(() => {
		const menu = document.getElementById("site-mobile-menu");
		if (!menu || menu.classList.contains("hidden")) return false;
		const rect = menu.getBoundingClientRect();
		return (
			rect.top <= 0 &&
			rect.left <= 0 &&
			rect.width >= window.innerWidth - 1 &&
			rect.height >= window.innerHeight - 1
		);
	});
	assert(coversViewport, "menu must cover full viewport when scrolled");

	console.info("mobile-nav-smoke: ok");
} catch (err) {
	console.error("mobile-nav-smoke failed:", err);
	exitCode = 1;
} finally {
	await browser.close();
	process.exit(exitCode);
}
