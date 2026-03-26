import { StyleSheet } from 'react-native';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent',
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
