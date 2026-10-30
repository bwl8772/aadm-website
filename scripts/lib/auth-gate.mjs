/**
 * One check for "unsigned request to a protected path is handed to Clerk".
 * Accepts either outcome the middleware may produce — a 302 to the Account
 * Portal, or the 200 sync shell — and never waits on an element that only one
 * of them renders. Every smoke script uses this; do not re-implement it.
 */

function redirectPath(signInHref) {
	try {
		const redirect = new URL(signInHref).searchParams.get("redirect_url");
		return redirect
			? new URL(redirect).pathname.replace(/\/+$/, "") || "/"
			: null;
	} catch {
		return null;
	}
}

/**
 * @param {import("playwright").APIRequestContext} request  unsigned context
 * @param {string} base  site origin
 * @param {string} path  protected path, e.g. "/field/main"
 * @param {string} [expectReturn]  path redirect_url must end with (default: path)
 * @returns {Promise<{ kind: "redirect" | "sync-shell", signInHref: string }>}
 */
export async function assertHandsOffToSignIn(
	request,
	base,
	path,
	expectReturn = path,
) {
	const res = await request.get(`${base}${path}`, { maxRedirects: 0 });
	const status = res.status();
	let kind;
	let signInHref = "";

	if (status >= 300 && status < 400) {
		kind = "redirect";
		signInHref = res.headers().location || "";
	} else if (status === 200) {
		const html = await res.text();
		const m = html.match(/data-sign-in-url="([^"]+)"/);
		if (!m)
			throw new Error(
				`unsigned ${path}: 200 without sync shell — protected content may be served`,
			);
		if (/data-field-screen=/.test(html))
			throw new Error(`unsigned ${path}: Field screen markup in response`);
		kind = "sync-shell";
		signInHref = m[1].replace(/&amp;/g, "&");
	} else {
		throw new Error(`unsigned ${path}: unexpected status ${status}`);
	}

	if (!/sign-in/.test(signInHref))
		throw new Error(
			`unsigned ${path}: ${kind} does not point at sign-in (${signInHref})`,
		);
	const back = redirectPath(signInHref);
	if (!back?.endsWith(expectReturn)) {
		throw new Error(
			`unsigned ${path}: redirect_url must return to ${expectReturn} (got ${back})`,
		);
	}
	return { kind, signInHref };
}
