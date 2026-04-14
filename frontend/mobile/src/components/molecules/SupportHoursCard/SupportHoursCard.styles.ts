import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F1F5F9',
		borderRadius: 16,
		padding: spacing.s3,
		flexDirection: 'row',
		alignItems: 'flex-start',
		columnGap: spacing.s2,
	},
	iconWrap: {
		marginTop: 2,
	},
	content: {
		flex: 1,
		rowGap: spacing.s0,
	},
	label: {
		fontWeight: '700',
		color: lightColors.text.primary,
	},
	description: {
		lineHeight: 20,
	},
});