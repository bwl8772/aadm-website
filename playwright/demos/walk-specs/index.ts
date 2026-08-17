/**
 * Catalog of shipping demo walk envelopes (aadm-website).
 * Lead tour first: standard-onboard (Open standard → GitHub UDALI → signup).
 */
export { standardOnboardWalkSpecV1 } from "./standard-onboard.walk-spec.v1.ts";
export { marketingHomeWalkSpecV1 } from "./marketing-home.walk-spec.v1.ts";
export { mcpSetupWalkSpecV1 } from "./mcp-setup.walk-spec.v1.ts";
export { memberCredentialsWalkSpecV1 } from "./member-credentials.walk-spec.v1.ts";
export { basicWalkSpecV1 } from "./basic.walk-spec.v1.ts";

export { STANDARD_ONBOARD_SUCCESS_PATH_V1 } from "../adapters/standard-onboard-success-path.v1.ts";
export { MARKETING_HOME_SUCCESS_PATH_V1 } from "../adapters/marketing-home-success-path.v1.ts";
export { MCP_SETUP_SUCCESS_PATH_V1 } from "../adapters/mcp-setup-success-path.v1.ts";
export { MEMBER_CREDENTIALS_SUCCESS_PATH_V1 } from "../adapters/member-credentials-success-path.v1.ts";
export { BASIC_SUCCESS_PATH_V1 } from "../adapters/basic-success-path.v1.ts";

import { standardOnboardWalkSpecV1 } from "./standard-onboard.walk-spec.v1.ts";
import { marketingHomeWalkSpecV1 } from "./marketing-home.walk-spec.v1.ts";
import { mcpSetupWalkSpecV1 } from "./mcp-setup.walk-spec.v1.ts";
import { memberCredentialsWalkSpecV1 } from "./member-credentials.walk-spec.v1.ts";
import { basicWalkSpecV1 } from "./basic.walk-spec.v1.ts";

/** All tours with locked scene ids — lead walk first. */
export const AADM_WEBSITE_DEMO_WALK_SPECS_V1 = [
	standardOnboardWalkSpecV1,
	marketingHomeWalkSpecV1,
	mcpSetupWalkSpecV1,
	memberCredentialsWalkSpecV1,
	basicWalkSpecV1,
] as const;
