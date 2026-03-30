import { StyleSheet } from 'react-native';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	// OrderItemsSummary styles
	itemsSummaryText: {
		fontSize: 14,
		color: lightColors.text.secondary,
	},

	// OrderCardAction styles
	actionContainer: {
		flex: 1,
		minHeight: 52,
	},
	actionButton: {
		flex: 1,
		minHeight: 52,
		borderRadius: 6,
	},
    actionButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
	actionButtonIcon: {
		width: 16,
		height: 16,
	},

	// OrderCard styles
	card: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 20,
		padding: spacing.s4,
		marginBottom: spacing.s3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.03,
		shadowRadius: 8,
		elevation: 1,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	cardHeaderLeft: {
		flex: 1,
		gap: 4,
	},
	cardReference: {
		fontSize: 15,
		fontWeight: '700',
		color: lightColors.text.primary,
	},
	cardDate: {
		fontSize: 12,
		color: lightColors.text.secondary,
	},
	statusPill: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		paddingHorizontal: spacing.s1,
		paddingVertical: spacing.s0,
		borderRadius: 4,
		borderWidth: 1,
	},
	statusPillLabel: {
		fontSize: 12,
		fontWeight: '700',
	},
	statusPillWarning: {
		backgroundColor: '#FEF3E8',
		borderColor: '#FCD7AA',
	},
	statusPillInfo: {
		backgroundColor: '#EAF5FF',
		borderColor: '#BFDBFE',
	},
	statusPillSuccess: {
		backgroundColor: '#ECFDF3',
		borderColor: '#BBF7D0',
	},
	statusPillDanger: {
		backgroundColor: '#FEF2F2',
		borderColor: '#FECACA',
	},
	statusPillNeutral: {
		backgroundColor: '#F9FAFB',
		borderColor: '#E5E7EB',
	},
	cardDivider: {
		borderTopWidth: 1,
		borderTopColor: '#D1D5DB',
		borderStyle: 'dashed',
		marginVertical: spacing.s2,
	},
	cardTotalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: spacing.s1,
	},
	cardTotalLabel: {
		fontSize: 14,
		fontWeight: '700',
		color: lightColors.text.primary,
	},
	cardTotalValue: {
		fontSize: 16,
		fontWeight: '700',
		color: lightColors.primary,
	},
	cardFooter: {
		flexDirection: 'row',
		gap: spacing.s1,
	},
});
