import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const SUPPORT_ACTION_BAR_HEIGHT = 52;

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
	separator: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 1,
		backgroundColor: withOpacity(lightColors.neutral700, 0.08),
	},
	actionsRow: {
		flexDirection: 'row',
		columnGap: spacing.s1,
	},
	callButton: {
		flex: 1,
		minHeight: SUPPORT_ACTION_BAR_HEIGHT,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
	},
	chatButton: {
		flex: 1,
		minHeight: SUPPORT_ACTION_BAR_HEIGHT,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.primary,
		backgroundColor: lightColors.primary,
	},
	callText: {
		fontWeight: '700',
		color: lightColors.text.primary,
	},
	chatText: {
		fontWeight: '700',
		color: lightColors.text.onPrimary,
	},
});