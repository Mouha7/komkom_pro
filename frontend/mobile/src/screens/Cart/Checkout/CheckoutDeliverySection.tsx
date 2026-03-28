import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Button, Icon, Input, Text } from '../../../components';
import { CHECKOUT_DEFAULT_REGION } from './CheckoutScreen.constants';
import { styles } from './CheckoutScreen.styles';
import type { CheckoutDeliverySectionProps } from './CheckoutScreen.types';
import { lightColors } from '../../../styles/colors';

export const CheckoutDeliverySection: React.FC<CheckoutDeliverySectionProps> = ({
	pickedLocation,
	locationTouched,
	isResolvingLocation,
	storeOrBuildingName,
	onStoreOrBuildingNameChange,
	onOpenLocationModal,
}) => {
	const mapRegion = pickedLocation
		? {
				latitude: pickedLocation.latitude,
				longitude: pickedLocation.longitude,
				latitudeDelta: CHECKOUT_DEFAULT_REGION.latitudeDelta,
				longitudeDelta: CHECKOUT_DEFAULT_REGION.longitudeDelta,
			}
		: CHECKOUT_DEFAULT_REGION;

	return (
		<View style={styles.section}>
			<Text
				variant='overline'
				textColorOverride={lightColors.text.secondary}
				style={styles.sectionTitle}
			>
				1. Adresse de livraison
			</Text>
			<View style={styles.card}>
				<View style={styles.mapPreviewContainer}>
					<MapView style={styles.mapPreview} region={mapRegion} pointerEvents='none'>
						<Marker
							coordinate={
								pickedLocation ?? {
									latitude: mapRegion.latitude,
									longitude: mapRegion.longitude,
								}
							}
						/>
					</MapView>
				</View>

				<Button
					title='Ajuster la position GPS'
					variant='secondary'
					onPress={onOpenLocationModal}
					loading={isResolvingLocation}
					containerStyle={styles.adjustLocationButton}
					textStyle={styles.adjustLocationButtonText}
					leftIcon={<Icon name='mapPin' size={18} color={lightColors.text.primary} />}
				/>

				<View style={styles.inputGroupSpacing}>
					<Input
						label='Adresse complete'
						labelVariant='button'
						labelStyle={styles.inputLabelStyle}
						placeholder='Selectionnez votre position GPS'
						value={pickedLocation?.address ?? ''}
						editable={false}
					/>
					{locationTouched && !pickedLocation ? (
						<Text
							variant='small'
							textColorOverride={lightColors.danger}
							style={styles.locationRequiredText}
						>
							La position GPS est obligatoire pour finaliser la commande.
						</Text>
					) : null}
				</View>

				<View style={styles.inputGroupSpacing}>
					<Input
						label='Nom du commerce / Batiment'
						labelVariant='button'
						labelStyle={styles.inputLabelStyle}
						placeholder='Ex: Quincaillerie de la Paix'
						value={storeOrBuildingName}
						onChangeText={onStoreOrBuildingNameChange}
						autoCapitalize='words'
						returnKeyType='next'
					/>
				</View>
			</View>
		</View>
	);
};
