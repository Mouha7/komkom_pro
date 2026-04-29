import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		paddingVertical: spacing.s4,
		paddingHorizontal: spacing.s3 + spacing.s0,
        borderRadius: 12,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: spacing.s2,
	},
    statusLabel: {
        fontWeight: '700',
    },
	dateLabel: {
		marginTop: spacing.s0,
	},
	statusWrap: {
		paddingVertical: spacing.s0,
		paddingHorizontal: spacing.s2,
		borderRadius: 999,
		backgroundColor: withOpacity(lightColors.info, 0.1),
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s0,
	},
	statusDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: lightColors.info,
	},
	estimatedCard: {
		marginTop: spacing.s3,
		backgroundColor: withOpacity(lightColors.primary, 0.05),
		borderRadius: 12,
		borderWidth: 1,
		borderColor: withOpacity(lightColors.primary, 0.15),
		paddingVertical: spacing.s2,
		paddingHorizontal: spacing.s2,
	},
	estimatedRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	estimatedIconWrap: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: lightColors.surface.default,
		shadowColor: '#000000',
		shadowOpacity: 0.06,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	estimatedBlock: {
		gap: spacing.s0,
	},
	estimatedCaption: {
		color: lightColors.primaryDark,
	},
	estimatedValue: {
		fontWeight: '700',
		color: lightColors.primary,
	},
});
