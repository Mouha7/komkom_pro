import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.background.default,
		paddingHorizontal: spacing.s3,
		paddingBottom: spacing.s2,
	},
	content: {
		minHeight: 48,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
});
