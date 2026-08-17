/**
 * Tour envelope — standard-onboard (lead / top-of-catalog walk).
 * Click path: ../adapters/standard-onboard-success-path.v1.ts
 *
 * MUST visit Connectors OAuth. MUST NOT click Client ID / Copy client ID.
 */
import {
	STANDARD_ONBOARD_CAPTURE_HINTS,
	STANDARD_ONBOARD_REQUIRED_SCENE_IDS,
	STANDARD_ONBOARD_SUCCESS_PATH_V1,
} from "../adapters/standard-onboard-success-path.v1.ts";

export const standardOnboardWalkSpecV1 = {
	version: 1 as const,
	tour: "standard-onboard",
	status: "WALK_DEFINED" as const,
	authMode: STANDARD_ONBOARD_SUCCESS_PATH_V1.authMode,
	audienceOutcome: STANDARD_ONBOARD_SUCCESS_PATH_V1.audienceOutcome,
	requiredSceneIds: STANDARD_ONBOARD_REQUIRED_SCENE_IDS,
	successPathRef: "adapters/standard-onboard-success-path.v1.ts",
	captureHints: STANDARD_ONBOARD_CAPTURE_HINTS,
	approval: "draft" as const,
} as const;
