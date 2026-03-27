import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.neutral100,
	},
	appBarOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 30,
		elevation: 30,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 66,
	},
	galleryWrap: {
		backgroundColor: '#FFFFFF',
		position: 'relative',
		overflow: 'hidden',
		paddingTop: spacing.s12,
		paddingBottom: spacing.s0,
	},
	galleryFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s2,
		backgroundColor: '#FFFFFF',
		position: 'relative',
	},
	imagePager: {
		flex: 1,
	},
	image: {
		width: '100%',
		height: '100%',
		backgroundColor: withOpacity('#9CA3AF', 0.12),
	},
	dotsWrap: {
		position: 'absolute',
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
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
        backgroundColor: "#FFFFFF",
		paddingHorizontal: spacing.s3,
		paddingBottom: spacing.s4,
		rowGap: spacing.s2,
        borderBottomWidth: 1,
        borderBottomColor: lightColors.border.default,
	},
    descriptionBlock: {
        backgroundColor: "#FFFFFF",
        marginTop: spacing.s1,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
        borderBottomWidth: 1,
        borderBottomColor: lightColors.border.default,
    },
    specsBlock: {
        backgroundColor: "#FFFFFF",
        marginTop: spacing.s1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: lightColors.border.default,
        borderBottomColor: lightColors.border.default,
    },
	specsTitle: {
		fontWeight: '700',
	},
	brandRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
        marginTop: spacing.s4,
	},
	brandLabel: {
        fontSize: 16,
		color: lightColors.primary,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	referenceLabel: {
        fontSize: 12,
		color: lightColors.text.secondary,
	},
	productName: {
        fontSize: 22,
		fontWeight: '700',
	},
	priceRow: {
		flexDirection: 'row',
		alignItems: 'baseline',
		columnGap: spacing.s1,
	},
	priceValue: {
		fontWeight: '700',
		fontSize: 28,
        lineHeight: 44,
		color: lightColors.text.primary,
	},
	priceCurrency: {
        fontSize: 16,
		fontWeight: '500',
		color: lightColors.text.secondary,
	},
	unitChip: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
		borderRadius: 6,
		backgroundColor: lightColors.neutral100,
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
        backgroundColor: "#FFFFFF",
		marginTop: spacing.s1,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s3,
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
