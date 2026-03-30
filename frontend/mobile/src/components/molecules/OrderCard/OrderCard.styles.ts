import { StyleSheet } from 'react-native';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	// OrderItemsSummary styles
	itemsSummaryContainer: {
		paddingVertical: spacing.s1,
	},
	itemsSummaryText: {
		fontSize: 14,
		lineHeight: 20,
		color: lightColors.text.secondary,
	},

	// OrderCardAction styles
	actionContainer: {
		flex: 1,
		minHeight: 36,
	},
	actionButton: {
		flex: 1,
		minHeight: 36,
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
		borderRadius: spacing.s2,
		padding: spacing.s3,
		marginBottom: spacing.s2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.02,
		shadowRadius: 4,
		elevation: 1,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: spacing.s2,
		gap: spacing.s2,
	},
	cardHeaderLeft: {
		flex: 1,
		gap: 4,
	},
	cardReference: {
		fontSize: 15,
		fontWeight: '600',
		color: lightColors.text.primary,
	},
	cardDate: {
		fontSize: 12,
		color: lightColors.text.secondary,
	},
	cardDivider: {
		height: 1,
		backgroundColor: 'rgba(209, 213, 219, 0.5)',
		marginVertical: spacing.s2,
	},
	cardBody: {
		marginBottom: spacing.s2,
	},
	cardTotalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: spacing.s1,
	},
	cardTotalLabel: {
		fontSize: 14,
		color: lightColors.text.secondary,
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
