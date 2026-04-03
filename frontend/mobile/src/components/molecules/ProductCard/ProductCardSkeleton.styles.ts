import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { productCardSizes } from './productCard.sizes';

export const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		overflow: 'hidden',
	},
	placeholderBase: {
		overflow: 'hidden',
		backgroundColor: withOpacity(lightColors.neutral300, 0.62),
	},
	placeholderShimmer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		width: '42%',
		backgroundColor: withOpacity(lightColors.surface.default, 0.5),
	},
	
	portraitWrap: {
		padding: spacing.s2,
		rowGap: spacing.s2,
	},
	portraitWrapRegular: {
		padding: spacing.s3,
	},
	portraitWrapLarge: {
		padding: spacing.s3,
		rowGap: spacing.s3,
	},
	portraitImage: {
		width: '100%',
		height: productCardSizes.portraitImageHeight.base,
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
	portraitTitle: {
		height: 20,
		borderRadius: 6,
		width: '82%',
	},
	portraitSubtitle: {
		height: 14,
		borderRadius: 6,
		width: '52%',
	},
	portraitPriceRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		flexWrap: 'wrap',
		columnGap: spacing.s2,
		rowGap: spacing.s1,
	},
	portraitPrice: {
		height: 22,
		borderRadius: 6,
		width: '36%',
		flexGrow: 1,
		flexShrink: 1,
		minWidth: 0,
	},
	portraitButton: {
		width: productCardSizes.actionButton.base,
		height: productCardSizes.actionButton.base,
		borderRadius: 12,
		marginLeft: 'auto',
	},
	portraitButtonRegular: {
		width: productCardSizes.actionButton.medium,
		height: productCardSizes.actionButton.medium,
	},
	portraitButtonLarge: {
		width: productCardSizes.actionButton.expanded,
		height: productCardSizes.actionButton.expanded,
		borderRadius: 14,
	},
	
	landscapeWrap: {
		flexDirection: 'row',
		columnGap: spacing.s1,
	},
	landscapeImage: {
		width: productCardSizes.landscapeImage.base.width,
		height: productCardSizes.landscapeImage.base.height,
		borderRightWidth: 1,
		borderColor: lightColors.border.default,
	},
	landscapeImageRegular: {
		width: productCardSizes.landscapeImage.medium.width,
		height: productCardSizes.landscapeImage.medium.height,
	},
	landscapeImageLarge: {
		width: productCardSizes.landscapeImage.expanded.width,
		height: productCardSizes.landscapeImage.expanded.height,
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
	landscapeTitle: {
		height: 20,
		borderRadius: 6,
		width: '88%',
	},
	landscapeSubtitle: {
		height: 14,
		borderRadius: 6,
		width: '58%',
	},
	landscapeBottom: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		flexWrap: 'wrap',
		columnGap: spacing.s2,
		rowGap: spacing.s1,
	},
	landscapePrice: {
		height: 22,
		borderRadius: 6,
		width: '42%',
		flexGrow: 1,
		flexShrink: 1,
		minWidth: 0,
	},
	landscapeButton: {
		width: productCardSizes.actionButton.base,
		height: productCardSizes.actionButton.base,
		borderRadius: 12,
		marginLeft: 'auto',
	},
	landscapeButtonRegular: {
		width: productCardSizes.actionButton.medium,
		height: productCardSizes.actionButton.medium,
	},
	landscapeButtonLarge: {
		width: productCardSizes.actionButton.expanded,
		height: productCardSizes.actionButton.expanded,
		borderRadius: 14,
	},
});
