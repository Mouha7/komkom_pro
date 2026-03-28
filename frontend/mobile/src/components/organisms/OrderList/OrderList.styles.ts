import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		rowGap: spacing.s2,
	},
	loader: {
		paddingVertical: spacing.s4,
		alignItems: 'center',
	},
	empty: {
		padding: spacing.s3,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
	},
	listContent: {
		rowGap: spacing.s2,
	},
	item: {
		padding: spacing.s3,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 12,
		backgroundColor: lightColors.surface.default,
		rowGap: spacing.s2,
	},
	head: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		columnGap: spacing.s2,
	},
	meta: {
		rowGap: spacing.s1,
	},
	bottom: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
	},
});
