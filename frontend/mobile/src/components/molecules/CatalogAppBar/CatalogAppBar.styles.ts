import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const ACTION_SIZE = 44;

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
		color: lightColors.text.primary,
		marginBottom: spacing.s1,
	},
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.s2,
		borderRadius: 12,
		marginHorizontal: -spacing.s2,
	},
	searchInputContainer: {
		backgroundColor: lightColors.neutral100,
		borderRadius: 14,
		borderColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		minHeight: 52,
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
	categoryChipContainer: {
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s1,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		justifyContent: 'center',
		alignItems: 'center',
	},
	categoryChipContainerActive: {
		backgroundColor: lightColors.primary,
		borderColor: lightColors.primary,
	},
	categoryChipLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: lightColors.text.secondary,
	},
	categoryChipLabelActive: {
		color: '#FFFFFF',
	},
	actionButton: {
		width: ACTION_SIZE,
		height: ACTION_SIZE,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	actionButtonPressed: {
		opacity: 0.72,
	},
	filterActiveDot: {
		position: 'absolute',
		right: 6,
		top: 6,
		alignSelf: 'center',
		width: 14,
		height: 14,
		borderRadius: 999,
		borderColor: '#FFFFFF',
		borderWidth: 2,
		backgroundColor: '#ED762F',
	},
});
