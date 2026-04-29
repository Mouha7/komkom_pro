import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	sectionContainer: {
		rowGap: spacing.s2,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	title: {
		flex: 1,
        fontWeight: 'bold',
	},
	editButton: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
		borderRadius: 999,
		backgroundColor: withOpacity(lightColors.primary as string, 0.08),
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s2,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
	},
	row: {
		flexDirection: 'row',
		columnGap: spacing.s2,
		alignItems: 'center',
		paddingVertical: spacing.s2,
	},
	textWrap: {
		flex: 1,
		rowGap: spacing.s0,
	},
	divider: {
		height: 1,
		backgroundColor: withOpacity(lightColors.border.default as string, 0.5),
	},
});
