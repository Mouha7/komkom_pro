import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	header: {
		height: 56,
		paddingHorizontal: spacing.s3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: lightColors.surface.default,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '600',
	},
	headerPlaceholder: {
		width: 40,
		height: 40,
	},
	contentContainer: {
		paddingHorizontal: spacing.s3,
		paddingBottom: spacing.s4,
		gap: spacing.s4,
	},
	section: {
		gap: spacing.s2,
	},
	sectionTitle: {
		fontSize: 13,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.5,
		marginLeft: spacing.s1,
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 8,
		padding: spacing.s3,
		shadowColor: withOpacity('#000000', 0.08),
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 1,
		elevation: 1,
	},
	mapPreviewContainer: {
		height: 160,
		borderRadius: 6,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: lightColors.border.default,
	},
	mapPreview: {
		flex: 1,
	},
	adjustLocationButton: {
		marginTop: spacing.s2,
		minHeight: 44,
	},
	adjustLocationButtonText: {
		fontSize: 14,
		fontWeight: '600',
	},
	inputGroupSpacing: {
		marginTop: spacing.s3,
	},
	inputLabelStyle: {
		fontSize: 13,
		fontWeight: '500',
	},
	locationRequiredText: {
		fontSize: 12,
		fontWeight: '600',
		marginTop: spacing.s1,
	},
	radioGroup: {
		gap: spacing.s2,
	},
	radioCard: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		padding: spacing.s3,
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 8,
		shadowColor: withOpacity('#000000', 0.08),
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 1,
		elevation: 1,
	},
	radioCardActive: {
		borderColor: lightColors.primary,
		backgroundColor: lightColors.primaryLight,
	},
	radioCircle: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: lightColors.border.default,
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioCircleActive: {
		borderColor: lightColors.primary,
	},
	radioCircleInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: lightColors.primary,
	},
	radioContent: {
		flex: 1,
		gap: 2,
	},
	radioTitle: {
		fontSize: 14,
		fontWeight: '600',
	},
	radioTitleActive: {
		color: lightColors.primaryDark,
	},
	radioDescription: {
		fontSize: 12,
		lineHeight: 18,
	},
	radioIconWrap: {
		width: 24,
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioIconActive: {
		color: lightColors.primary,
	},
	instructionsInputStyle: {
		minHeight: 80,
		paddingVertical: spacing.s2,
		textAlignVertical: 'top',
	},
	summaryCard: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 8,
		padding: spacing.s3,
		shadowColor: withOpacity('#000000', 0.08),
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 4,
		shadowOpacity: 1,
		elevation: 1,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: spacing.s2,
	},
	summaryValue: {
		fontWeight: '600',
		color: lightColors.text.primary,
	},
	summaryTotalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: spacing.s2,
		paddingTop: spacing.s2,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
	},
	summaryTotalValue: {
		color: lightColors.primaryDark,
	},
	bottomBar: {
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
	},
	confirmButton: {
		minHeight: 48,
		justifyContent: 'space-between',
		paddingHorizontal: spacing.s2,
	},
	confirmButtonText: {
		color: '#FFFFFF',
		fontWeight: '700',
		fontSize: 15,
		flex: 1,
		textAlign: 'left',
	},
	confirmButtonAmount: {
		color: '#FFFFFF',
		fontWeight: '700',
		fontSize: 15,
	},
	idempotenceNote: {
		marginTop: spacing.s1,
		fontSize: 11,
		textAlign: 'center',
	},
});
