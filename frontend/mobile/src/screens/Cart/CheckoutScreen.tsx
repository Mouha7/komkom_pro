import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, CartAppBar, ErrorState, Icon, Input, OrderSummaryCard, ScrollToTopButton, Text } from '../../components';
import { useScrollToTopButton } from '../../components/molecules/';
import { LocationPickerModal, useLocationPicker } from '../../features/location';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { formatPrice } from '../../utils/formatPrice';
import { CHECKOUT_DEFAULT_REGION } from './Checkout/CheckoutScreen.constants';
import { computeCheckoutTotals } from './Checkout/CheckoutScreen.helpers';
import { styles } from './Checkout/CheckoutScreen.styles';
import { CheckoutDeliverySection } from './Checkout/CheckoutDeliverySection';
import { CheckoutPaymentSection } from './Checkout/CheckoutPaymentSection';
import type { CheckoutPaymentMethod } from './Checkout/CheckoutScreen.types';

type CheckoutScreenProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
	const insets = useSafeAreaInsets();
	const { items, isLoading, errorMessage, reload } = useCart();
	const { showToast } = useToast();
	const [storeOrBuildingName, setStoreOrBuildingName] = useState('');
	const [instructions, setInstructions] = useState('');
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<CheckoutPaymentMethod>('cash_on_delivery');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [bottomBarHeight, setBottomBarHeight] = useState(0);

	const {
		pickedLocation,
		isLocationModalVisible,
		locationQuery,
		draftAddress,
		draftCoordinates,
		draftRegion,
		isResolvingLocation,
		locationFeedback,
		locationTouched,
		hasPickedLocation,
		openLocationModal,
		closeLocationModal,
		handleUseCurrentLocation,
		handleSearchLocation,
		handleLocationQueryChange,
		handleConfirmLocation,
		handleMapCoordinatePick,
		handleDraftRegionChange,
		markLocationAsRequired,
	} = useLocationPicker({
		initialRegion: CHECKOUT_DEFAULT_REGION,
	});

	const totals = useMemo(() => computeCheckoutTotals(items), [items]);
	const bottomInsetPadding = Math.max(insets.bottom, spacing.s2);
	const deliverySummaryText = totals.deliveryFee > 0 ? formatPrice(totals.deliveryFee) : 'A calculer';

	const { scrollViewRef, isScrollTopVisible, handleScroll, handleScrollToTop } =
		useScrollToTopButton({ visibilityThreshold: 180 });

	const handleBottomBarLayout = (event: LayoutChangeEvent): void => {
		const nextHeight = Math.round(event.nativeEvent.layout.height);

		setBottomBarHeight((currentHeight) =>
			currentHeight === nextHeight ? currentHeight : nextHeight,
		);
	};

	const handleConfirmOrder = (): void => {
		if (!hasPickedLocation) {
			markLocationAsRequired();
			return;
		}

		if (items.length === 0 || isSubmitting) {
			return;
		}

		setIsSubmitting(true);

		showToast({
			tone: 'success',
			title: 'Commande enregistree',
			message: 'La soumission backend sera connectee dans une prochaine iteration.',
		});

		setTimeout(() => {
			setIsSubmitting(false);
			// Mock order ID for now
			navigation.navigate('OrderConfirmation', { orderId: 'KK-84920' });
		}, 400);
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<CartAppBar
				title='Finaliser la commande'
				onPressBack={() => navigation.goBack()}
				hideRightButton
			/>

			<ScrollView
				ref={scrollViewRef}
				style={styles.scrollView}
				contentContainerStyle={[
					styles.contentContainer,
				]}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{errorMessage ? (
					<ErrorState
						title='Checkout indisponible'
						description={errorMessage}
						actionLabel='Reessayer'
						onActionPress={() => {
							void reload();
						}}
					/>
				) : (
					<>
						<CheckoutDeliverySection
							pickedLocation={pickedLocation}
							locationTouched={locationTouched}
							isResolvingLocation={isResolvingLocation}
							storeOrBuildingName={storeOrBuildingName}
							onStoreOrBuildingNameChange={setStoreOrBuildingName}
							onOpenLocationModal={openLocationModal}
						/>

						<CheckoutPaymentSection
							selectedPaymentMethod={selectedPaymentMethod}
							onSelectPaymentMethod={setSelectedPaymentMethod}
						/>

						<View style={styles.section}>
							<Text
								variant='overline'
								textColorOverride={lightColors.text.secondary}
								style={styles.sectionTitle}
							>
								3. Instructions (Optionnel)
							</Text>
							<View style={styles.card}>
								<Input
									placeholder="Ex: Appeler le gerant 30 min avant d'arriver au magasin."
									value={instructions}
									onChangeText={setInstructions}
									multiline
									inputStyle={styles.instructionsInputStyle}
								/>
							</View>
						</View>

						<View style={styles.section}>
							<Text
								variant='overline'
								textColorOverride={lightColors.text.secondary}
								style={styles.sectionTitle}
							>
								4. Recapitulatif
							</Text>
							<OrderSummaryCard
								totalItems={totals.totalItems}
								subtotalText={formatPrice(totals.subtotal)}
								deliveryText={deliverySummaryText}
								totalText={formatPrice(totals.total)}
								deliveryLabel='Frais de livraison'
								totalLabel='Total a payer'
							/>
						</View>
					</>
				)}
			</ScrollView>

			<View
				onLayout={handleBottomBarLayout}
				style={[styles.bottomBar, { paddingBottom: bottomInsetPadding }]}
			>
				<Button
					title=''
					onPress={handleConfirmOrder}
					disabled={isLoading || items.length === 0}
					loading={isSubmitting}
					containerStyle={styles.confirmButton}
					leftIcon={
						<Text style={styles.confirmButtonText}>
							Confirmer la commande
						</Text>
					}
					rightIcon={
						<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: spacing.s1 }}>
							<Text style={styles.confirmButtonAmount}>{formatPrice(totals.total)}</Text>
							<Icon name='arrowRight' size={18} color='#FFFFFF' />
						</View>
					}
					accessibilityLabel='Confirmer la commande'
				/>
				<Text
					variant='small'
					textColorOverride={lightColors.text.secondary}
					style={styles.idempotenceNote}
				>
					🔒 Paiement securise. Ne cliquez qu'une seule fois.
				</Text>
			</View>

			{/* <ScrollToTopButton
				visible={isScrollTopVisible}
				onPress={handleScrollToTop}
				bottomOffset={bottomBarHeight}
				accessibilityLabel='Retour en haut du checkout'
			/> */}

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
				labels={{
					title: 'Position de livraison',
					searchLabel: 'Rechercher une adresse',
					searchPlaceholder: 'Ex: Quartier Mermoz, Dakar',
					useCurrentLocationButton: 'Utiliser ma position',
					confirmButton: 'Valider',
					emptyAddressHint:
						'Touchez la carte ou utilisez la recherche pour selectionner la position de livraison.',
					closeA11yLabel: 'Fermer la selection de position',
					searchA11yLabel: "Lancer la recherche d'adresse",
				}}
			/>
		</SafeAreaView>
	);
};

export default CheckoutScreen;
