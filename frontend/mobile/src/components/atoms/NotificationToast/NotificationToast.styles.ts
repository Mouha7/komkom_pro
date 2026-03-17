import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 12,
		paddingVertical: spacing.s3,
		paddingRight: spacing.s3,
		paddingLeft: spacing.s4,
		flexDirection: 'row',
		alignItems: 'flex-start',
		columnGap: spacing.s2,
		shadowColor: '#000000',
		shadowOpacity: 0.06,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 1,
	},
	content: {
		flex: 1,
		rowGap: spacing.s1,
	},
	titleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	closeButton: {
		width: 26,
		height: 26,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 13,
	},
	closeButtonPressed: {
		opacity: 0.7,
	},
	accent: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 4,
		borderTopLeftRadius: 12,
		borderBottomLeftRadius: 12,
	},
	toneSuccess: {
		backgroundColor: lightColors.success,
	},
	toneWarning: {
		backgroundColor: lightColors.warning,
	},
	toneDanger: {
		backgroundColor: lightColors.danger,
	},
	toneInfo: {
		backgroundColor: lightColors.info,
	},
	iconWrap: {
		width: 22,
		height: 22,
		borderRadius: 11,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconSuccess: {
		backgroundColor: withOpacity(lightColors.success, 0.12),
	},
	iconWarning: {
		backgroundColor: withOpacity(lightColors.warning, 0.15),
	},
	iconDanger: {
		backgroundColor: withOpacity(lightColors.danger, 0.12),
	},
	iconInfo: {
		backgroundColor: withOpacity(lightColors.info, 0.14),
	},
	iconText: {
		fontWeight: '700',
	},
});
