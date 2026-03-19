import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		overflow: 'hidden',
	},
	placeholderBase: {
		overflow: 'hidden',
		backgroundColor: withOpacity(lightColors.neutral300, 0.62),
	},
	placeholderShimmer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		width: '42%',
		backgroundColor: withOpacity(lightColors.surface.default, 0.5),
	},
	
	portraitWrap: {
		padding: spacing.s2,
		rowGap: spacing.s2,
	},
	portraitImage: {
		width: '100%',
		height: 150,
	},
	portraitContent: {
		rowGap: spacing.s1,
	},
	portraitTitle: {
		height: 20,
		borderRadius: 6,
		width: '82%',
	},
	portraitSubtitle: {
		height: 14,
		borderRadius: 6,
		width: '52%',
	},
	portraitPriceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	portraitPrice: {
		height: 22,
		borderRadius: 6,
		width: '36%',
	},
	portraitButton: {
		width: 56,
		height: 56,
		borderRadius: 12,
	},
	
	landscapeWrap: {
		flexDirection: 'row',
		columnGap: spacing.s1,
	},
	landscapeImage: {
		width: 140,
		height: 140,
		borderRightWidth: 1,
		borderColor: lightColors.border.default,
	},
	landscapeContent: {
		flex: 1,
		paddingVertical: spacing.s2,
		paddingRight: spacing.s2,
		justifyContent: 'space-between',
		rowGap: spacing.s1,
	},
	landscapeHeader: {
		rowGap: spacing.s1,
	},
	landscapeTitle: {
		height: 20,
		borderRadius: 6,
		width: '88%',
	},
	landscapeSubtitle: {
		height: 14,
		borderRadius: 6,
		width: '58%',
	},
	landscapeBottom: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		columnGap: spacing.s2,
	},
	landscapePrice: {
		height: 22,
		borderRadius: 6,
		width: '42%',
	},
	landscapeButton: {
		width: 56,
		height: 56,
		borderRadius: 12,
	},
});
