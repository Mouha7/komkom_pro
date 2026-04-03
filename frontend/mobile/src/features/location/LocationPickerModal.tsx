import React from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	View,
} from 'react-native';

import MapView, { Marker, type Region } from 'react-native-maps';

import { Button, Icon, Input, Text } from '../../components';
import { useResponsive } from '../../hooks/useResponsive';
import { lightColors } from '../../styles/colors';
import { clamp } from '../../styles/responsive';
import { styles } from './location.styles';
import type { GeoCoordinates } from './location.types';

interface LocationPickerModalLabels {
	title?: string;
	searchLabel?: string;
	searchPlaceholder?: string;
	useCurrentLocationButton?: string;
	confirmButton?: string;
	emptyAddressHint?: string;
	closeA11yLabel?: string;
	searchA11yLabel?: string;
}

interface LocationPickerModalProps {
	visible: boolean;
	locationQuery: string;
	draftAddress: string;
	draftCoordinates: GeoCoordinates;
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
	labels?: LocationPickerModalLabels;
}

const DEFAULT_LABELS: Required<LocationPickerModalLabels> = {
	title: 'Position du magasin',
	searchLabel: 'Rechercher une adresse',
	searchPlaceholder: 'Ex: HLM Grand Yoff, Dakar',
	useCurrentLocationButton: 'Utiliser ma position',
	confirmButton: 'Valider',
	emptyAddressHint:
		'Touchez la carte ou utilisez la recherche pour selectionner la position.',
	closeA11yLabel: 'Fermer la selection de position',
	searchA11yLabel: 'Lancer la recherche d\'adresse',
};

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
	labels,
}) => {
	const { width, height, isExpanded } = useResponsive();
	const modalMaxWidth = isExpanded ? 760 : 620;
	const mapHeight = isExpanded ? clamp(height * 0.24, 220, 320) : clamp(height * 0.22, 180, 260);

	const mergedLabels = {
		...DEFAULT_LABELS,
		...labels,
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			presentationStyle='overFullScreen'
			statusBarTranslucent
			navigationBarTranslucent
			hardwareAccelerated
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={styles.modalWrapper}
				>
						<View
							style={[
								styles.locationModalCard,
								{ maxWidth: Math.min(modalMaxWidth, width - 24) },
							]}
						>
						<View style={styles.locationModalHeader}>
							<Text
								variant='h3'
								textColorOverride={lightColors.text.primary}
							>
								{mergedLabels.title}
							</Text>
							<Pressable
								onPress={onClose}
								hitSlop={10}
								accessibilityRole='button'
								accessibilityLabel={mergedLabels.closeA11yLabel}
							>
								<Icon
									name='close'
									size={20}
									color={lightColors.text.secondary}
								/>
							</Pressable>
						</View>

						<Input
							label={mergedLabels.searchLabel}
							labelVariant='button'
							labelStyle={styles.labelStyle}
							placeholder={mergedLabels.searchPlaceholder}
							value={locationQuery}
							autoCapitalize='words'
							autoCorrect={false}
							returnKeyType='search'
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
									accessibilityRole='button'
									accessibilityLabel={mergedLabels.searchA11yLabel}
								>
									<Icon
										name='search'
										size={20}
										color={lightColors.primary}
									/>
								</Pressable>
							}
						/>

						<View style={styles.locationActionsRow}>
							<Button
								title={mergedLabels.useCurrentLocationButton}
								variant='secondary'
								onPress={() => {
									void onUseCurrentLocation();
								}}
								loading={isResolvingLocation}
								containerStyle={styles.locationActionButton}
							/>
							<Button
								title={mergedLabels.confirmButton}
								onPress={onConfirmLocation}
								disabled={!draftCoordinates}
								containerStyle={styles.locationActionButton}
							/>
						</View>

						<View style={[styles.mapContainer, { height: mapHeight }]}>
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
										size='small'
										color={lightColors.primary}
									/>
								</View>
							) : null}
						</View>

						<Text
							variant='bodyLarge'
							textColorOverride={lightColors.text.secondary}
							style={styles.locationSelectedAddress}
						>
							{draftAddress.trim().length > 0
								? draftAddress
								: mergedLabels.emptyAddressHint}
						</Text>

						{locationFeedback ? (
							<Text
								variant='bodyLarge'
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
