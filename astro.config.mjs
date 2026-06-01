import node from '@astrojs/node';
import clerk from '@clerk/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');

const trim = (v) => (typeof v === 'string' ? v.trim() : '');
const authorizedParties = (trim(env.PUBLIC_CLERK_AUTHORIZED_PARTIES) || '')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

/** Must match src/lib/clerk-portal-urls.ts — Clerk Account Portal on accounts.aadm.io. */
const signInUrl = trim(env.PUBLIC_CLERK_SIGN_IN_URL) || 'https://accounts.aadm.io/sign-in';
const signUpUrl = trim(env.PUBLIC_CLERK_SIGN_UP_URL) || 'https://accounts.aadm.io/sign-up';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	// Account Portal: signInUrl/signUpUrl → accounts.aadm.io; authorizedParties → aadm.io origin.
	integrations: [
		clerk({
			signInUrl,
			signUpUrl,
			...(authorizedParties.length > 0 ? { authorizedParties } : {}),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
