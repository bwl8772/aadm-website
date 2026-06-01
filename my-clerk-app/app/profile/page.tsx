import { redirect } from "next/navigation";

import { clerkUserProfileUrl } from "@/lib/clerk-host";

export default function LegacyProfileRedirectPage() {
	redirect(clerkUserProfileUrl() ?? "https://accounts.aadm.io/user");
}
