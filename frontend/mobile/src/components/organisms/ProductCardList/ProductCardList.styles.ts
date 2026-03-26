import { StyleSheet } from 'react-native';

import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	container: {
		rowGap: spacing.s2,
	},
	list: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		rowGap: spacing.s3,
	},
	listLandscape: {
		flexDirection: 'column',
		flexWrap: 'nowrap',
	},
	card: {},
});
