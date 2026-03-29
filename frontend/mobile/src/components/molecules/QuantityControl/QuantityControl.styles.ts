import { StyleSheet } from 'react-native';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		columnGap: spacing.s1,
	},
	containerRegular: {
		columnGap: spacing.s2,
	},
	containerLarge: {
		columnGap: spacing.s2,
	},
	buttonRegular: {
		width: 38,
		height: 38,
	},
	buttonLarge: {
		width: 42,
		height: 42,
	},
	valueRegular: {
		fontSize: 14,
	},
	valueLarge: {
		fontSize: 16,
	},
});