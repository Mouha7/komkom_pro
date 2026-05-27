import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: withOpacity(lightColors.primary as string, 0.08),
		borderRadius: 16,
		borderWidth: 1,
		borderColor: withOpacity(lightColors.primary as string, 0.2),
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.s4,
		paddingVertical: spacing.s4,
		rowGap: spacing.s2,
	},
	pinWrap: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: lightColors.surface.default,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: withOpacity(lightColors.primary as string, 0.3),
	},
	addressText: {
		textAlign: 'center',
	},
	coordsText: {
		textAlign: 'center',
	},
	openMapsButton: {
		marginTop: spacing.s1,
	},
});
