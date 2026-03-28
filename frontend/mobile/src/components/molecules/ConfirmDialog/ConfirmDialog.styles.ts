import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: withOpacity(lightColors.neutral900, 0.45),
		justifyContent: 'center',
		paddingHorizontal: spacing.s3,
	},
	container: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		padding: spacing.s4,
		rowGap: spacing.s3,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	iconWrap: {
		width: 44,
		height: 44,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconWrapDanger: {
		backgroundColor: withOpacity(lightColors.danger, 0.14),
	},
	iconWrapPrimary: {
		backgroundColor: withOpacity(lightColors.primary, 0.14),
	},
	body: {
		rowGap: spacing.s2,
	},
	actions: {
		flexDirection: 'row',
		columnGap: spacing.s2,
	},
	actionButton: {
		flex: 1,
	},
	confirmDanger: {
		backgroundColor: lightColors.danger,
		borderColor: lightColors.danger,
	},
	confirmLabelDanger: {
		color: lightColors.text.onPrimary,
	},
});
