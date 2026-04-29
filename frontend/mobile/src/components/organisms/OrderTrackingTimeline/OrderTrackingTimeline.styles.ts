import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		paddingVertical: spacing.s4,
		paddingHorizontal: spacing.s3 + spacing.s0,
	},
	stepRow: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingBottom: spacing.s3,
	},
	stepRowLast: {
		paddingBottom: 0,
	},
	stepIndicatorColumn: {
		alignItems: 'center',
		marginRight: spacing.s2,
	},
	dotBase: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
	},
	dotDone: {
		backgroundColor: lightColors.success,
		borderColor: lightColors.success,
	},
	dotCurrent: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 3,
		borderColor: lightColors.primary,
		shadowColor: lightColors.primary,
		shadowOpacity: 0.2,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 1 },
		elevation: 2,
	},
	dotCurrentInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: lightColors.primary,
	},
	dotPending: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: withOpacity(lightColors.neutral700, 0.05),
		borderColor: lightColors.border.default,
		borderWidth: 2,
		marginVertical: 6,
		marginLeft: 6,
	},
	connector: {
		width: 2,
		flex: 1,
		minHeight: spacing.s2,
		borderRadius: 1,
	},
	connectorDone: {
		backgroundColor: lightColors.success,
	},
	connectorCurrent: {
		backgroundColor: lightColors.primary,
	},
	connectorUpcoming: {
		backgroundColor: withOpacity(lightColors.neutral700, 0.14),
	},
	stepContent: {
		flex: 1,
		paddingTop: spacing.s0,
		paddingBottom: spacing.s2,
		gap: spacing.s0,
	},
	stepDescription: {
		marginTop: spacing.s0,
	},
	pendingTitle: {
		color: lightColors.text.secondary,
	},
	pendingTime: {
		color: lightColors.text.secondary,
	},
});
