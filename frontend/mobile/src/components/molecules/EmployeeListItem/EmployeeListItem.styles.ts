import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
		rowGap: spacing.s1,
	},
    avatarText: {
        fontWeight: '700',
    },
	topRow: {
		flexDirection: 'row',
		columnGap: spacing.s2,
		alignItems: 'flex-start',
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: withOpacity(lightColors.primary as string, 0.12),
		borderWidth: 1,
		borderColor: withOpacity(lightColors.primary as string, 0.18),
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
    badgeText: {
        fontWeight: '700',
    },
	infoWrap: {
		flex: 1,
		rowGap: spacing.s0,
	},
	name: {
		fontWeight: '700',
	},
	phone: {
		marginTop: 2,
	},
	email: {
		marginTop: 1,
	},
	badgesWrap: {
		flexDirection: 'row',
		columnGap: spacing.s1,
		flexWrap: 'wrap',
		rowGap: spacing.s1,
		paddingLeft: 60,
	},
	badge: {
		paddingHorizontal: spacing.s2,
		paddingVertical: 4,
		borderRadius: 999,
	},
	badgeRoleManager: {
		backgroundColor: withOpacity(lightColors.info as string, 0.1),
	},
	badgeRoleSeller: {
		backgroundColor: withOpacity(lightColors.neutral700 as string, 0.1),
	},
	badgeStatusActive: {
		backgroundColor: withOpacity(lightColors.success as string, 0.1),
	},
	badgeStatusPending: {
		backgroundColor: withOpacity(lightColors.warning as string, 0.12),
	},
	actionsRow: {
		flexDirection: 'row',
		columnGap: spacing.s2,
		paddingTop: spacing.s1,
	},
	actionButton: {
		flex: 1,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: withOpacity(lightColors.border.default as string, 0.8),
		paddingVertical: spacing.s1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		columnGap: spacing.s1,
		backgroundColor: lightColors.surface.default,
	},
	actionButtonDanger: {
		borderColor: withOpacity(lightColors.danger as string, 0.45),
		backgroundColor: withOpacity(lightColors.danger as string, 0.08),
	},
	actionText: {
		fontWeight: '700',
	},
});
