/**
 * Minimal static server for production Docker (Railway, etc.).
 * Image layout: /app/serve.mjs + /app/dist (Astro build output).
 */
import http from 'node:http';
import fs from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const port = Number(process.env.PORT) || 8080;

const types = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'application/javascript',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.woff2': 'font/woff2',
};

function safePath(base, reqPath) {
	const pathname = new URL(reqPath, 'http://localhost').pathname;
	const resolved = path.resolve(base, '.' + pathname);
	if (!resolved.startsWith(base)) return null;
	return resolved;
}

http
	.createServer(async (req, res) => {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			res.writeHead(405).end();
			return;
		}

		const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
		if (pathname === '/health' || pathname === '/health/') {
			res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
			if (req.method === 'GET') {
				res.end(JSON.stringify({ status: 'ok', service: 'aadm-website' }));
			} else {
				res.end();
			}
			return;
		}

		let filePath = safePath(dist, pathname === '/' ? '/index.html' : pathname);
		if (!filePath) {
			res.writeHead(403).end('Forbidden');
			return;
		}

		try {
			let st = await fs.stat(filePath).catch(() => null);
			if (st?.isDirectory()) {
				filePath = path.join(filePath, 'index.html');
				st = await fs.stat(filePath).catch(() => null);
			}
			if (!st?.isFile()) {
				const fallback = path.join(dist, 'index.html');
				const html = await fs.readFile(fallback).catch(() => null);
				if (!html) {
					res.writeHead(404).end('Not found');
					return;
				}
				res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
				if (req.method === 'GET') res.end(html);
				else res.end();
				return;
			}

			const ext = path.extname(filePath);
			const ct = types[ext] ?? 'application/octet-stream';
			res.writeHead(200, { 'Content-Type': ct });
			if (req.method === 'GET') {
				res.end(await fs.readFile(filePath));
			} else {
				res.end();
			}
		} catch {
			res.writeHead(500).end();
		}
	})
	.listen(port, '0.0.0.0', () => {
		console.log(`aadm-website listening on 0.0.0.0:${port}`);
	});
