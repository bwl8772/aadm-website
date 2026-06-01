import { DashboardChrome } from "@/components/dashboard-chrome";
import { McpOAuthClientIdMissingNotice } from "@/components/mcp-oauth-client-id-missing-notice";
import { SharedOAuthClientIdCard } from "@/components/shared-oauth-client-id-card";
import { mcpOAuthClientIdForDisplay } from "@/lib/mcp-oauth-config";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const clientId = mcpOAuthClientIdForDisplay();

	return (
		<DashboardChrome>
			<div className="space-y-8">
				{clientId ? (
					<SharedOAuthClientIdCard clientId={clientId} />
				) : (
					<McpOAuthClientIdMissingNotice />
				)}
				{children}
			</div>
		</DashboardChrome>
	);
}
