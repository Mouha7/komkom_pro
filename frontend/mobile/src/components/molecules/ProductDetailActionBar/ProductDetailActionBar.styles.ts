import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const ACTION_BAR_HEIGHT = 88;

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		shadowColor: withOpacity('#000000', 0.2),
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 1,
		shadowRadius: 12,
		elevation: 8,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	quantityControl: {
		width: 118,
		height: 52,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.background.default,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.s2,
	},
	quantityAction: {
		width: 24,
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	quantityValue: {
		minWidth: 18,
		textAlign: 'center',
		fontWeight: '700',
		color: lightColors.text.primary,
	},
	addButton: {
		flex: 1,
		height: 52,
		borderRadius: 10,
	},
});
