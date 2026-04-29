import { StyleSheet } from 'react-native';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s3,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: spacing.s4,
	},
	emptyStateCard: {
		marginTop: spacing.s4,
	},
	emptyText: {
		fontSize: 16,
		color: lightColors.text.secondary,
		textAlign: 'center',
	},
});
