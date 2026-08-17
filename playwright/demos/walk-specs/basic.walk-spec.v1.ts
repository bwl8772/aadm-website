/**
 * Tour envelope — basic (public-page exception).
 * Click path / beats: ../adapters/basic-success-path.v1.ts
 */
import {
	BASIC_REQUIRED_SCENE_IDS,
	BASIC_SUCCESS_PATH_V1,
} from "../adapters/basic-success-path.v1.ts";

export const basicWalkSpecV1 = {
	version: 1 as const,
	tour: "basic",
	status: "WALK_DEFINED" as const,
	authMode: BASIC_SUCCESS_PATH_V1.authMode,
	audienceOutcome: BASIC_SUCCESS_PATH_V1.audienceOutcome,
	requiredSceneIds: BASIC_REQUIRED_SCENE_IDS,
	successPathRef: "adapters/basic-success-path.v1.ts",
	approval: "draft" as const,
} as const;
