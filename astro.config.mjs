import node from '@astrojs/node';
import clerk from '@clerk/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');
const authorizedParties = (env.PUBLIC_CLERK_AUTHORIZED_PARTIES || '')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	// Optional `authorizedParties` tells Clerk which browser origins are valid for this instance.
	// Without it, some multi-origin setups bounce users to the Dashboard “Application URL” (e.g. aadm.io).
	integrations: [clerk(authorizedParties.length > 0 ? { authorizedParties } : {})],
	vite: {
		plugins: [tailwindcss()],
	},
});
