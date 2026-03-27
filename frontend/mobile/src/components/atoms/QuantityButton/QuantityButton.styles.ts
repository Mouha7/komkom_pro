import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';

export const styles = StyleSheet.create({
	button: {
		width: 35,
		height: 35,
		borderRadius: 50,
		backgroundColor: lightColors.surface.default,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: withOpacity('#000000', 0.14),
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 1,
		shadowRadius: 12,
		elevation: 4,
	},
	pressed: {
		opacity: 0.85,
		transform: [{ scale: 0.98 }],
	},
	disabled: {
		opacity: 0.55,
	},
});