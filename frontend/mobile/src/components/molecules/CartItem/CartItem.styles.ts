import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 12,
		backgroundColor: lightColors.surface.default,
		overflow: 'hidden',
		flexDirection: 'row',
	},
	image: {
		width: 110,
		height: 110,
		backgroundColor: lightColors.background.subtle,
	},
	body: {
		flex: 1,
		padding: spacing.s2,
		rowGap: spacing.s1,
	},
	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		columnGap: spacing.s2,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	qtyRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
	},
	actionButton: {
		minWidth: 36,
		paddingHorizontal: spacing.s2,
	},
});
