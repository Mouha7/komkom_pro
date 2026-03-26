import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const ACTION_SIZE = 44;
const CATEGORY_CHIP_WIDTH = 100;
const CATEGORY_CHIP_HEIGHT = 40;

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	content: {
		paddingHorizontal: spacing.s4,
		paddingVertical: spacing.s2,
		rowGap: spacing.s2,
	},
	actionsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s0,
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
	},
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.s2,
		borderRadius: 12,
		marginHorizontal: -spacing.s2,
		marginBottom: spacing.s1,
	},
	searchInputContainer: {
		backgroundColor: lightColors.neutral100,
	},
	searchInputWrapper: {
		flex: 1,
	},
	categoryChipsRow: {
		flexDirection: 'row',
		paddingHorizontal: -spacing.s2,
		marginHorizontal: -spacing.s2,
	},
	categoryChipsContent: {
		paddingHorizontal: spacing.s2,
		columnGap: spacing.s2,
	},
	categoryChip: {
		width: CATEGORY_CHIP_WIDTH,
		height: CATEGORY_CHIP_HEIGHT,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: lightColors.border.subtle,
		borderWidth: 1,
		borderColor: lightColors.border.default,
	},
	categoryChipActive: {
		backgroundColor: lightColors.primary,
		borderColor: lightColors.primary,
	},
	categoryChipPressed: {
		opacity: 0.72,
	},
	categoryChipText: {
		fontSize: 13,
		fontWeight: '600',
	},
	categoryChipActiveText: {
		color: '#FFFFFF',
	},
	actionButton: {
		width: ACTION_SIZE,
		height: ACTION_SIZE,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionButtonPressed: {
		opacity: 0.72,
	},
});
