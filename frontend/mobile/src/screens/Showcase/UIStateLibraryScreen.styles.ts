import { StyleSheet } from 'react-native';

import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	content: {
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
		rowGap: spacing.s5,
	},
	section: {
		rowGap: spacing.s2,
	},
	iconGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		columnGap: spacing.s2,
		rowGap: spacing.s2,
	},
	iconCard: {
		width: '30%',
		minWidth: 88,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: spacing.s1,
		paddingVertical: spacing.s2,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
	},
	toastsWrap: {
		rowGap: spacing.s2,
	},
	skeletonWrap: {
		rowGap: spacing.s2,
	},
});
