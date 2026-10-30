import { $userStore } from "@clerk/astro/client";
import { useEffect } from "react";

/**
 * Leaves a signed-in Field screen when the browser session is gone. `$userStore`
 * is `undefined` while clerk-js loads and `null` once it knows there is no user
 * (signed out in another tab, session revoked or expired). The server rendered
 * this page for a signed-in user, so `null` means the screen is stale: go back
 * through sign-in now instead of letting the next command fail. Renders nothing.
 */
export default function SessionWatch({ signInUrl }: { signInUrl: string }) {
	useEffect(() => {
		let left = false;
		const check = (user: unknown) => {
			if (left || user !== null) return;
			left = true;
			window.location.assign(signInUrl);
		};
		check($userStore.get());
		return $userStore.subscribe(check);
	}, [signInUrl]);
	return null;
}
