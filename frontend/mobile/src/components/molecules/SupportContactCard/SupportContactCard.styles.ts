import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		padding: spacing.s3,
		rowGap: spacing.s2,
		shadowColor: '#000000',
		shadowOpacity: 0.04,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	iconWrap: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: lightColors.primaryLight,
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: {
		fontSize: 12,
		fontWeight: '600',
		letterSpacing: 0.4,
		textTransform: 'uppercase',
		color: withOpacity(String(lightColors.text.secondary), 0.92),
	},
	value: {
		fontWeight: '700',
		lineHeight: 21,
	},
});