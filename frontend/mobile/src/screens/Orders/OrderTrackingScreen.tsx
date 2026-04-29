import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	CartAppBar,
	OrderTrackingActionBar,
	OrderTrackingAddressCard,
	OrderTrackingDriverCard,
	OrderSummaryCard,
	OrderTrackingHeader,
	OrderTrackingInvoiceRow,
	OrderTrackingTimeline,
	Text,
	ACTION_BUTTON_HEIGHT,
	type OrderTrackingStepItem,
} from '../../components';
import { getOrderTrackingDataById } from '../../mocks/orders';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { formatPrice } from '../../utils/formatPrice';
import { useToast } from '../../hooks/useToast';

type OrderTrackingScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'OrderTracking'
>;

const BOTTOM_BAR_EXTRA_PADDING = spacing.s2;

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
	navigation,
	route,
}) => {
	const insets = useSafeAreaInsets();
	const { showToast } = useToast();
	const { orderId } = route.params;
	const data = getOrderTrackingDataById(orderId);

	const steps: OrderTrackingStepItem[] = data.steps.map((step) => ({
		id: step.id,
		label: step.label,
		time: step.time,
		description: step.description,
		iconName: step.iconName,
		isDone: step.isDone,
		isCurrent: step.isCurrent,
	}));

	const isDeliveryCurrentStep = (step: OrderTrackingStepItem): boolean => {
		return Boolean(step.isCurrent) && step.label.toLocaleLowerCase('fr-FR').includes('livraison');
	};

	return (
		<View style={styles.screen}>
			<CartAppBar
				title='Suivi de commande'
				onPressBack={() => navigation.goBack()}
                hideRightButton
			/>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.contentContainer,
					{
						paddingBottom:
							ACTION_BUTTON_HEIGHT +
							Math.max(insets.bottom, spacing.s2) +
							BOTTOM_BAR_EXTRA_PADDING +
							spacing.s4,
					},
				]}
				showsVerticalScrollIndicator={false}
			>
				<OrderTrackingHeader
					orderReference={data.orderReference}
					statusLabel={data.statusLabel}
					createdAtLabel={data.createdAtLabel}
					etaLabel={data.etaLabel}
				/>

				<View style={styles.sectionCard}>
					<Text variant='h3' style={{ fontWeight: '700' }}>
						Historique
					</Text>
					<Text variant='small' color='secondary'>
						{data.lastUpdatedLabel}
					</Text>
					<OrderTrackingTimeline
						steps={steps}
						containerStyle={styles.timelineBody}
						renderStepExtra={(step) => {
							const driver = data.driver;

							if (!driver || !isDeliveryCurrentStep(step)) {
								return null;
							}

							return (
								<OrderTrackingDriverCard
									driverName={driver.name}
									vehicleLabel={driver.vehicleLabel}
									avatarUrl={driver.avatarUrl}
									onPressCall={() => {
										showToast({
											tone: 'info',
											title: 'Appel livreur',
											message: `Contact: ${driver.phoneNumber}`,
										});
									}}
								/>
							);
						}}
					/>
				</View>

				<View style={styles.sectionCard}>
					<Text variant='h3' style={{ fontWeight: '700' }}>
						Adresse de livraison
					</Text>
					<OrderTrackingAddressCard
						title={data.deliveryAddressTitle}
						address={data.deliveryAddressText}
						containerStyle={styles.addressCard}
					/>
				</View>

				<View style={styles.sectionCard}>
					<Text variant='h3' style={{ fontWeight: '700' }}>
						Resume de la commande
					</Text>

					<View style={styles.weightLine}>
						<Text variant='body'>
							{String(data.itemsCount)} articles
						</Text>
						<Text variant='small' color='secondary'>
							{data.totalWeightLabel ?? 'Poids total: indisponible'}
						</Text>
					</View>

					<OrderTrackingInvoiceRow
						label={data.invoiceActionLabel ?? 'Voir la facture detaillee'}
						onPress={() => navigation.navigate('OrderInvoice', { orderId })}
					/>

					<View style={styles.summaryWrap}>
						<OrderSummaryCard
							totalItems={data.itemsCount}
							subtotalText={formatPrice(data.subtotal, data.currency)}
							deliveryText={formatPrice(data.deliveryFee, data.currency)}
							totalText={formatPrice(data.total, data.currency)}
						/>
					</View>
				</View>
			</ScrollView>

			<OrderTrackingActionBar
				onPressSupport={() => {
					navigation.navigate('CustomerSupport', { orderId });
				}}
				onPressConfirmReception={() => {
					showToast({
						tone: 'success',
						title: 'Reception confirmee',
						message: `Commande ${data.orderReference} marquee comme recue.`,
					});
				}}
				containerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.s2) + BOTTOM_BAR_EXTRA_PADDING }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s3 + spacing.s0,
		paddingTop: spacing.s1,
		gap: spacing.s1,
	},
	sectionCard: {
		backgroundColor: lightColors.surface.default,
		paddingVertical: spacing.s4,
		paddingHorizontal: spacing.s3 + spacing.s0,
		gap: spacing.s0,
        borderRadius: 12,
	},
	timelineBody: {
		paddingHorizontal: 0,
		paddingTop: spacing.s2,
	},
	addressCard: {
		marginTop: spacing.s2,
		paddingHorizontal: 0,
		paddingVertical: 0,
		borderWidth: 0,
	},
	weightLine: {
		marginTop: spacing.s1,
		rowGap: spacing.s0,
	},
	summaryWrap: {
		marginTop: spacing.s2,
	},
});

export default OrderTrackingScreen;
