import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingTop: spacing.s1,
		paddingHorizontal: spacing.s2,
		shadowColor: '#000000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: -2 },
		elevation: 4,
	},
	actionsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		columnGap: spacing.s1,
	},
	actionButton: {
		flex: 1,
		minHeight: 48,
		paddingVertical: spacing.s1,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: spacing.s0,
	},
	actionButtonPressed: {
		opacity: 0.72,
	},
	actionButtonActive: {
		backgroundColor: lightColors.surface.interactive,
	},
	badgeWrap: {
		position: 'absolute',
		top: 2,
		right: '28%',
		minWidth: 16,
		height: 16,
		borderRadius: 8,
		paddingHorizontal: 4,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: lightColors.danger,
	},
	badgeText: {
		color: lightColors.text.onPrimary,
		fontSize: 10,
		lineHeight: 12,
		fontWeight: '700',
	},
});
