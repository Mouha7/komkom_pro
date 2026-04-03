import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { productCardSizes } from './productCard.sizes';

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
		height: productCardSizes.portraitImageHeight.base,
		backgroundColor: lightColors.background.subtle,
	},
	portraitImageRegular: {
		height: productCardSizes.portraitImageHeight.medium,
	},
	portraitImageLarge: {
		height: productCardSizes.portraitImageHeight.expanded,
	},
	portraitContent: {
		rowGap: spacing.s1,
	},
	portraitContentRegular: {
		rowGap: spacing.s2,
	},
	portraitPriceRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		flexWrap: 'wrap',
		columnGap: spacing.s2,
		rowGap: spacing.s1,
	},
	portraitPriceWrap: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: 4,
		flexGrow: 1,
		flexShrink: 1,
		minWidth: 0,
	},
	priceAmount: {
		fontWeight: '700',
		flexShrink: 1,
	},
	priceCurrency: {
		fontWeight: '400',
		flexShrink: 0,
	},
	actionButtonBase: {
		width: productCardSizes.actionButton.base,
		height: productCardSizes.actionButton.base,
		minWidth: productCardSizes.actionButton.base,
		paddingHorizontal: 0,
		paddingVertical: 0,
		borderRadius: 12,
	},
	actionButtonBaseRegular: {
		width: productCardSizes.actionButton.medium,
		height: productCardSizes.actionButton.medium,
		minWidth: productCardSizes.actionButton.medium,
	},
	actionButtonBaseLarge: {
		width: productCardSizes.actionButton.expanded,
		height: productCardSizes.actionButton.expanded,
		minWidth: productCardSizes.actionButton.expanded,
		borderRadius: 14,
	},
	actionButtonSuccess: {
		backgroundColor: lightColors.success,
		borderColor: lightColors.success,
	},
	actionButtonDisabled: {
		opacity: 0.45,
	},
	actionButtonAlignEnd: {
		marginLeft: 'auto',
	},
	portraitActionButton: {
		width: productCardSizes.actionButton.base,
	},
	portraitActionButtonRegular: {
		width: productCardSizes.actionButton.medium,
	},
	portraitActionButtonLarge: {
		width: productCardSizes.actionButton.expanded,
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
		width: productCardSizes.landscapeImage.base.width,
		height: productCardSizes.landscapeImage.base.height,
		borderColor: lightColors.border.default,
		borderRightWidth: 1,
		backgroundColor: lightColors.background.subtle,
	},
	landscapeImageRegular: {
		width: productCardSizes.landscapeImage.medium.width,
		height: productCardSizes.landscapeImage.medium.height,
	},
	landscapeImageLarge: {
		width: productCardSizes.landscapeImage.expanded.width,
		height: productCardSizes.landscapeImage.expanded.height,
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
		alignItems: 'flex-end',
		flexWrap: 'wrap',
		columnGap: spacing.s2,
		rowGap: spacing.s1,
	},
	landscapeBottomLarge: {
		columnGap: spacing.s3,
	},
	landscapePriceWrap: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: 4,
		flexGrow: 1,
		flexShrink: 1,
		minWidth: 0,
	},
	landscapeActionButton: {
		width: productCardSizes.actionButton.base,
	},
	landscapeActionButtonRegular: {
		width: productCardSizes.actionButton.medium,
	},
	landscapeActionButtonLarge: {
		width: productCardSizes.actionButton.expanded,
	},
});

