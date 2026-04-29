import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		right: spacing.s4,
		bottom: spacing.s7,
		zIndex: 10,
	},
	button: {
		minHeight: 48,
		paddingHorizontal: spacing.s2,
		borderRadius: 999,
		backgroundColor: withOpacity(lightColors.primary, 0.96),
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 10,
		shadowOpacity: 0.18,
		elevation: 6,
	},
	label: {
		fontSize: 13,
		fontWeight: '700',
	},
});
