/**
 * Tour envelope — marketing-home.
 * Click path / beats: ../adapters/marketing-home-success-path.v1.ts
 */
import {
	MARKETING_HOME_REQUIRED_SCENE_IDS,
	MARKETING_HOME_SUCCESS_PATH_V1,
} from "../adapters/marketing-home-success-path.v1.ts";

export const marketingHomeWalkSpecV1 = {
	version: 1 as const,
	tour: "marketing-home",
	status: "WALK_DEFINED" as const,
	authMode: MARKETING_HOME_SUCCESS_PATH_V1.authMode,
	audienceOutcome: MARKETING_HOME_SUCCESS_PATH_V1.audienceOutcome,
	requiredSceneIds: MARKETING_HOME_REQUIRED_SCENE_IDS,
	successPathRef: "adapters/marketing-home-success-path.v1.ts",
	approval: "draft" as const,
} as const;
