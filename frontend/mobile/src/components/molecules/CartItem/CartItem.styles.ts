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
	imageWrap: {
		width: 100,
	},
	image: {
		width: 80,
		height: 80,
		borderRadius: 4,
		backgroundColor: lightColors.background.subtle,
	},
	body: {
		flex: 1,
		rowGap: spacing.s2,
	},
	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		columnGap: spacing.s1,
	},
	brand: {
		color: lightColors.primary,
		fontWeight: '700',
	},
	removeButton: {
		padding: 2,
	},
	title: {
		fontSize: 13,
		lineHeight: 18,
		fontWeight: '500',
	},
	priceWrap: {
		rowGap: 2,
	},
	totalPrice: {
		fontSize: 15,
		fontWeight: '700',
	},
	unitPrice: {
		fontWeight: '400',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		columnGap: spacing.s2,
	},
	qtyControl: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: 100,
		height: 45,
		paddingHorizontal: spacing.s2,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 4,
		backgroundColor: lightColors.neutral100,
	},
	qtyAction: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 50,
		backgroundColor: lightColors.neutral100,
		boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 1 },
	},
	qtyValue: {
		fontWeight: '600',
	},
});
