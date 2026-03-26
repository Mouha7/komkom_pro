import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 188,
	},
	galleryWrap: {
		height: 360,
		backgroundColor: lightColors.background.default,
	},
	imagePager: {
		flex: 1,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	dotsWrap: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: spacing.s4,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		columnGap: spacing.s1,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: lightColors.border.default,
	},
	dotActive: {
		width: 24,
		backgroundColor: lightColors.primary,
	},
	mainBlock: {
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		paddingBottom: spacing.s4,
		rowGap: spacing.s2,
	},
	stockChip: {
		alignSelf: 'flex-start',
		backgroundColor: lightColors.success,
		borderRadius: 8,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
	},
	stockLabel: {
		color: lightColors.text.onPrimary,
		fontWeight: '700',
		letterSpacing: 0.2,
	},
	brandRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	brandLabel: {
		color: lightColors.primary,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	referenceLabel: {
		color: lightColors.text.secondary,
	},
	productName: {
		fontWeight: '700',
		lineHeight: 40,
	},
	priceRow: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: spacing.s1,
	},
	priceValue: {
		fontWeight: '700',
		fontSize: 44,
		lineHeight: 48,
		color: lightColors.text.primary,
	},
	priceCurrency: {
		fontWeight: '700',
		color: lightColors.text.secondary,
	},
	unitChip: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
		borderRadius: 8,
		backgroundColor: withOpacity('#9CA3AF', 0.18),
	},
	unitLabel: {
		color: lightColors.text.secondary,
	},
	descriptionText: {
		color: lightColors.text.secondary,
		lineHeight: 30,
	},
	specTable: {
		borderRadius: 8,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: lightColors.border.default,
	},
	specRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s2,
	},
	specRowAlt: {
		backgroundColor: withOpacity('#9CA3AF', 0.12),
	},
	specLabel: {
		flex: 1,
		color: lightColors.text.secondary,
	},
	specValue: {
		flex: 1,
		textAlign: 'right',
		fontWeight: '700',
		color: lightColors.text.primary,
	},
	highlightBlock: {
		marginTop: spacing.s1,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s3,
		rowGap: spacing.s3,
	},
	highlightRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		columnGap: spacing.s2,
	},
	highlightIconWrap: {
		width: 42,
		height: 42,
		borderRadius: 21,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: withOpacity('#ED762F', 0.15),
	},
	highlightTexts: {
		flex: 1,
		rowGap: spacing.s0,
	},
	highlightTitle: {
		fontWeight: '700',
	},
	highlightDescription: {
		color: lightColors.text.secondary,
		lineHeight: 24,
	},
	actionBarDock: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
	},
});
