import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
		backgroundColor: lightColors.background.default,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	body: {
		paddingTop: spacing.s3,
	},
});
