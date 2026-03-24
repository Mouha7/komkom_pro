import React, { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button, Icon, IconOnlyButton, Input, Text } from "../../components";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { lightColors } from "../../styles/colors";
import {
	SENEGAL_COUNTRY_CODE,
	SENEGAL_LOCAL_DIGITS,
} from "./Signup/SignupScreen.constants";
import {
	evaluatePasswordStrength,
	formatSenegalLocalNumber,
} from "./Signup/SignupScreen.helpers";
import { LocationPickerModal } from "./Signup/LocationPickerModal";
import { PasswordStrengthCard } from "./Signup/PasswordStrengthCard";
import { styles } from "./Signup/SignupScreen.styles";
import { useSignupLocation } from "./Signup/useSignupLocation";

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);
	const [password, setPassword] = useState("");
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [phoneLocalNumber, setPhoneLocalNumber] = useState("");

	const storeNameInputRef = useRef<TextInput>(null);
	const ownerNameInputRef = useRef<TextInput>(null);
	const phoneInputRef = useRef<TextInput>(null);
	const emailInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const {
		storeLocation,
		isLocationModalVisible,
		locationQuery,
		draftAddress,
		draftCoordinates,
		draftRegion,
		isResolvingLocation,
		locationFeedback,
		locationTouched,
		hasStoreLocation,
		openLocationModal,
		closeLocationModal,
		handleUseCurrentLocation,
		handleSearchLocation,
		handleLocationQueryChange,
		handleConfirmLocation,
		handleMapCoordinatePick,
		handleDraftRegionChange,
		markLocationAsRequired,
	} = useSignupLocation();

	const passwordStrength = evaluatePasswordStrength(password);
	const passwordVarietyCount = [
		passwordStrength.hasLowercase,
		passwordStrength.hasUppercase,
		passwordStrength.hasNumber,
		passwordStrength.hasSymbol,
	].filter(Boolean).length;

	const isFormReadyForSubmission =
		acceptedTerms && passwordStrength.isAcceptable;
	const canCreateAccount = isFormReadyForSubmission && hasStoreLocation;
	const passwordStrengthLabel =
		passwordStrength.level === "strong"
			? "Fort"
			: passwordStrength.level === "medium"
				? "Moyen"
				: "Faible";
	const passwordStrengthColor =
		passwordStrength.level === "strong"
			? lightColors.success
			: passwordStrength.level === "medium"
				? lightColors.warning
				: lightColors.danger;

	const handlePhoneNumberChange = (rawValue: string) => {
		const digitsOnly = rawValue
			.replace(/\D/g, "")
			.slice(0, SENEGAL_LOCAL_DIGITS);
		setPhoneLocalNumber(digitsOnly);
	};

	const handleCreateAccountPress = () => {
		if (!hasStoreLocation) {
			markLocationAsRequired();
			return;
		}

		if (!canCreateAccount) {
			return;
		}

		navigation.navigate("UIStateLibrary");
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.container}>
					<IconOnlyButton
						iconName="arrowLeft"
						onPress={() => navigation.goBack()}
						accessibilityLabel="Retour"
						containerStyle={styles.backButton}
					/>

					<View style={styles.headerBlock}>
						<View style={styles.brandMark}>
							<Icon
								name="hammer"
								size={32}
								color={lightColors.text.onPrimary}
								strokeWidth={2.5}
							/>
						</View>
						<Text
							variant="h1"
							align="center"
							textColorOverride={lightColors.text.primary}
						>
							Créer un compte
						</Text>
						<Text
							variant="bodyLarge"
							align="center"
							textColorOverride={lightColors.text.secondary}
						>
							Inscrivez votre quincaillerie sur KomKom pour
							commander plus vite et suivre vos livraisons en
							temps réel.
						</Text>
					</View>

					<View style={styles.formCard}>
						<Text
							variant="h3"
							textColorOverride={lightColors.text.primary}
							style={styles.sectionTitle}
						>
							Informations du magasin
						</Text>
						<Text
							variant="bodyLarge"
							textColorOverride={lightColors.text.secondary}
							style={styles.sectionDescription}
						>
							Renseignez les données principales pour démarrer
							votre espace pro.
						</Text>

						<Input
							label="Nom du magasin"
							labelVariant="button"
							labelStyle={styles.labelStyle}
							placeholder="Quincaillerie Ndiaye & Fils"
							returnKeyType="next"
							blurOnSubmit={false}
							onSubmitEditing={() =>
								ownerNameInputRef.current?.focus()
							}
							inputRef={storeNameInputRef}
							leftElement={
								<Icon
									name="building2"
									size={20}
									color={lightColors.text.secondary}
								/>
							}
						/>

						<Input
							label="Nom du responsable"
							labelVariant="button"
							labelStyle={styles.labelStyle}
							placeholder="Aminata Ndiaye"
							returnKeyType="next"
							blurOnSubmit={false}
							onSubmitEditing={() =>
								phoneInputRef.current?.focus()
							}
							inputRef={ownerNameInputRef}
							leftElement={
								<Icon
									name="user"
									size={20}
									color={lightColors.text.secondary}
								/>
							}
						/>

						<Input
							label="Téléphone professionnel"
							labelVariant="button"
							labelStyle={styles.labelStyle}
							placeholder="77 123 45 67"
							keyboardType="phone-pad"
							textContentType="telephoneNumber"
							autoComplete="tel"
							returnKeyType="next"
							blurOnSubmit={false}
							value={formatSenegalLocalNumber(phoneLocalNumber)}
							onChangeText={handlePhoneNumberChange}
							maxLength={12}
							onSubmitEditing={() =>
								emailInputRef.current?.focus()
							}
							inputRef={phoneInputRef}
							leftElement={
								<View style={styles.phonePrefixContainer}>
									<Text
										variant="bodyLarge"
										style={styles.phonePrefixText}
									>
										{SENEGAL_COUNTRY_CODE}
									</Text>
								</View>
							}
						/>

						<Input
							label="Email"
							labelVariant="button"
							labelStyle={styles.labelStyle}
							placeholder="contact@ndiaye-pro.sn"
							autoCapitalize="none"
							autoCorrect={false}
							keyboardType="email-address"
							returnKeyType="next"
							blurOnSubmit={false}
							onSubmitEditing={() =>
								passwordInputRef.current?.focus()
							}
							inputRef={emailInputRef}
							leftElement={
								<Icon
									name="mail"
									size={20}
									color={lightColors.text.secondary}
								/>
							}
						/>

						<Input
							label="Mot de passe"
							labelVariant="button"
							labelStyle={styles.labelStyle}
							placeholder="••••••••••••••"
							secureTextEntry={isPasswordHidden}
							textContentType="newPassword"
							autoCapitalize="none"
							autoCorrect={false}
							value={password}
							returnKeyType="done"
							onSubmitEditing={() =>
								passwordInputRef.current?.blur()
							}
							onChangeText={setPassword}
							inputRef={passwordInputRef}
							leftElement={
								<Icon
									name="lock"
									size={20}
									color={lightColors.text.secondary}
								/>
							}
							rightElement={
								<Pressable
									onPress={() =>
										setIsPasswordHidden(
											(current) => !current,
										)
									}
									hitSlop={10}
									accessibilityRole="button"
									accessibilityLabel={
										isPasswordHidden
											? "Afficher le mot de passe"
											: "Masquer le mot de passe"
									}
								>
									<Icon
										name={
											isPasswordHidden ? "eyeOff" : "eye"
										}
										size={20}
										color={lightColors.text.secondary}
									/>
								</Pressable>
							}
						/>

						<PasswordStrengthCard
							passwordStrength={passwordStrength}
							passwordVarietyCount={passwordVarietyCount}
							passwordStrengthLabel={passwordStrengthLabel}
							passwordStrengthColor={passwordStrengthColor}
						/>

						<Input
							label="Adresse du magasin"
							labelVariant="button"
							labelStyle={styles.labelStyle}
							placeholder="Choisir votre position GPS"
							value={storeLocation?.address ?? ""}
							editable={false}
							rightElement={
								<Pressable
									onPress={openLocationModal}
									hitSlop={10}
									accessibilityRole="button"
									accessibilityLabel="Localiser"
								>
									<Icon
										name="mapPin"
										size={20}
										color={lightColors.primary}
									/>
								</Pressable>
							}
							leftElement={
								<Icon
									name="mapPin"
									size={20}
									color={lightColors.text.secondary}
								/>
							}
						/>
						<Pressable
							onPress={openLocationModal}
							style={styles.locationPickerButton}
							accessibilityRole="button"
							accessibilityLabel="Choisir la position du magasin"
						>
							<Text
								variant="bodyLarge"
								textColorOverride={lightColors.primary}
								style={styles.locationPickerButtonText}
							>
								{storeLocation
									? "Modifier la position sur la carte"
									: "Choisir la position sur la carte"}
							</Text>
						</Pressable>
						{locationTouched && !hasStoreLocation ? (
							<Text
								variant="bodyLarge"
								style={styles.locationErrorText}
								textColorOverride={lightColors.danger}
							>
								La position GPS est obligatoire pour créer le
								compte.
							</Text>
						) : null}
						<Text
							variant="bodyLarge"
							style={styles.addressHint}
							textColorOverride={lightColors.text.secondary}
						>
							Votre position aide à calculer les frais et délais
							de livraison.
						</Text>

						<Pressable
							style={[
								styles.checkboxRow,
								acceptedTerms && styles.checkboxRowChecked,
							]}
							onPress={() =>
								setAcceptedTerms((current) => !current)
							}
							accessibilityRole="checkbox"
							accessibilityState={{ checked: acceptedTerms }}
							accessibilityLabel="Accepter les conditions d'utilisation"
						>
							<View
								style={[
									styles.checkbox,
									acceptedTerms && styles.checkboxChecked,
								]}
							>
								{acceptedTerms && (
									<Icon
										name="check"
										size={16}
										color="#FFFFFF"
										strokeWidth={3}
									/>
								)}
							</View>
							<Text
								variant="bodyLarge"
								style={styles.checkboxText}
								textColorOverride={lightColors.text.secondary}
							>
								J'accepte les{" "}
								<Text
									variant="bodyLarge"
									textColorOverride={lightColors.primary}
									style={{ fontSize: 12, fontWeight: "700" }}
								>
									conditions d'utilisation
								</Text>{" "}
								et la{" "}
								<Text
									variant="bodyLarge"
									textColorOverride={lightColors.primary}
									style={{ fontSize: 12, fontWeight: "700" }}
								>
									politique de confidentialité
								</Text>
								.
							</Text>
						</Pressable>

						<Button
							title="Créer mon compte"
							disabled={!isFormReadyForSubmission}
							onPress={handleCreateAccountPress}
							containerStyle={styles.createButton}
							textStyle={{
								color: "#FFFFFF",
								fontWeight: "700",
								fontSize: 15,
							}}
						/>

						<View style={styles.separatorRow}>
							<View style={styles.separatorLine} />
							<Text
								variant="h3"
								align="center"
								style={styles.separatorText}
								textColorOverride={lightColors.text.secondary}
							>
								DÉJÀ INSCRIT ?
							</Text>
							<View style={styles.separatorLine} />
						</View>

						<Button
							title="Se connecter à mon espace"
							variant="secondary"
							onPress={() => navigation.navigate("Login")}
							containerStyle={styles.signInButton}
							textStyle={{
								color: lightColors.neutral900,
								fontWeight: "700",
								fontSize: 15,
							}}
						/>
					</View>

					<View style={styles.securityRow}>
						<Icon
							name="shieldCheck"
							size={16}
							color={lightColors.success}
						/>
						<Text
							variant="bodyLarge"
							style={styles.securityText}
							textColorOverride={lightColors.text.secondary}
						>
							Création sécurisée via KomKom Identity
						</Text>
					</View>
				</View>
			</ScrollView>

			<LocationPickerModal
				visible={isLocationModalVisible}
				locationQuery={locationQuery}
				draftAddress={draftAddress}
				draftCoordinates={draftCoordinates}
				draftRegion={draftRegion}
				isResolvingLocation={isResolvingLocation}
				locationFeedback={locationFeedback}
				onClose={closeLocationModal}
				onSearch={handleSearchLocation}
				onQueryChange={handleLocationQueryChange}
				onUseCurrentLocation={handleUseCurrentLocation}
				onConfirmLocation={handleConfirmLocation}
				onMapPress={handleMapCoordinatePick}
				onRegionChangeComplete={handleDraftRegionChange}
			/>
		</SafeAreaView>
	);
};

export default SignupScreen;
