/**
 * Tour envelope — member-credentials.
 * Click path / beats: ../adapters/member-credentials-success-path.v1.ts
 */
import {
	MEMBER_CREDENTIALS_REQUIRED_SCENE_IDS,
	MEMBER_CREDENTIALS_SUCCESS_PATH_V1,
} from "../adapters/member-credentials-success-path.v1.ts";

export const memberCredentialsWalkSpecV1 = {
	version: 1 as const,
	tour: "member-credentials",
	status: "WALK_DEFINED" as const,
	authMode: MEMBER_CREDENTIALS_SUCCESS_PATH_V1.authMode,
	audienceOutcome: MEMBER_CREDENTIALS_SUCCESS_PATH_V1.audienceOutcome,
	requiredSceneIds: MEMBER_CREDENTIALS_REQUIRED_SCENE_IDS,
	successPathRef: "adapters/member-credentials-success-path.v1.ts",
	approval: "draft" as const,
} as const;
