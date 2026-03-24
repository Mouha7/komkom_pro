import { StyleSheet } from "react-native";

import { lightColors, withOpacity } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#EFEFF2",
	},
	scrollView: {
		flex: 1,
	},
	container: {
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		paddingBottom: spacing.s4,
	},
	backButton: {
		alignSelf: "flex-start",
	},
	headerBlock: {
		marginTop: spacing.s5,
		alignItems: "center",
		rowGap: spacing.s2,
		marginBottom: spacing.s4,
	},
	brandMark: {
		width: 72,
		height: 72,
		borderRadius: 16,
		backgroundColor: lightColors.primary,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: withOpacity("#ED762F", 0.2),
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 18,
		shadowOpacity: 1,
		elevation: 6,
	},
	formCard: {
		backgroundColor: "#F9FAFB",
		borderRadius: 8,
		padding: spacing.s4,
		rowGap: spacing.s3,
		shadowColor: withOpacity("#000000", 0.08),
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 14,
		shadowOpacity: 1,
		elevation: 2,
		marginBottom: spacing.s4,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginTop: spacing.s1,
	},
	sectionDescription: {
		fontSize: 14,
		marginBottom: spacing.s2,
	},
	labelStyle: {
		fontSize: 14,
		fontWeight: "700",
	},
	phonePrefixContainer: {
		paddingRight: spacing.s1,
		borderRightWidth: 1,
		borderRightColor: lightColors.border.default,
	},
	phonePrefixText: {
		fontWeight: "700",
		color: lightColors.text.primary,
	},
	passwordStrengthContainer: {
		backgroundColor: withOpacity(lightColors.success, 0.1),
		borderRadius: 8,
		padding: spacing.s3,
		rowGap: spacing.s2,
		borderLeftWidth: 4,
		borderLeftColor: lightColors.success,
	},
	strengthItem: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: spacing.s2,
	},
	strengthText: {
		fontSize: 13,
		flex: 1,
	},
	strengthHint: {
		fontSize: 12,
		fontWeight: "600",
		marginTop: spacing.s1,
	},
	addressHint: {
		fontSize: 12,
		marginTop: spacing.s1,
		marginBottom: spacing.s2,
	},
	locationPickerButton: {
		alignSelf: "flex-start",
		paddingVertical: spacing.s1,
		paddingHorizontal: spacing.s2,
		borderRadius: 8,
		backgroundColor: withOpacity(lightColors.primary, 0.08),
	},
	locationPickerButtonText: {
		fontSize: 12,
		fontWeight: "700",
	},
	locationErrorText: {
		fontSize: 12,
		fontWeight: "600",
		marginTop: spacing.s1,
	},
	checkboxRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		columnGap: spacing.s2,
	},
	checkboxRowChecked: {
		backgroundColor: withOpacity(lightColors.primary, 0.05),
		paddingHorizontal: spacing.s2,
		borderRadius: 8,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: lightColors.border.default,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		marginTop: spacing.s1,
		flexShrink: 0,
	},
	checkboxChecked: {
		backgroundColor: lightColors.primary,
		borderColor: lightColors.primary,
	},
	checkboxText: {
		fontSize: 12,
		flex: 1,
		lineHeight: 18,
	},
	legalInlineLinkText: {
		fontSize: 12,
		fontWeight: "700",
		textDecorationLine: "underline",
	},
	createButton: {
		minHeight: 58,
		borderRadius: 10,
		marginTop: spacing.s3,
	},
	separatorRow: {
		marginTop: spacing.s1,
		flexDirection: "row",
		alignItems: "center",
		columnGap: spacing.s2,
	},
	separatorLine: {
		flex: 1,
		height: 1,
		backgroundColor: lightColors.border.default,
	},
	separatorText: {
		fontSize: 12,
		fontWeight: "700",
	},
	signInButton: {
		minHeight: 58,
		borderRadius: 10,
	},
	securityRow: {
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		columnGap: spacing.s1,
	},
	securityText: {
		fontSize: 12,
		fontWeight: "500",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: withOpacity("#000000", 0.28),
		justifyContent: "center",
	},
	modalWrapper: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s4,
	},
	locationModalCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		width: "100%",
		maxWidth: 620,
		alignSelf: "center",
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s3,
		paddingBottom: spacing.s4,
		rowGap: spacing.s2,
		maxHeight: "88%",
	},
	locationModalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	locationActionsRow: {
		flexDirection: "row",
		columnGap: spacing.s2,
	},
	locationActionButton: {
		flex: 1,
		minHeight: 46,
	},
	mapContainer: {
		height: 240,
		borderRadius: 12,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: withOpacity(lightColors.primary, 0.04),
	},
	map: {
		flex: 1,
	},
	mapLoadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: withOpacity("#FFFFFF", 0.55),
		alignItems: "center",
		justifyContent: "center",
	},
	locationSelectedAddress: {
		fontSize: 13,
		lineHeight: 18,
	},
	locationFeedbackText: {
		fontSize: 12,
		lineHeight: 16,
	},
});
