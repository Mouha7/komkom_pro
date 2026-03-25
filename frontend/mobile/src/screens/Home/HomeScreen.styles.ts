import { StyleSheet } from 'react-native';
import { spacing } from '../../styles/spacing';
import { lightColors } from '../../styles/colors';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s4,
		paddingBottom: spacing.s6,
		rowGap: spacing.s4,
	},
	section: {
		rowGap: spacing.s2,
	},
});
