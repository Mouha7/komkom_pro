import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: withOpacity(lightColors.neutral700, 0.08),
		shadowColor: '#000000',
		shadowOpacity: 0.04,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	head: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
		columnGap: spacing.s2,
	},
	headLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		flex: 1,
	},
	iconWrap: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: lightColors.primaryLight,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontWeight: '600',
		flexShrink: 1,
	},
	body: {
		paddingHorizontal: spacing.s3,
		paddingBottom: spacing.s3,
		paddingTop: spacing.s1,
		borderTopWidth: 1,
		borderTopColor: withOpacity(lightColors.neutral700, 0.08),
	},
	description: {
		lineHeight: 21,
	},
});