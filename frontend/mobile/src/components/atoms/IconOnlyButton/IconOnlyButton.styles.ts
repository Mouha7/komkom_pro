import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	buttonBase: {
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: 'rgba(0, 0, 0, 0.8)',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		shadowOpacity: 1,
		elevation: 8,
	},
	blurLayer: {
		...StyleSheet.absoluteFillObject,
	},
	whiteOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: '#FFFFFF',
		opacity: 0.92,
	},
	disabled: {
		opacity: 0.55,
	},
});
