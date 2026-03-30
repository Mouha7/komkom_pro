import { StyleSheet } from 'react-native';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	// HeaderIcon styles
	headerIconContainer: {
		width: 88,
		height: 88,
		borderRadius: 44,
		backgroundColor: 'rgba(22, 163, 74, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: spacing.s4,
	},
	headerIconInner: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: lightColors.success,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 12,
	},
	headerIconContent: {
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},

	// SummaryCard styles
	summaryCard: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: spacing.s2,
		padding: spacing.s4,
		marginBottom: spacing.s5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.02,
		shadowRadius: 12,
		elevation: 2,
	},
	summaryHeader: {
		paddingBottom: spacing.s2,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(209, 213, 219, 0.5)',
		marginBottom: spacing.s2,
		gap: spacing.s1,
	},
	summaryHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	summaryLabel: {
		fontSize: 14,
		color: lightColors.text.secondary,
	},
	summaryValue: {
		fontSize: 15,
		fontWeight: '600',
		color: lightColors.text.primary,
	},
	tokenBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: spacing.s1,
		paddingVertical: 4,
		backgroundColor: lightColors.primaryLight,
		borderRadius: 4,
		gap: spacing.s0,
	},
	tokenBadgeText: {
		fontSize: 12,
		fontWeight: '600',
		color: lightColors.primaryDark,
	},
	tokenBadgeIcon: {
		width: 14,
		height: 14,
		justifyContent: 'center',
		alignItems: 'center',
	},

	// Summary details
	summaryDetails: {
		gap: spacing.s2,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	detailCol: {
		flex: 1,
		gap: 4,
	},
	detailText: {
		fontSize: 14,
		color: lightColors.text.primary,
	},
	detailSubtext: {
		fontSize: 13,
		color: lightColors.text.secondary,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: spacing.s2,
		paddingTop: spacing.s2,
		borderTopWidth: 1,
		borderTopColor: lightColors.background.default,
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: lightColors.text.primary,
	},
	totalValue: {
		fontSize: 20,
		fontWeight: '700',
		color: lightColors.primaryDark,
	},

	// ActionBar styles
	actionGroup: {
		gap: spacing.s1,
		marginTop: spacing.s4,
	},
	actionButton: {
		width: '100%',
		minHeight: 48,
	},
	actionButtonIcon: {
		width: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
