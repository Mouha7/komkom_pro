import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

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
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
	},
	summary: {
		padding: spacing.s3,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: withOpacity(lightColors.primaryLight, 0.35),
		rowGap: spacing.s2,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	loader: {
		paddingVertical: spacing.s4,
		alignItems: 'center',
	},
});
