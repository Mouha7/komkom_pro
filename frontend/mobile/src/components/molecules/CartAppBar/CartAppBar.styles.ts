import { StyleSheet } from 'react-native';

import { spacing } from '../../../styles/spacing';

export const CART_APP_BAR_BUTTON_SIZE = 54;

export const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent',
		paddingHorizontal: spacing.s3,
		paddingBottom: spacing.s2,
	},
	content: {
		minHeight: CART_APP_BAR_BUTTON_SIZE,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	titleWrap: {
		position: 'absolute',
		left: CART_APP_BAR_BUTTON_SIZE + spacing.s3,
		right: CART_APP_BAR_BUTTON_SIZE + spacing.s3,
		alignItems: 'center',
		justifyContent: 'center',
		pointerEvents: 'none',
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
	},
});
