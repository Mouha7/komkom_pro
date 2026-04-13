import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const ACTION_SIZE = 44;

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	content: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s2,
		paddingBottom: spacing.s3,
		rowGap: spacing.s1,
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	titleContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.s2,
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: lightColors.text.primary,
		textAlign: 'center',
	},
	actionSpacer: {
		width: ACTION_SIZE,
		height: ACTION_SIZE,
	},
	actionButton: {
		width: ACTION_SIZE,
		height: ACTION_SIZE,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: lightColors.surface.default,
	},
	actionButtonPressed: {
		backgroundColor: withOpacity(lightColors.primary as string, 0.08),
	},
	searchInputContainer: {
		backgroundColor: lightColors.neutral100,
		borderRadius: 14,
		borderColor: withOpacity(lightColors.border.default as string, 0.9),
		paddingHorizontal: spacing.s3,
		minHeight: 52,
	},
});
