import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 6,
		backgroundColor: lightColors.surface.default,
		flexDirection: 'row',
		alignItems: 'stretch',
		padding: spacing.s2,
		// columnGap: spacing.s2,
		shadowColor: '#0F1724',
		shadowOpacity: 0.05,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 1 },
	},
	containerRegular: {
		borderRadius: 10,
		padding: spacing.s3,
	},
	containerLarge: {
		borderRadius: 12,
		padding: spacing.s3,
	},
	imageWrap: {
		width: 100,
	},
	imageWrapRegular: {
		width: 118,
	},
	imageWrapLarge: {
		width: 132,
	},
	image: {
		width: 80,
		height: 80,
		borderRadius: 4,
		backgroundColor: lightColors.background.subtle,
	},
	imageRegular: {
		width: 96,
		height: 96,
		borderRadius: 6,
	},
	imageLarge: {
		width: 108,
		height: 108,
		borderRadius: 8,
	},
	body: {
		flex: 1,
		rowGap: spacing.s2,
	},
	bodyRegular: {
		rowGap: spacing.s3,
	},
	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		columnGap: spacing.s1,
	},
	topRowRegular: {
		columnGap: spacing.s2,
	},
	brand: {
		color: lightColors.primary,
		fontWeight: '700',
	},
	brandRegular: {
		fontSize: 12,
	},
	removeButton: {
		padding: 2,
	},
	removeButtonRegular: {
		padding: spacing.s1,
	},
	title: {
		fontSize: 13,
		lineHeight: 18,
		fontWeight: '500',
	},
	titleRegular: {
		fontSize: 14,
		lineHeight: 20,
	},
	titleLarge: {
		fontSize: 15,
		lineHeight: 21,
	},
	priceWrap: {
		rowGap: 2,
	},
	priceWrapRegular: {
		rowGap: spacing.s1,
	},
	totalPrice: {
		fontSize: 15,
		fontWeight: '700',
	},
	totalPriceRegular: {
		fontSize: 16,
	},
	totalPriceLarge: {
		fontSize: 17,
	},
	unitPrice: {
		fontWeight: '400',
	},
	unitPriceRegular: {
		fontSize: 12,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		columnGap: spacing.s2,
	},
	footerRegular: {
		columnGap: spacing.s3,
	},
	qtyControl: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: 120,
		height: 45,
		paddingHorizontal: spacing.s1,
		borderWidth: 1,
		borderColor: lightColors.neutral100,
		borderRadius: 12,
		backgroundColor: lightColors.neutral100,
	},
	qtyControlRegular: {
		width: 132,
		height: 50,
		paddingHorizontal: spacing.s2,
	},
	qtyControlLarge: {
		width: 144,
		height: 54,
		paddingHorizontal: spacing.s2,
	},
	qtyAction: {
		width: 28,
		height: 28,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 50,
		backgroundColor: "#FFFFFF",
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 2 },
	},
	qtyActionRegular: {
		width: 30,
		height: 30,
	},
	qtyActionLarge: {
		width: 32,
		height: 32,
	},
	qtyValue: {
		fontWeight: '600',
	},
	qtyValueRegular: {
		fontSize: 13,
	},
	qtyValueLarge: {
		fontSize: 14,
	},
});
