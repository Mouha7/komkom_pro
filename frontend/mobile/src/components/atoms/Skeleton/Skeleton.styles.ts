import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 10,
		padding: spacing.s3,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	avatar: {
		width: 52,
		height: 52,
		borderRadius: 8,
		backgroundColor: withOpacity(lightColors.neutral300, 0.85),
	},
	linesWrap: {
		flex: 1,
		rowGap: spacing.s1,
	},
	line: {
		height: 12,
		borderRadius: 6,
		backgroundColor: withOpacity(lightColors.neutral300, 0.8),
	},
});
