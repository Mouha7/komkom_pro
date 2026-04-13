import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 18,
		padding: spacing.s4,
		alignItems: 'center',
		rowGap: spacing.s1,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
	},
	avatarImage: {
		width: 88,
		height: 88,
		borderRadius: 44,
		marginBottom: spacing.s1,
	},
	avatarFallback: {
		width: 88,
		height: 88,
		borderRadius: 44,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: withOpacity(lightColors.primary as string, 0.16),
		marginBottom: spacing.s1,
	},
	storeName: {
		textAlign: 'center',
        fontWeight: 'bold',
	},
	ownerName: {
		textAlign: 'center',
	},
	badge: {
		marginTop: spacing.s1,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
		borderRadius: 999,
		backgroundColor: withOpacity(lightColors.success as string, 0.12),
	},
});
