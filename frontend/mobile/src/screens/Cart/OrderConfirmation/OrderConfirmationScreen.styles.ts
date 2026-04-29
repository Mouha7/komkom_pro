import { StyleSheet } from 'react-native';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		flexGrow: 1,
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s3,
		paddingBottom: spacing.s5,
	},
	mainContent: {
		flex: 1,
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: lightColors.text.primary,
		textAlign: 'center',
		marginBottom: spacing.s1,
	},
	subtitle: {
		fontSize: 15,
		color: lightColors.text.secondary,
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: spacing.s5,
		maxWidth: 280,
	},
	summarySection: {
		width: '100%',
	},
	bottomBar: {
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s2,
	},
	bottomActionGroup: {
		marginTop: 0,
		gap: spacing.s2,
	},
});
