import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	CartAppBar,
	OrderConfirmationActionBar,
	OrderConfirmationHeaderIcon,
	OrderConfirmationSummaryCard,
	Text,
} from '../../components';
import { useResponsive } from '../../hooks/useResponsive';
import { clamp } from '../../styles/responsive';
import { spacing } from '../../styles/spacing';
import { formatPrice } from '../../utils/formatPrice';
import { getOrderConfirmationDataById } from '../../mocks/orders';
import type { OrderConfirmationSummaryItem } from '../../components/molecules/OrderConfirmation/OrderConfirmation.types';
import { styles } from './OrderConfirmation/OrderConfirmationScreen.styles';
import type { OrderConfirmationScreenProps } from './OrderConfirmation/OrderConfirmationScreen.types';

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
	navigation,
	route,
}) => {
	const insets = useSafeAreaInsets();
	const { width, isMedium, isExpanded } = useResponsive();
	const { orderId: paramOrderId } = route.params;

	const data = getOrderConfirmationDataById(paramOrderId);

	const summaryItems: OrderConfirmationSummaryItem[] = useMemo(
		() => [
			{
				label: 'Livraison prévue',
				value: data.deliveryTime,
			},
			{
				label: 'Adresse',
				value: data.address,
				subvalue: data.addressSubtitle,
			},
			{
				label: 'Paiement',
				value: data.paymentMethod,
			},
		],
		[data.deliveryTime, data.address, data.addressSubtitle, data.paymentMethod]
	);

	const handleFollowOrder = (): void => {
		navigation.navigate('OrderTracking', { orderId: paramOrderId });
	};

	const handleReturnHome = (): void => {
		// Reset navigation stack and go to MainTabs
		navigation.reset({
			index: 0,
			routes: [{ name: 'MainTabs' }],
		});
	};

	const handleClose = (): void => {
		navigation.reset({
			index: 0,
			routes: [{ name: 'MainTabs' }],
		});
	};

	const bottomInsetPadding = Math.max(insets.bottom, spacing.s2);
	const horizontalPadding = isExpanded ? clamp(width * 0.08, spacing.s4, spacing.s8) : isMedium ? spacing.s5 : spacing.s3;
	const subtitleMaxWidth = isExpanded ? clamp(width * 0.44, 300, 460) : clamp(width * 0.78, 250, 340);

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<CartAppBar
				title=''
				onPressBack={() => navigation.goBack()}
				hideLeftButton
				rightIconName='close'
				onPressRight={handleClose}
				rightButtonAccessibilityLabel='Fermer et revenir au panier'
			/>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[styles.contentContainer, { paddingHorizontal: horizontalPadding }]}
				scrollEnabled={true}
			>
				<View style={styles.mainContent}>
					{/* Success Icon */}
					<OrderConfirmationHeaderIcon />

					{/* Title & Subtitle */}
					<Text style={styles.title}>Commande confirmée !</Text>
					<Text style={[styles.subtitle, { maxWidth: subtitleMaxWidth }]}> 
						Votre commande a été traitée avec succès et est en cours de préparation.
					</Text>

					{/* Summary Card */}
					<View style={styles.summarySection}>
						<OrderConfirmationSummaryCard
							orderId={data.orderId}
							status={data.status}
							items={summaryItems}
							totalAmount={formatPrice(data.total)}
						/>
					</View>
				</View>
			</ScrollView>

			<View style={[styles.bottomBar, { paddingBottom: bottomInsetPadding, paddingHorizontal: horizontalPadding }]}>
				<OrderConfirmationActionBar
					onFollowOrder={handleFollowOrder}
					onReturnHome={handleReturnHome}
					containerStyle={styles.bottomActionGroup}
				/>
			</View>
		</SafeAreaView>
	);
};

export default OrderConfirmationScreen;
