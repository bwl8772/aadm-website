import { McpOAuthClientIdMissingNotice } from "@/components/mcp-oauth-client-id-missing-notice";
import { mcpOAuthClientIdForDisplay } from "@/lib/mcp-oauth-config";

import { DashboardTokensClient } from "./tokens-client";

export default function DashboardTokensPage() {
	const clientId = mcpOAuthClientIdForDisplay();

	return (
		<div className="space-y-8">
			{clientId ? null : <McpOAuthClientIdMissingNotice />}
			<DashboardTokensClient clientId={clientId} />
		</div>
	);
}
