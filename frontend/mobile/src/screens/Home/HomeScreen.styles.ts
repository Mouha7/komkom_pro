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
		paddingBottom: spacing.s5,
	},
	heroCard: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		padding: spacing.s4,
		rowGap: spacing.s2,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
		marginBottom: spacing.s4,
	},
	heroIconWrap: {
		width: 52,
		height: 52,
		borderRadius: 14,
		backgroundColor: lightColors.primary + '10',
		justifyContent: 'center',
		alignItems: 'center',
	},
	sectionCard: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		padding: spacing.s4,
		rowGap: spacing.s2,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
		marginBottom: spacing.s4,
	},
	actionButton: {
		marginBottom: spacing.s3,
	},
	logoutRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		paddingVertical: spacing.s1,
	},
});
