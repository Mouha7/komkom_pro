import React from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	View,
} from "react-native";

import MapView, { Marker, type Region } from "react-native-maps";

import { Button, Icon, Input, Text } from "../../../components";
import { lightColors } from "../../../styles/colors";
import type { DraftCoordinates } from "./SignupScreen.types";
import { styles } from "./SignupScreen.styles";

interface LocationPickerModalProps {
	visible: boolean;
	locationQuery: string;
	draftAddress: string;
	draftCoordinates: DraftCoordinates;
	draftRegion: Region;
	isResolvingLocation: boolean;
	locationFeedback: string | null;
	onClose: () => void;
	onSearch: () => Promise<void>;
	onQueryChange: (value: string) => void;
	onUseCurrentLocation: () => Promise<void>;
	onConfirmLocation: () => void;
	onMapPress: (latitude: number, longitude: number) => Promise<void>;
	onRegionChangeComplete: (region: Region) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
	visible,
	locationQuery,
	draftAddress,
	draftCoordinates,
	draftRegion,
	isResolvingLocation,
	locationFeedback,
	onClose,
	onSearch,
	onQueryChange,
	onUseCurrentLocation,
	onConfirmLocation,
	onMapPress,
	onRegionChangeComplete,
}) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			presentationStyle="overFullScreen"
			statusBarTranslucent
			navigationBarTranslucent
			hardwareAccelerated
			onRequestClose={onClose}
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
								onPress={onClose}
								hitSlop={10}
								accessibilityRole="button"
								accessibilityLabel="Fermer la selection de position"
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
							onChangeText={onQueryChange}
							onSubmitEditing={() => {
								void onSearch();
							}}
							rightElement={
								<Pressable
									onPress={() => {
										void onSearch();
									}}
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
								onPress={() => {
									void onUseCurrentLocation();
								}}
								loading={isResolvingLocation}
								containerStyle={styles.locationActionButton}
							/>
							<Button
								title="Valider"
								onPress={onConfirmLocation}
								disabled={!draftCoordinates}
								containerStyle={styles.locationActionButton}
							/>
						</View>

						<View style={styles.mapContainer}>
							<MapView
								style={styles.map}
								region={draftRegion}
								onRegionChangeComplete={onRegionChangeComplete}
								onPress={(event) => {
									void onMapPress(
										event.nativeEvent.coordinate.latitude,
										event.nativeEvent.coordinate.longitude,
									);
								}}
							>
								<Marker
									coordinate={draftCoordinates}
									draggable
									onDragEnd={(event) => {
										void onMapPress(
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
								: "Touchez la carte ou utilisez la recherche pour selectionner le magasin."}
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
	);
};
