import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const ACTION_BUTTON_HEIGHT = 52;

export const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: lightColors.surface.default,
		paddingHorizontal: spacing.s3 + spacing.s0,
		paddingTop: spacing.s2,
		shadowColor: '#000000',
		shadowOpacity: 0.08,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: -4 },
		elevation: 10,
	},
	actionsRow: {
		flexDirection: 'row',
		columnGap: spacing.s1,
	},
	supportButton: {
		flex: 1,
		minHeight: ACTION_BUTTON_HEIGHT,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
	},
	confirmButton: {
		flex: 2,
		minHeight: ACTION_BUTTON_HEIGHT,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: lightColors.primary,
		backgroundColor: lightColors.primary,
	},
	supportText: {
        fontWeight: 'bold',
		color: lightColors.text.primary,
	},
	confirmText: {
        fontWeight: 'bold',
		color: lightColors.text.onPrimary,
	},
	separator: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 1,
		backgroundColor: withOpacity(lightColors.neutral700, 0.08),
	},
});
