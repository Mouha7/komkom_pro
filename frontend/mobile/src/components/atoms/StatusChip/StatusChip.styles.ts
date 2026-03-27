import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const styles = StyleSheet.create({
	base: {
		alignSelf: 'flex-start',
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
		borderRadius: 999,
		borderWidth: 1,
	},
	sizeSm: {
		paddingHorizontal: spacing.s1,
		paddingVertical: 2,
	},
	sizeMd: {
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
	},
	sizeLg: {
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s2,
	},
	compact: {
		paddingHorizontal: spacing.s1,
		paddingVertical: 2,
	},
	label: {
		...typography.small,
		fontWeight: '600',
	},
	toneSuccess: {
		backgroundColor: withOpacity(lightColors.success, 0.12),
		borderColor: withOpacity(lightColors.success, 0.35),
	},
	toneDanger: {
		backgroundColor: withOpacity(lightColors.danger, 0.12),
		borderColor: withOpacity(lightColors.danger, 0.35),
	},
	toneWarning: {
		backgroundColor: withOpacity(lightColors.warning, 0.15),
		borderColor: withOpacity(lightColors.warning, 0.35),
	},
	toneInfo: {
		backgroundColor: withOpacity(lightColors.info, 0.14),
		borderColor: withOpacity(lightColors.info, 0.35),
	},
	toneNeutral: {
		backgroundColor: lightColors.background.subtle,
		borderColor: lightColors.border.default,
	},
	toneSolidSuccess: {
		backgroundColor: lightColors.success,
		borderColor: lightColors.success,
	},
	toneSolidDanger: {
		backgroundColor: lightColors.danger,
		borderColor: lightColors.danger,
	},
	toneSolidWarning: {
		backgroundColor: lightColors.warning,
		borderColor: lightColors.warning,
	},
	toneSolidInfo: {
		backgroundColor: lightColors.info,
		borderColor: lightColors.info,
	},
	toneSolidNeutral: {
		backgroundColor: lightColors.neutral700,
		borderColor: lightColors.neutral700,
	},
	textSuccess: { color: lightColors.success },
	textDanger: { color: lightColors.danger },
	textWarning: { color: lightColors.warning },
	textInfo: { color: lightColors.info },
	textNeutral: { color: lightColors.text.secondary },
	textOnSolid: { color: lightColors.text.onPrimary },
});
