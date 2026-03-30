import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
	},
	content: {
		paddingHorizontal: spacing.s4,
		paddingVertical: spacing.s2,
		rowGap: spacing.s2,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: lightColors.text.primary,
	},
	searchInputContainer: {
		backgroundColor: lightColors.neutral100,
		borderRadius: 14,
		borderColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		minHeight: 52,
	},
	clearButton: {
		padding: spacing.s0,
	},
});
