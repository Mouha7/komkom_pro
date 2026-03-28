import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const styles = StyleSheet.create({
	base: {
		minHeight: 44,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s2,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		columnGap: spacing.s1,
	},
	primary: {
		backgroundColor: lightColors.primary,
		borderWidth: 1,
		borderColor: lightColors.primary,
	},
	secondary: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
	},
	ghost: {
		backgroundColor: lightColors.transparent,
		borderWidth: 1,
		borderColor: lightColors.transparent,
	},
	disabled: {
		opacity: 0.55,
	},
	labelBase: {
		...typography.button,
	},
	labelPrimary: {
		color: lightColors.text.onPrimary,
	},
	labelSecondary: {
		color: lightColors.text.primary,
	},
	labelGhost: {
		color: lightColors.primary,
	},
	loader: {
		width: 16,
		height: 16,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: withOpacity(lightColors.text.onPrimary, 0.5),
		borderTopColor: lightColors.text.onPrimary,
	},
});
