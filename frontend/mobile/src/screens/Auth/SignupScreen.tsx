import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import type { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import MapView, { Marker, type Region } from "react-native-maps";

import { Button, Icon, IconOnlyButton, Input, Text } from "../../components";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { lightColors, withOpacity } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import {
	type DebounceMode,
	createGeocodingCacheService,
	isDebouncedRequestCancelledError,
} from "../../utils/geocodingCache";

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, "Signup">;

interface PasswordStrength {
	minLength: boolean;
	hasLowercase: boolean;
	hasUppercase: boolean;
	hasNumber: boolean;
	hasSymbol: boolean;
	noLeadingOrTrailingSpaces: boolean;
	notCommon: boolean;
	score: number;
	level: "weak" | "medium" | "strong";
	isAcceptable: boolean;
}

interface StoreLocation {
	latitude: number;
	longitude: number;
	address: string;
}

const SENEGAL_COUNTRY_CODE = "+221";
const SENEGAL_LOCAL_DIGITS = 9;

const COMMON_PASSWORD_PATTERNS = [
	/^password$/i,
	/^password\d+$/i,
	/^123456(?:78|789)?$/,
	/^qwerty(?:123)?$/i,
	/^azerty(?:123)?$/i,
	/^admin(?:123)?$/i,
	/^komkom(?:123)?$/i,
];

const DAKAR_DEFAULT_REGION: Region = {
	latitude: 14.7167,
	longitude: -17.4677,
	latitudeDelta: 0.06,
	longitudeDelta: 0.06,
};

const formatGeocodedAddress = (
	address: Location.LocationGeocodedAddress | undefined,
): string => {
	if (!address) {
		return "";
	}

	const line = [address.name, address.streetNumber, address.street]
		.filter(Boolean)
		.join(" ")
		.trim();
	const locality = [address.district, address.city, address.region]
		.filter(Boolean)
		.join(", ")
		.trim();

	return [line, locality, address.country].filter(Boolean).join(" - ");
};

const evaluatePasswordStrength = (password: string): PasswordStrength => {
	const trimmedPassword = password.trim();
	const normalizedPassword = trimmedPassword.toLowerCase();

	const minLength = password.length >= 8;
	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSymbol = /[^A-Za-z0-9\s]/.test(password);
	const noLeadingOrTrailingSpaces = password === trimmedPassword;
	const notCommon =
		trimmedPassword.length > 0 &&
		!COMMON_PASSWORD_PATTERNS.some((pattern) => pattern.test(normalizedPassword));

	const varietyCount = [hasLowercase, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;
	const hasSequence = /0123|1234|2345|3456|4567|5678|6789|7890|abcd|qwerty|azerty/i.test(
		normalizedPassword,
	);
	const hasTripleRepeat = /(.)\1{2,}/.test(password);

	let score = 0;
	if (minLength) {
		score += 1;
	}
	if (password.length >= 12) {
		score += 1;
	}
	if (varietyCount >= 2) {
		score += 1;
	}
	if (varietyCount >= 3) {
		score += 1;
	}
	if (varietyCount === 4) {
		score += 1;
	}
	if (noLeadingOrTrailingSpaces) {
		score += 1;
	}
	if (notCommon) {
		score += 1;
	}
	if (hasSequence) {
		score -= 1;
	}
	if (hasTripleRepeat) {
		score -= 1;
	}

	const clampedScore = Math.max(0, Math.min(7, score));
	const level =
		clampedScore <= 2 ? "weak" : clampedScore <= 4 ? "medium" : "strong";
	const isAcceptable =
		minLength && varietyCount >= 2 && noLeadingOrTrailingSpaces && notCommon;

	return {
		minLength,
		hasLowercase,
		hasUppercase,
		hasNumber,
		hasSymbol,
		noLeadingOrTrailingSpaces,
		notCommon,
		score: clampedScore,
		level,
		isAcceptable,
	};
};

const formatSenegalLocalNumber = (digits: string): string => {
	if (digits.length <= 2) {
		return digits;
	}

	if (digits.length <= 5) {
		return `${digits.slice(0, 2)} ${digits.slice(2)}`;
	}

	if (digits.length <= 7) {
		return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
	}

	return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
};

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);
	const [password, setPassword] = useState("");
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [phoneLocalNumber, setPhoneLocalNumber] = useState("");
	const [storeLocation, setStoreLocation] = useState<StoreLocation | null>(
		null,
	);
	const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
	const [locationQuery, setLocationQuery] = useState("");
	const [draftAddress, setDraftAddress] = useState("");
	const [draftCoordinates, setDraftCoordinates] = useState({
		latitude: DAKAR_DEFAULT_REGION.latitude,
		longitude: DAKAR_DEFAULT_REGION.longitude,
	});
	const [draftRegion, setDraftRegion] =
		useState<Region>(DAKAR_DEFAULT_REGION);
	const [isResolvingLocation, setIsResolvingLocation] = useState(false);
	const [locationFeedback, setLocationFeedback] = useState<string | null>(
		null,
	);
	const [locationTouched, setLocationTouched] = useState(false);

	const storeNameInputRef = useRef<TextInput>(null);
	const ownerNameInputRef = useRef<TextInput>(null);
	const phoneInputRef = useRef<TextInput>(null);
	const emailInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);
	const geocodingServiceRef = useRef(
		createGeocodingCacheService({
			ttlMs: 5 * 60 * 1000,
			maxEntries: 120,
			debounceMs: 450,
			coordinatePrecision: 5,
		}),
	);

	useEffect(() => {
		return () => {
			geocodingServiceRef.current.dispose();
		};
	}, []);

	const passwordStrength = evaluatePasswordStrength(password);
	const passwordVarietyCount = [
		passwordStrength.hasLowercase,
		passwordStrength.hasUppercase,
		passwordStrength.hasNumber,
		passwordStrength.hasSymbol,
	].filter(Boolean).length;
	const hasStoreLocation = Boolean(storeLocation);
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

	const handlePasswordChange = (password: string) => {
		setPassword(password);
	};

	const handlePhoneNumberChange = (rawValue: string) => {
		const digitsOnly = rawValue.replace(/\D/g, "").slice(0, SENEGAL_LOCAL_DIGITS);
		setPhoneLocalNumber(digitsOnly);
	};

	const openLocationModal = () => {
		if (storeLocation) {
			setDraftCoordinates({
				latitude: storeLocation.latitude,
				longitude: storeLocation.longitude,
			});
			setDraftRegion({
				latitude: storeLocation.latitude,
				longitude: storeLocation.longitude,
				latitudeDelta: draftRegion.latitudeDelta,
				longitudeDelta: draftRegion.longitudeDelta,
			});
			setDraftAddress(storeLocation.address);
		}

		setLocationFeedback(null);
		setIsLocationModalVisible(true);
	};

	const closeLocationModal = () => {
		setIsLocationModalVisible(false);
	};

	const resolveAddressFromCoordinates = async (
		latitude: number,
		longitude: number,
	) => {
		setIsResolvingLocation(true);
		setLocationFeedback(null);

		setDraftCoordinates({ latitude, longitude });
		setDraftRegion((current) => ({
			...current,
			latitude,
			longitude,
		}));

		try {
			const geocoded = await geocodingServiceRef.current.reverseGeocode(
				latitude,
				longitude,
				({ latitude: lat, longitude: lng }) =>
					Location.reverseGeocodeAsync({
						latitude: lat,
						longitude: lng,
					}),
			);
			const formattedAddress = formatGeocodedAddress(geocoded[0]);

			if (formattedAddress) {
				setDraftAddress(formattedAddress);
			} else {
				setDraftAddress(
					`Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`,
				);
			}
		} catch {
			setLocationFeedback(
				"Adresse non résolue automatiquement. Vous pouvez confirmer la position sur la carte.",
			);
			setDraftAddress((current) => {
				if (current.trim().length > 0) {
					return current;
				}

				return `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`;
			});
		} finally {
			setIsResolvingLocation(false);
		}
	};

	const searchLocationByQuery = async (
		query: string,
		mode: DebounceMode,
		showValidationFeedback: boolean,
	) => {
		const normalizedQuery = query.trim();
		if (normalizedQuery.length < 3) {
			if (showValidationFeedback) {
				setLocationFeedback(
					"Saisissez au moins 3 caractères pour rechercher.",
				);
			}
			return;
		}

		setIsResolvingLocation(true);
		setLocationFeedback(null);

		try {
			const geocoded = await geocodingServiceRef.current.geocode(
				normalizedQuery,
				(searchQuery) => Location.geocodeAsync(searchQuery),
				mode,
			);

			if (!geocoded.length) {
				setLocationFeedback(
					"Aucun résultat trouvé. Essayez avec plus de détails (quartier, ville).",
				);
				return;
			}

			await resolveAddressFromCoordinates(
				geocoded[0].latitude,
				geocoded[0].longitude,
			);
		} catch (error) {
			if (isDebouncedRequestCancelledError(error)) {
				return;
			}

			setLocationFeedback("Recherche indisponible pour le moment.");
		} finally {
			setIsResolvingLocation(false);
		}
	};

	const handleUseCurrentLocation = async () => {
		setLocationFeedback(null);

		try {
			const permission =
				await Location.requestForegroundPermissionsAsync();
			if (permission.status !== "granted") {
				setLocationFeedback(
					"Autorisez la localisation pour utiliser votre position actuelle.",
				);
				return;
			}

			setIsResolvingLocation(true);
			const currentPosition = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});

			await resolveAddressFromCoordinates(
				currentPosition.coords.latitude,
				currentPosition.coords.longitude,
			);
		} catch {
			setLocationFeedback(
				"Impossible d'obtenir la position actuelle. Essayez la recherche manuelle.",
			);
			setIsResolvingLocation(false);
		}
	};

	const handleSearchLocation = async () => {
		await searchLocationByQuery(locationQuery, "immediate", true);
	};

	const handleLocationQueryChange = (value: string) => {
		setLocationQuery(value);

		if (!value.trim()) {
			setLocationFeedback(null);
			return;
		}

		void searchLocationByQuery(value, "debounced", false);
	};

	const handleConfirmLocation = () => {
		setStoreLocation({
			latitude: draftCoordinates.latitude,
			longitude: draftCoordinates.longitude,
			address:
				draftAddress.trim().length > 0
					? draftAddress
					: `Lat ${draftCoordinates.latitude.toFixed(6)}, Lng ${draftCoordinates.longitude.toFixed(6)}`,
		});
		setLocationTouched(false);
		closeLocationModal();
	};

	const handleCreateAccountPress = () => {
		if (!storeLocation) {
			setLocationTouched(true);
			openLocationModal();
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
						{/* Section title */}
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

						{/* Store Name */}
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

						{/* Owner Name */}
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

						{/* Professional Phone */}
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

						{/* Email */}
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

						{/* Password */}
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
							onChangeText={handlePasswordChange}
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

						{/* Password Strength Indicators */}
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
									Au moins 8 caractères
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
									Au moins 2 types (majuscule, minuscule,
									chiffre, symbole)
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
									Évitez les mots de passe trop courants
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
									: " - Continuez pour renforcer la sécurité."}
							</Text>
						</View>

						{/* Address */}
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
								La position GPS est obligatoire pour créer le compte.
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

						{/* Terms Checkbox */}
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

						{/* Create Account Button */}
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

						{/* Sign In CTA */}
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

					{/* Security Badge */}
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

			<Modal
				visible={isLocationModalVisible}
				transparent
				animationType="slide"
				presentationStyle="overFullScreen"
				statusBarTranslucent
				navigationBarTranslucent
				hardwareAccelerated
				onRequestClose={closeLocationModal}
			>
				<View style={styles.modalOverlay}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : undefined}
						style={styles.modalWrapper}
					>
						<View style={styles.locationModalCard}>
							<View style={styles.locationModalHeader}>
								<Text
									variant="h3"
									textColorOverride={lightColors.text.primary}
								>
									Position du magasin
								</Text>
								<Pressable
									onPress={closeLocationModal}
									hitSlop={10}
									accessibilityRole="button"
									accessibilityLabel="Fermer la sélection de position"
								>
									<Icon
										name="close"
										size={20}
										color={lightColors.text.secondary}
									/>
								</Pressable>
							</View>

							<Input
								label="Rechercher une adresse"
								labelVariant="button"
								labelStyle={styles.labelStyle}
								placeholder="Ex: HLM Grand Yoff, Dakar"
								value={locationQuery}
								autoCapitalize="words"
								autoCorrect={false}
								returnKeyType="search"
								onChangeText={handleLocationQueryChange}
								onSubmitEditing={handleSearchLocation}
								rightElement={
									<Pressable
										onPress={handleSearchLocation}
										hitSlop={10}
										accessibilityRole="button"
										accessibilityLabel="Lancer la recherche d'adresse"
									>
										<Icon
											name="search"
											size={20}
											color={lightColors.primary}
										/>
									</Pressable>
								}
							/>

							<View style={styles.locationActionsRow}>
								<Button
									title="Utiliser ma position"
									variant="secondary"
									onPress={handleUseCurrentLocation}
									loading={isResolvingLocation}
									containerStyle={styles.locationActionButton}
								/>
								<Button
									title="Valider"
									onPress={handleConfirmLocation}
									disabled={!draftCoordinates}
									containerStyle={styles.locationActionButton}
								/>
							</View>

							<View style={styles.mapContainer}>
								<MapView
									style={styles.map}
									region={draftRegion}
									onRegionChangeComplete={setDraftRegion}
									onPress={(event) => {
										void resolveAddressFromCoordinates(
											event.nativeEvent.coordinate.latitude,
											event.nativeEvent.coordinate.longitude,
										);
									}}
								>
									<Marker
										coordinate={draftCoordinates}
										draggable
										onDragEnd={(event) => {
											void resolveAddressFromCoordinates(
												event.nativeEvent.coordinate.latitude,
												event.nativeEvent.coordinate.longitude,
											);
										}}
									/>
								</MapView>
								{isResolvingLocation ? (
									<View style={styles.mapLoadingOverlay}>
										<ActivityIndicator
											size="small"
											color={lightColors.primary}
										/>
									</View>
								) : null}
							</View>

							<Text
								variant="bodyLarge"
								textColorOverride={lightColors.text.secondary}
								style={styles.locationSelectedAddress}
							>
								{draftAddress.trim().length > 0
									? draftAddress
									: "Touchez la carte ou utilisez la recherche pour sélectionner le magasin."}
							</Text>

							{locationFeedback ? (
								<Text
									variant="bodyLarge"
									textColorOverride={lightColors.warning}
									style={styles.locationFeedbackText}
								>
									{locationFeedback}
								</Text>
							) : null}
						</View>
					</KeyboardAvoidingView>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
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
	locationCoordinates: {
		fontSize: 12,
		marginTop: spacing.s1,
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
		paddingBottom: spacing.s4,
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

export default SignupScreen;
