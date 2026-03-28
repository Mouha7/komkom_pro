import React from "react";
import { View } from "react-native";

import { Icon, Text } from "../../../components";
import { lightColors, withOpacity } from "../../../styles/colors";
import type { PasswordStrength } from "./SignupScreen.types";
import { styles } from "./SignupScreen.styles";

interface PasswordStrengthCardProps {
	passwordStrength: PasswordStrength;
	passwordVarietyCount: number;
	passwordStrengthLabel: string;
	passwordStrengthColor: string;
}

export const PasswordStrengthCard: React.FC<PasswordStrengthCardProps> = ({
	passwordStrength,
	passwordVarietyCount,
	passwordStrengthLabel,
	passwordStrengthColor,
}) => {
	return (
		<View
			style={[
				styles.passwordStrengthContainer,
				{
					backgroundColor: withOpacity(passwordStrengthColor, 0.1),
					borderLeftColor: passwordStrengthColor,
				},
			]}
		>
			<View style={styles.strengthItem}>
				<Icon
					name="check"
					size={16}
					color={
						passwordStrength.minLength
							? lightColors.success
							: lightColors.border.default
					}
					strokeWidth={3}
				/>
				<Text
					variant="bodyLarge"
					style={styles.strengthText}
					textColorOverride={
						passwordStrength.minLength
							? lightColors.text.primary
							: lightColors.text.secondary
					}
				>
					Au moins 8 caracteres
				</Text>
			</View>
			<View style={styles.strengthItem}>
				<Icon
					name="check"
					size={16}
					color={
						passwordVarietyCount >= 2
							? lightColors.success
							: lightColors.border.default
					}
					strokeWidth={3}
				/>
				<Text
					variant="bodyLarge"
					style={styles.strengthText}
					textColorOverride={
						passwordVarietyCount >= 2
							? lightColors.text.primary
							: lightColors.text.secondary
					}
				>
					Au moins 2 types (majuscule, minuscule, chiffre, symbole)
				</Text>
			</View>
			<View style={styles.strengthItem}>
				<Icon
					name="check"
					size={16}
					color={
						passwordStrength.notCommon
							? lightColors.success
							: lightColors.border.default
					}
					strokeWidth={3}
				/>
				<Text
					variant="bodyLarge"
					style={styles.strengthText}
					textColorOverride={
						passwordStrength.notCommon
							? lightColors.text.primary
							: lightColors.text.secondary
					}
				>
					Evitez les mots de passe trop courants
				</Text>
			</View>
			<Text
				variant="bodyLarge"
				style={styles.strengthHint}
				textColorOverride={passwordStrengthColor}
			>
				Force: {passwordStrengthLabel}
				{passwordStrength.isAcceptable
					? " - Ce mot de passe est acceptable."
					: " - Continuez pour renforcer la securite."}
			</Text>
		</View>
	);
};
