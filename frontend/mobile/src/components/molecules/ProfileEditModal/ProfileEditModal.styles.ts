import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: withOpacity('#000000', 0.34),
		justifyContent: 'flex-end',
	},
	modal: {
		backgroundColor: lightColors.surface.default,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: spacing.s3,
		paddingBottom: spacing.s4,
		paddingHorizontal: spacing.s3,
		maxHeight: '92%',
		rowGap: spacing.s2,
	},
    labelStyle: {
        fontWeight: 'bold',
    },
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	title: {
		flex: 1,
        fontWeight: 'bold',
	},
	closeButton: {
		padding: spacing.s1,
	},
	form: {
		rowGap: spacing.s2,
	},
	actions: {
		flexDirection: 'row',
		columnGap: spacing.s2,
	},
	buttonWrap: {
		flex: 1,
	},
    inputStyle: {
        marginBottom: spacing.s2,
    },
});
