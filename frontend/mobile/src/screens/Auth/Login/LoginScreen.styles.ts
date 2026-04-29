import { StyleSheet } from 'react-native';

import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#EFEFF2',
	},
	container: {
		flex: 1,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		paddingBottom: spacing.s4,
	},
	headerBlock: {
		marginTop: spacing.s5,
		alignItems: 'center',
		rowGap: spacing.s2,
	},
	brandMark: {
		width: 72,
		height: 72,
		borderRadius: 16,
		backgroundColor: lightColors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#ED762F',
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 18,
		shadowOpacity: 0.2,
		elevation: 6,
	},
	formCard: {
		marginTop: spacing.s4,
		backgroundColor: '#F9FAFB',
		borderRadius: 8,
		padding: spacing.s4,
		rowGap: spacing.s3,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 14,
		shadowOpacity: 0.08,
		elevation: 2,
	},
	labelStyle: {
		fontSize: 14,
		fontWeight: '700',
	},
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		columnGap: spacing.s2,
	},
	forgotPasswordText: {
		fontSize: 14,
		fontWeight: '700',
	},
	loginButton: {
		minHeight: 58,
		borderRadius: 10,
	},
	primaryButtonText: {
		color: '#FFFFFF',
		fontWeight: '700',
		fontSize: 15,
	},
	separatorRow: {
		marginTop: spacing.s1,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	separatorLine: {
		flex: 1,
		height: 1,
		backgroundColor: lightColors.border.default,
	},
	separatorText: {
		fontSize: 12,
		fontWeight: '700',
	},
	signupButton: {
		minHeight: 58,
		borderRadius: 10,
	},
	secondaryButtonText: {
		color: lightColors.neutral900,
		fontWeight: '700',
		fontSize: 15,
	},
	securityRow: {
		marginTop: 'auto',
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
	},
	securityText: {
		fontSize: 12,
		fontWeight: '500',
	},
});
