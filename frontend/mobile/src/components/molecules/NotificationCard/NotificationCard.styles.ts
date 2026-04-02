import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
		rowGap: spacing.s2,
	},
	containerUnread: {
		backgroundColor: withOpacity(lightColors.primary as string, 0.04),
	},
	pressArea: {
		flexDirection: 'row',
		columnGap: spacing.s2,
	},
	pressed: {
		opacity: 0.82,
	},
	iconWrapper: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	},
	iconSuccess: {
		backgroundColor: withOpacity(lightColors.success as string, 0.1),
	},
	iconInfo: {
		backgroundColor: withOpacity(lightColors.info as string, 0.1),
	},
	iconWarning: {
		backgroundColor: withOpacity(lightColors.warning as string, 0.1),
	},
	iconError: {
		backgroundColor: withOpacity(lightColors.danger as string, 0.1),
	},
	content: {
		flex: 1,
		rowGap: spacing.s1,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		columnGap: spacing.s2,
	},
	title: {
		fontSize: 14,
		fontWeight: '600',
		flexShrink: 1,
	},
	timeGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		marginTop: 2,
	},
	timeLabel: {
		fontSize: 12,
	},
	unreadDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: lightColors.primary,
	},
	message: {
		fontSize: 13,
		lineHeight: 18,
	},
	actionButton: {
		alignSelf: 'flex-start',
		minHeight: 32,
		paddingHorizontal: spacing.s3,
		paddingVertical: 6,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		justifyContent: 'center',
		backgroundColor: lightColors.surface.default,
	},
	actionPrimary: {
		borderColor: withOpacity(lightColors.primary as string, 0.3),
		backgroundColor: withOpacity(lightColors.primary as string, 0.05),
	},
	actionDanger: {
		borderColor: withOpacity(lightColors.danger as string, 0.3),
		backgroundColor: withOpacity(lightColors.danger as string, 0.05),
	},
	actionText: {
		fontSize: 12,
		fontWeight: '600',
	},
});