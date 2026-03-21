import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { fontWeights } from '../../../styles/typography';

export const styles = StyleSheet.create({
	container: {
		rowGap: spacing.s3,
	},
	listContent: {
		rowGap: spacing.s2,
		paddingBottom: spacing.s3,
	},
	emptyWrap: {
		padding: spacing.s3,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
	},
	summary: {
		padding: spacing.s3,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		rowGap: spacing.s2,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	priceRow: {
		fontSize: 14,
		fontWeight: fontWeights.bold,
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		columnGap: spacing.s1,
		width: '100%',
		alignSelf: 'stretch',
		marginVertical: spacing.s1,
		overflow: 'hidden',
	},
	dividerSegment: {
		width: 6,
		height: 1,
		borderRadius: 1,
		backgroundColor: withOpacity(lightColors.border.strong as string, 0.35),
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: fontWeights.bold,
	},
	totalAmount: {
		fontSize: 16,
		color: lightColors.primaryDark,
		fontWeight: fontWeights.bold,
	},
	loader: {
		paddingVertical: spacing.s4,
		alignItems: 'center',
	},
});
