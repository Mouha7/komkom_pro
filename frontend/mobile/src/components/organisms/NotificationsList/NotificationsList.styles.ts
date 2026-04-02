import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingTop: spacing.s4,
		paddingBottom: spacing.s5,
	},
	sectionHeader: {
		fontSize: 12,
		fontWeight: '700',
		letterSpacing: 0.5,
		textTransform: 'uppercase',
		paddingHorizontal: spacing.s3,
		marginBottom: spacing.s2,
	},
	listWrap: {
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
	},
	stateContainer: {
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s5,
	},
	loadingContainer: {
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s5,
		alignItems: 'center',
	},
});