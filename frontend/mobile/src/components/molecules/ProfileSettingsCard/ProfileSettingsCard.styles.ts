import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	sectionContainer: {
		rowGap: spacing.s2,
	},
	title: {
		flex: 1,
        fontWeight: 'bold',
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
		overflow: 'hidden',
	},
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
	},
	itemIconWrap: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: withOpacity(lightColors.primary as string, 0.08),
	},
	itemTitle: {
		flex: 1,
	},
	divider: {
		height: 1,
		backgroundColor: withOpacity(lightColors.border.default as string, 0.45),
	},
});
