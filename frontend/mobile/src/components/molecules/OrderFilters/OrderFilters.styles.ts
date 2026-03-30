import { StyleSheet } from 'react-native';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	// OrderFilterChip styles
	chipContainer: {
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s1,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		justifyContent: 'center',
		alignItems: 'center',
	},
	chipContainerActive: {
		backgroundColor: lightColors.primary,
		borderColor: lightColors.primary,
	},
	chipLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: lightColors.text.secondary,
	},
	chipLabelActive: {
		color: '#FFFFFF',
	},

	// OrderFiltersBar styles
	barContainer: {
		paddingHorizontal: spacing.s4,
		paddingVertical: spacing.s2,
        backgroundColor: lightColors.surface.default,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	scrollContent: {
		gap: spacing.s2,
	},
});
