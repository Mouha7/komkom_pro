import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const styles = StyleSheet.create({
	wrapper: {
		rowGap: spacing.s1,
	},
	label: {
		...typography.small,
		color: lightColors.text.secondary,
	},
	field: {
		minHeight: 44,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 10,
		paddingHorizontal: spacing.s2,
		backgroundColor: lightColors.surface.default,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
	},
	fieldError: {
		borderColor: lightColors.danger,
	},
	fieldDisabled: {
		opacity: 0.6,
		backgroundColor: lightColors.background.subtle,
	},
	input: {
		flex: 1,
		paddingVertical: spacing.s2,
		color: lightColors.text.primary,
		...typography.body,
	},
	errorText: {
		...typography.small,
		color: lightColors.text.danger,
	},
});
