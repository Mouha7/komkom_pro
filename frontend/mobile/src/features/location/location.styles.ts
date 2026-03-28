import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

export const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: withOpacity('#000000', 0.28),
		justifyContent: 'center',
	},
	modalWrapper: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s4,
	},
	locationModalCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		width: '100%',
		maxWidth: 620,
		alignSelf: 'center',
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s3,
		paddingBottom: spacing.s4,
		rowGap: spacing.s2,
		maxHeight: '88%',
	},
	locationModalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	labelStyle: {
		fontSize: 14,
		fontWeight: '700',
	},
	locationActionsRow: {
		flexDirection: 'row',
		columnGap: spacing.s2,
	},
	locationActionButton: {
		flex: 1,
		minHeight: 46,
	},
	mapContainer: {
		height: 240,
		borderRadius: 12,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: withOpacity(lightColors.primary, 0.04),
	},
	map: {
		flex: 1,
	},
	mapLoadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: withOpacity('#FFFFFF', 0.55),
		alignItems: 'center',
		justifyContent: 'center',
	},
	locationSelectedAddress: {
		fontSize: 13,
		lineHeight: 18,
	},
	locationFeedbackText: {
		fontSize: 12,
		lineHeight: 16,
	},
});
