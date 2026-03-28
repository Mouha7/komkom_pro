import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const APP_BAR_ACTION_SIZE = 44;

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	content: {
		minHeight: 56,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s1,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	sideSlot: {
		width: APP_BAR_ACTION_SIZE,
		height: APP_BAR_ACTION_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sideButton: {
		width: APP_BAR_ACTION_SIZE,
		height: APP_BAR_ACTION_SIZE,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sideButtonPressed: {
		opacity: 0.7,
	},
	titleWrap: {
		flex: 1,
	},
	titleCenter: {
		textAlign: 'center',
	},
	titleLeft: {
		textAlign: 'left',
	},
	rightActions: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
	},
});
