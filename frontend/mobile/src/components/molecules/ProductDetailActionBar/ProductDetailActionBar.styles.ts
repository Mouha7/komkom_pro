import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const ACTION_BAR_HEIGHT = 55;

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 0.2,
		shadowRadius: 12,
		elevation: 8,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	quantityControl: {
		width: 150,
		height: 55,
		borderRadius: 12,
		backgroundColor: lightColors.neutral100,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.s2,
	},
	quantityValue: {
		minWidth: 32,
		textAlign: 'center',
		fontWeight: '700',
		fontSize: 18,
		color: lightColors.text.primary,
	},
	addButton: {
		flex: 1,
		height: 52,
		borderRadius: 10,
	},
});
