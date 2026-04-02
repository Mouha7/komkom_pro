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