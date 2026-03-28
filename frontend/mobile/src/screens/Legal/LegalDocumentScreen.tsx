import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBar, Text } from "../../components";
import { lightColors, withOpacity } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import type { LegalDocumentContent } from "./LegalDocuments.content";

interface LegalDocumentScreenProps {
	document: LegalDocumentContent;
	onBack: () => void;
}

export const LegalDocumentScreen: React.FC<LegalDocumentScreenProps> = ({
	document,
	onBack,
}) => {
	return (
		<SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
			<AppBar
				title={document.title}
				leftIconName="arrowLeft"
				onPressLeft={onBack}
				leftAccessibilityLabel="Retour"
			/>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.headerCard}>
					<Text
						variant="bodyLarge"
						textColorOverride={lightColors.text.secondary}
						style={styles.lastUpdatedText}
					>
						Derniere mise a jour: {document.lastUpdated}
					</Text>
					{document.intro.map((paragraph) => (
						<Text
							key={paragraph}
							variant="bodyLarge"
							textColorOverride={lightColors.text.primary}
							style={styles.introText}
						>
							{paragraph}
						</Text>
					))}
				</View>

				{document.sections.map((section) => (
					<View key={section.title} style={styles.sectionCard}>
						<Text
							variant="h3"
							textColorOverride={lightColors.text.primary}
							style={styles.sectionTitle}
						>
							{section.title}
						</Text>
						{section.paragraphs.map((paragraph) => (
							<Text
								key={section.title + paragraph}
								variant="bodyLarge"
								textColorOverride={lightColors.text.secondary}
								style={styles.sectionParagraph}
							>
								{paragraph}
							</Text>
						))}
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#F4F5F7",
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		paddingBottom: spacing.s5,
		rowGap: spacing.s3,
	},
	headerCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: spacing.s3,
		borderWidth: 1,
		borderColor: withOpacity(lightColors.primary, 0.18),
		rowGap: spacing.s2,
	},
	lastUpdatedText: {
		fontSize: 12,
		fontWeight: "600",
	},
	introText: {
		fontSize: 14,
		lineHeight: 20,
	},
	sectionCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: spacing.s3,
		rowGap: spacing.s2,
		shadowColor: withOpacity("#000000", 0.08),
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 1,
		shadowRadius: 6,
		elevation: 1,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "700",
	},
	sectionParagraph: {
		fontSize: 14,
		lineHeight: 20,
	},
});
