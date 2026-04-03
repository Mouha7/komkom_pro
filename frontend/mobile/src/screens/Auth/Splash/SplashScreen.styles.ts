import { StyleSheet } from 'react-native';

import { lightColors, withOpacity } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';

export const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	backgroundImage: {
		...StyleSheet.absoluteFillObject,
		width: '100%',
		height: '100%',
	},
	loaderContainer: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: spacing.s2,
	},
	loaderIconWrap: {
		width: 92,
		height: 92,
		borderRadius: 46,
		backgroundColor: withOpacity('#0F1724', 0.34),
		borderWidth: 1,
		borderColor: withOpacity('#FFFFFF', 0),
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 20,
	},
	loaderIconSpin: {
		width: 34,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
	},
	gradientLayer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '80%',
	},
	content: {
		position: 'absolute',
		left: spacing.s4,
		right: spacing.s4,
		bottom: spacing.s11,
		alignItems: 'center',
	},
	availabilityBadge: {
		position: 'absolute',
		top: spacing.s8,
		right: spacing.s4,
		zIndex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		backgroundColor: withOpacity('#FFFFFF', 0.94),
		borderRadius: 18,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
	},
	availabilityDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: lightColors.success,
	},
	brandRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		marginBottom: spacing.s2,
	},
	brandIconBox: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: lightColors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		maxWidth: 312,
	},
	subtitle: {
		maxWidth: 320,
		marginTop: spacing.s2,
	},
	primaryButton: {
		alignSelf: 'stretch',
		marginTop: spacing.s4,
		borderRadius: 8,
		minHeight: 50,
	},
	primaryButtonText: {
		color: '#FFFFFF',
		fontWeight: '700',
		fontSize: 15,
	},
	secondaryButton: {
		alignSelf: 'stretch',
		marginTop: spacing.s2,
		borderRadius: 8,
		minHeight: 50,
	},
	secondaryButtonText: {
		color: '#0F1724',
		fontWeight: '700',
		fontSize: 15,
	},
});
