export type AppFeatureFlags = Readonly<{
	enableRoleGuards: boolean;
}>;

export const appFeatureFlags: AppFeatureFlags = {
	// Keep guards disabled while backend auth integration is in progress.
	enableRoleGuards: false,
};

const DEFAULT_API_BASE_URL = 'http://localhost:3001';

export const appConfig = {
	apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
} as const;

