import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.primary,
		borderRadius: 20,
		padding: spacing.s4 - spacing.s0,
		overflow: 'hidden',
		shadowColor: '#000000',
		shadowOpacity: 0.12,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 6 },
		elevation: 4,
	},
	bubble: {
		position: 'absolute',
		top: -18,
		right: -18,
		width: 112,
		height: 112,
		borderRadius: 56,
		backgroundColor: withOpacity('#FFFFFF', 0.12),
	},
	contentRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s3,
	},
	iconWrap: {
		width: 48,
		height: 48,
		borderRadius: 16,
		backgroundColor: withOpacity('#FFFFFF', 0.2),
		alignItems: 'center',
		justifyContent: 'center',
	},
	textWrap: {
		flex: 1,
		rowGap: spacing.s0,
	},
	title: {
		fontWeight: '700',
		color: lightColors.text.onPrimary,
	},
	subtitle: {
		color: withOpacity('#FFFFFF', 0.86),
		fontWeight: '500',
	},
});