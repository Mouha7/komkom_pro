import React from "react";
import { Pressable, View } from "react-native";

import { Icon, Text } from "../../../components";
import { lightColors } from "../../../styles/colors";
import { styles } from "./SignupScreen.styles";

interface SignupLegalConsentProps {
	acceptedTerms: boolean;
	onToggleAcceptedTerms: () => void;
	onOpenTermsOfUse: () => void;
	onOpenPrivacyPolicy: () => void;
}

export const SignupLegalConsent: React.FC<SignupLegalConsentProps> = ({
	acceptedTerms,
	onToggleAcceptedTerms,
	onOpenTermsOfUse,
	onOpenPrivacyPolicy,
}) => {
	return (
		<View
			style={[
				styles.checkboxRow,
				acceptedTerms && styles.checkboxRowChecked,
			]}
		>
			<Pressable
				onPress={onToggleAcceptedTerms}
				accessibilityRole="checkbox"
				accessibilityState={{ checked: acceptedTerms }}
				accessibilityLabel="Accepter les conditions d'utilisation"
				hitSlop={8}
			>
				<View
					style={[
						styles.checkbox,
						acceptedTerms && styles.checkboxChecked,
					]}
				>
					{acceptedTerms ? (
						<Icon
							name="check"
							size={16}
							color="#FFFFFF"
							strokeWidth={3}
						/>
					) : null}
				</View>
			</Pressable>

			<Text
				variant="bodyLarge"
				style={styles.checkboxText}
				textColorOverride={lightColors.text.secondary}
			>
				J'accepte les{" "}
				<Text
					variant="bodyLarge"
					textColorOverride={lightColors.primary}
					style={styles.legalInlineLinkText}
					onPress={onOpenTermsOfUse}
					accessibilityRole="button"
					accessibilityLabel="Ouvrir les conditions d'utilisation"
				>
					conditions d'utilisation
				</Text>{" "}
				et la{" "}
				<Text
					variant="bodyLarge"
					textColorOverride={lightColors.primary}
					style={styles.legalInlineLinkText}
					onPress={onOpenPrivacyPolicy}
					accessibilityRole="button"
					accessibilityLabel="Ouvrir la politique de confidentialité"
				>
					politique de confidentialité
				</Text>
				.
			</Text>
		</View>
	);
};
