import { StyleSheet } from 'react-native';

import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	head: {
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	headTitle: {
		flex: 1,
		textAlign: 'center',
		marginRight: 20,
	},
	content: {
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
		rowGap: spacing.s5,
	},
	section: {
		rowGap: spacing.s2,
	},
	toastsWrap: {
		rowGap: spacing.s2,
	},
	skeletonWrap: {
		rowGap: spacing.s2,
	},
});
