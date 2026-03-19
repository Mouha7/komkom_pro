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
	// PORTRAIT VARIANT
	portraitTouchable: {
		padding: spacing.s2,
		rowGap: spacing.s2,
	},
	portraitImage: {
		width: '100%',
		height: 150,
		borderRadius: 8,
		backgroundColor: lightColors.background.subtle,
	},
	portraitContent: {
		rowGap: spacing.s1,
	},
	portraitPriceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	portraitPriceWrap: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: 4,
	},
	actionButtonBase: {
		width: 56,
		height: 56,
		minWidth: 56,
		paddingHorizontal: 0,
		paddingVertical: 0,
		borderRadius: 12,
	},
	actionButtonSuccess: {
		backgroundColor: lightColors.success,
		borderColor: lightColors.success,
	},
	portraitActionButton: {
		width: 56,
	},

	// LANDSCAPE VARIANT
	landscapeTouchable: {
		flexDirection: 'row',
		columnGap: spacing.s1,
	},
	landscapeImageWrap: {
		position: 'relative',
		flex: 0,
	},
	landscapeImage: {
		width: 140,
		height: 140,
		borderRadius: 8,
		backgroundColor: lightColors.background.subtle,
	},
	landscapeImageBadge: {
		position: 'absolute',
		top: spacing.s1,
		left: spacing.s1,
		zIndex: 10,
	},
	landscapeContent: {
		flex: 1,
		paddingVertical: spacing.s2,
		paddingRight: spacing.s2,
		justifyContent: 'space-between',
		rowGap: spacing.s1,
	},
	landscapeHeader: {
		rowGap: spacing.s1,
	},
	landscapeBottom: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		columnGap: spacing.s2,
	},
	landscapePriceWrap: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: 4,
	},
	landscapeActionButton: {
		width: 56,
	},
});

