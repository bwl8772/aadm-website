import { AccountProfileSection } from "@/components/account-profile-section";
import { OAuthApplicationsPanel } from "@/components/oauth-applications-panel";

export default function UserAccountPage() {
	return (
		<div className="mx-auto max-w-2xl space-y-8 p-6">
			<AccountProfileSection />
			<OAuthApplicationsPanel />
		</div>
	);
}
