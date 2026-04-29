import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		marginTop: spacing.s2,
		borderRadius: 12,
		backgroundColor: lightColors.background.default,
		paddingVertical: spacing.s2,
		paddingHorizontal: spacing.s3,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	labelWrap: {
		flex: 1,
	},
});
