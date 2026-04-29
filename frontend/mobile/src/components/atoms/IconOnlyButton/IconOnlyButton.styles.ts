import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	buttonBase: {
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 10,
		shadowOpacity: 0.18,
		elevation: 6,
	},
	surfaceLayer: {
		...StyleSheet.absoluteFillObject,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: 'rgba(15, 23, 36, 0.08)',
	},
	blurLayer: {
		...StyleSheet.absoluteFillObject,
	},
	surfaceTint: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: '#FFFFFF',
		opacity: 0.72,
	},
	disabled: {
		opacity: 0.55,
	},
});
