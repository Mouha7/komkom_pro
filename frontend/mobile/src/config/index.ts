export type AppFeatureFlags = Readonly<{
	enableRoleGuards: boolean;
}>;

export const appFeatureFlags: AppFeatureFlags = {
	// Keep guards disabled while backend auth integration is in progress.
	enableRoleGuards: false,
};

