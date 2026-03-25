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
		minHeight: 96,
		paddingHorizontal: spacing.s4,
		paddingBottom: spacing.s2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		columnGap: spacing.s3,
	},
	leftSection: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	avatarButton: {
		width: 44,
		height: 44,
		borderRadius: 12,
		overflow: 'hidden',
		backgroundColor: withOpacity(lightColors.primary, 0.18),
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarImage: {
		width: '100%',
		height: '100%',
	},
	avatarFallbackText: {
		fontSize: 20,
		fontWeight: '700',
	},
	identityBlock: {
		flex: 1,
	},
	userName: {
		fontSize: 14,
		fontWeight: '700',
	},
	storeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s0,
	},
	storeName: {
		fontSize: 12,
		fontWeight: '500',
	},
	rightSection: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	actionButton: {
		width: ACTION_SIZE,
		height: ACTION_SIZE,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	actionButtonPressed: {
		opacity: 0.72,
	},
	badge: {
		position: 'absolute',
		top: -2,
		right: -1,
		minWidth: 22,
		height: 22,
		paddingHorizontal: 6,
		borderRadius: 11,
        borderColor: lightColors.surface.default,
        borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E03131',
	},
	badgeText: {
		fontSize: 12,
		fontWeight: '700',
		lineHeight: 14,
	},
});
