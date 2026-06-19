import node from "@astrojs/node";
import clerk from "@clerk/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const mode =
	process.env.NODE_ENV === "production" ? "production" : "development";
const env = loadEnv(mode, process.cwd(), "");

const trim = (v) => (typeof v === "string" ? v.trim() : "");

/** Mirror src/lib/clerk-portal-urls.ts — keep clerk() + middleware in sync. */
function marketingOriginFromEnv() {
	const quickstart = trim(env.PUBLIC_MCP_QUICKSTART_URL) || "https://aadm.io/mcp";
	try {
		return new URL(quickstart).origin;
	} catch {
		return "https://aadm.io";
	}
}

const signInUrl =
	trim(env.PUBLIC_CLERK_SIGN_IN_URL) || "https://accounts.aadm.io/sign-in";
const signUpUrl =
	trim(env.PUBLIC_CLERK_SIGN_UP_URL) || "https://accounts.aadm.io/sign-up";

const authorizedParties = (trim(env.PUBLIC_CLERK_AUTHORIZED_PARTIES) || "")
	.split(",")
	.map((s) => s.trim())
	.filter(Boolean);

const memberAreaPath =
	trim(env.PUBLIC_MEMBER_AREA_PATH) || "/member";
const memberFallbackPath = memberAreaPath.startsWith("/")
	? memberAreaPath
	: `/${memberAreaPath}`;
const signInFallbackRedirectUrl =
	trim(env.PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL) || memberFallbackPath;
const signUpFallbackRedirectUrl =
	trim(env.PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL) || memberFallbackPath;
const marketingOrigin = marketingOriginFromEnv();
const allowedRedirectOrigins =
	authorizedParties.length > 0 ? authorizedParties : [marketingOrigin];

const explicitSatellite = trim(env.PUBLIC_CLERK_IS_SATELLITE);
const isSatellite =
	explicitSatellite !== ""
		? explicitSatellite.toLowerCase() === "true" || explicitSatellite === "1"
		: (() => {
				try {
					return (
						new URL(signInUrl).hostname !==
						new URL(marketingOriginFromEnv()).hostname
					);
				} catch {
					return false;
				}
			})();

const clerkDomain =
	trim(env.PUBLIC_CLERK_DOMAIN) ||
	(() => {
		try {
			return new URL(marketingOriginFromEnv()).hostname;
		} catch {
			return "aadm.io";
		}
	})();

const configuredProxyUrl =
	trim(env.PUBLIC_CLERK_PROXY_URL) || trim(env.CLERK_PROXY_URL) || "";
const proxyUrl =
	configuredProxyUrl ||
	(isSatellite ? "https://clerk.aadm.io" : "");

export default defineConfig({
	output: "server",
	adapter: node({ mode: "standalone" }),
	integrations: [
		clerk({
			signInUrl,
			signUpUrl,
			signInFallbackRedirectUrl,
			signUpFallbackRedirectUrl,
			allowedRedirectOrigins,
			...(authorizedParties.length > 0 ? { authorizedParties } : {}),
			...(isSatellite ? { isSatellite: true } : {}),
			...(proxyUrl
				? { proxyUrl }
				: isSatellite
					? { domain: clerkDomain }
					: {}),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
