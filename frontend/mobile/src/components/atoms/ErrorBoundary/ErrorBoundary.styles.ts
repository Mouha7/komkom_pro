import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: lightColors.background.default,
		paddingHorizontal: spacing.s4,
		paddingVertical: spacing.s6,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: spacing.s3,
	},
	title: {
		textAlign: 'center',
	},
	message: {
		textAlign: 'center',
	},
	detail: {
		textAlign: 'center',
	},
	button: {
		alignSelf: 'stretch',
	},
});
