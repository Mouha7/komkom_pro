import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: withOpacity(lightColors.danger, 0.06),
		borderWidth: 1,
		borderColor: withOpacity(lightColors.danger, 0.3),
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
		backgroundColor: withOpacity(lightColors.danger, 0.1),
	},
	title: {
		textAlign: 'center',
	},
	description: {
		textAlign: 'center',
		maxWidth: 320,
	},
	action: {
		minWidth: 190,
		backgroundColor: lightColors.danger,
		borderColor: lightColors.danger,
	},
	actionText: {
		color: lightColors.text.onPrimary,
	},
});
