import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: withOpacity(lightColors.neutral900, 0.45),
		justifyContent: 'flex-end',
	},
	modal: {
		backgroundColor: lightColors.surface.default,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s4,
		paddingBottom: spacing.s3,
		maxHeight: '80%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: spacing.s4,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '700',
	},
	closeButton: {
		width: 32,
		height: 32,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		rowGap: spacing.s4,
		marginBottom: spacing.s4,
	},
	section: {
		rowGap: spacing.s2,
	},
	sectionLabel: {
		fontSize: 14,
		fontWeight: '600',
	},
	priceInputsRow: {
		flexDirection: 'row',
		columnGap: spacing.s2,
	},
	priceInput: {
		flex: 1,
	},
	stockOption: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		paddingVertical: spacing.s2,
	},
	categoriesContainer: {
		rowGap: spacing.s2,
	},
	categoryOption: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		paddingVertical: spacing.s2,
	},
	actions: {
		flexDirection: 'row',
		columnGap: spacing.s2,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingTop: spacing.s3,
	},
	actionButton: {
		flex: 1,
	},
});
