import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	sectionContainer: {
		rowGap: spacing.s2,
	},
	title: {
		flex: 1,
        fontWeight: 'bold',
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
		overflow: 'hidden',
	},
	map: {
		height: 140,
		width: '100%',
	},
	content: {
		padding: spacing.s3,
		rowGap: spacing.s2,
	},
	addressWrap: {
		rowGap: spacing.s0,
	},
	updateButton: {
		alignSelf: 'flex-start',
	},
});
