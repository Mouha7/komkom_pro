import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	// PORTRAIT VARIANT
	containerPortrait: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		overflow: 'hidden',
	},
	portraitTouchable: {
		padding: spacing.s2,
		rowGap: spacing.s2,
	},
	portraitTouchableRegular: {
		padding: spacing.s3,
		rowGap: spacing.s2,
	},
	portraitTouchableLarge: {
		padding: spacing.s3,
		rowGap: spacing.s3,
	},
	portraitImage: {
		width: '100%',
		height: 150,
		backgroundColor: lightColors.background.subtle,
	},
	portraitImageRegular: {
		height: 170,
	},
	portraitImageLarge: {
		height: 196,
	},
	portraitContent: {
		rowGap: spacing.s1,
	},
	portraitContentRegular: {
		rowGap: spacing.s2,
	},
	portraitPriceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		columnGap: spacing.s2,
	},
	portraitPriceWrap: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: 4,
	},
	priceAmount: {
		fontWeight: '700',
	},
	priceCurrency: {
		fontWeight: '400',
	},
	actionButtonBase: {
		width: 56,
		height: 56,
		minWidth: 56,
		paddingHorizontal: 0,
		paddingVertical: 0,
		borderRadius: 12,
	},
	actionButtonBaseRegular: {
		width: 60,
		height: 60,
		minWidth: 60,
	},
	actionButtonBaseLarge: {
		width: 64,
		height: 64,
		minWidth: 64,
		borderRadius: 14,
	},
	actionButtonSuccess: {
		backgroundColor: lightColors.success,
		borderColor: lightColors.success,
	},
	actionButtonDisabled: {
		opacity: 0.45,
	},
	portraitActionButton: {
		width: 56,
	},
	portraitActionButtonRegular: {
		width: 60,
	},
	portraitActionButtonLarge: {
		width: 64,
	},

	// LANDSCAPE VARIANT
	containerLandscape: {
		width: '100%',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		overflow: 'hidden',
	},
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
		height: 160,
		borderColor: lightColors.border.default,
		borderRightWidth: 1,
		backgroundColor: lightColors.background.subtle,
	},
	landscapeImageRegular: {
		width: 156,
		height: 170,
	},
	landscapeImageLarge: {
		width: 180,
		height: 190,
	},
	landscapeImageBadge: {
		position: 'absolute',
		top: spacing.s1,
		left: spacing.s1,
		zIndex: 10,
	},
	landscapeImageBadgeLarge: {
		top: spacing.s2,
		left: spacing.s2,
	},
	landscapeContent: {
		flex: 1,
		paddingVertical: spacing.s2,
		paddingRight: spacing.s2,
		justifyContent: 'space-between',
		rowGap: spacing.s1,
	},
	landscapeContentRegular: {
		paddingVertical: spacing.s3,
		paddingRight: spacing.s3,
		rowGap: spacing.s2,
	},
	landscapeContentLarge: {
		paddingVertical: spacing.s3,
		paddingRight: spacing.s4,
		rowGap: spacing.s3,
	},
	landscapeHeader: {
		rowGap: spacing.s1,
	},
	landscapeHeaderRegular: {
		rowGap: spacing.s2,
	},
	landscapeBottom: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		columnGap: spacing.s2,
	},
	landscapeBottomLarge: {
		columnGap: spacing.s3,
	},
	landscapePriceWrap: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: 4,
	},
	landscapeActionButton: {
		width: 56,
	},
	landscapeActionButtonRegular: {
		width: 60,
	},
	landscapeActionButtonLarge: {
		width: 64,
	},
});

