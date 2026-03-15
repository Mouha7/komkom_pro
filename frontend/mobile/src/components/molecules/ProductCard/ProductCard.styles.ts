import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		overflow: 'hidden',
	},
	touchable: {
		padding: spacing.s2,
		rowGap: spacing.s2,
	},
	head: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	image: {
		width: '100%',
		height: 120,
		borderRadius: 8,
		backgroundColor: lightColors.background.subtle,
	},
	content: {
		rowGap: spacing.s1,
	},
	priceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	priceWrap: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: 4,
	},
	actionButton: {
		minWidth: 48,
	},
});
