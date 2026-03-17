import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
		borderRadius: 14,
		paddingHorizontal: spacing.s4,
		paddingVertical: spacing.s5,
		alignItems: 'center',
		rowGap: spacing.s3,
	},
	iconWrap: {
		width: 72,
		height: 72,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: withOpacity(lightColors.neutral300, 0.4),
	},
	title: {
		textAlign: 'center',
	},
	description: {
		textAlign: 'center',
		maxWidth: 290,
	},
	action: {
		minWidth: 220,
	},
});
