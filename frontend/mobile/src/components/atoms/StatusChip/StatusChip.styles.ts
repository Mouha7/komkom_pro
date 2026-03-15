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
	textSuccess: { color: lightColors.success },
	textDanger: { color: lightColors.danger },
	textWarning: { color: lightColors.warning },
	textInfo: { color: lightColors.info },
	textNeutral: { color: lightColors.text.secondary },
});
