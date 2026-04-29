import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 12,
		paddingVertical: spacing.s3,
		paddingHorizontal: spacing.s4,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		columnGap: spacing.s2,
	},
	iconWrap: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: lightColors.background.default,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textWrap: {
		flex: 1,
		rowGap: spacing.s0,
	},
});
