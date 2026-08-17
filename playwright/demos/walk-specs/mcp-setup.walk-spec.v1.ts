/**
 * Tour envelope — mcp-setup.
 * Click path / beats: ../adapters/mcp-setup-success-path.v1.ts
 */
import {
	MCP_SETUP_REQUIRED_SCENE_IDS,
	MCP_SETUP_SUCCESS_PATH_V1,
} from "../adapters/mcp-setup-success-path.v1.ts";

export const mcpSetupWalkSpecV1 = {
	version: 1 as const,
	tour: "mcp-setup",
	status: "WALK_DEFINED" as const,
	authMode: MCP_SETUP_SUCCESS_PATH_V1.authMode,
	audienceOutcome: MCP_SETUP_SUCCESS_PATH_V1.audienceOutcome,
	requiredSceneIds: MCP_SETUP_REQUIRED_SCENE_IDS,
	successPathRef: "adapters/mcp-setup-success-path.v1.ts",
	approval: "draft" as const,
} as const;
