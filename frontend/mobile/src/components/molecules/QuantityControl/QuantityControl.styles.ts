import { StyleSheet } from 'react-native';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		columnGap: spacing.s1,
	},
	containerCompact: {
		columnGap: spacing.s0,
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
	buttonCompact: {
		width: 28,
		height: 28,
	},
	buttonLarge: {
		width: 42,
		height: 42,
	},
	valueCompact: {
		fontSize: 12,
	},
	valueRegular: {
		fontSize: 14,
	},
	valueLarge: {
		fontSize: 16,
	},
});