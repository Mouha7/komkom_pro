import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: spacing.s2,
		paddingHorizontal: spacing.s3,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 12,
		backgroundColor: lightColors.surface.default,
		marginTop: spacing.s2,
		shadowColor: '#000000',
		shadowOpacity: 0.03,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 1,
	},
	profileWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		flex: 1,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.background.subtle,
	},
	avatarFallback: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	labelWrap: {
		rowGap: 2,
	},
	callButton: {
		backgroundColor: lightColors.primaryLight,
		borderColor: withOpacity(lightColors.primaryDark, 0.12),
		borderWidth: 1,
	},
});
