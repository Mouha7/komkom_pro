import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

import {
	Button,
	CartAppBar,
	EmptyState,
	ErrorState,
	Icon,
	StatusBadge,
	Text,
	type OrderStatus,
} from "../../components";
import { getOrderById } from "../../api/orders";
import { useToast } from "../../hooks/useToast";
import type { OrderSummaryItem } from "../../components";
import {
	FALLBACK_ORDER_DETAILS,
	ORDER_DETAILS_BY_ID,
	type OrderDetailMetaMock,
} from "../../mocks/orders";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { lightColors, withOpacity } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { formatPrice } from "../../utils/formatPrice";

type OrderDetailScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"OrderDetail"
>;

type TimelineStep = {
	id: string;
	label: string;
	time: string;
};

const BOTTOM_ACTION_BAR_MIN_HEIGHT = 45;

const formatOrderDateTime = (isoDate?: string): string => {
	if (!isoDate) {
		return "Date non disponible";
	}

	const date = new Date(isoDate);
	if (Number.isNaN(date.getTime())) {
		return "Date non disponible";
	}

	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

const getActiveStepIndex = (status: OrderStatus): number => {
	switch (status) {
		case "draft":
			return 0;
		case "pending":
			return 2;
		case "confirmed":
			return 3;
		case "delivered":
			return 4;
		case "cancelled":
			return 2;
		default:
			return 2;
	}
};

const buildTimeline = (createdAt?: string): TimelineStep[] => {
	const orderedAt = formatOrderDateTime(createdAt);

	return [
		{ id: "validated", label: "Commande validee", time: orderedAt },
		{
			id: "paid",
			label: "Paiement confirme",
			time: "Quelques minutes apres validation",
		},
		{
			id: "preparing",
			label: "En preparation",
			time: "Traitement en cours",
		},
		{
			id: "shipping",
			label: "En cours de livraison",
			time: "En attente de transporteur",
		},
		{ id: "delivered", label: "Livree", time: "Estimation aujourd'hui" },
	];
};

export const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({
	navigation,
	route,
}) => {
	const { showToast } = useToast();
	const insets = useSafeAreaInsets();
	const [selectedOrder, setSelectedOrder] = useState<OrderSummaryItem | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isReloading, setIsReloading] = useState(false);

	const orderId = route.params.orderId;

	const loadOrder = useCallback(async (): Promise<void> => {
		setErrorMessage(null);
		setIsLoading(true);
		try {
			const order = await getOrderById(orderId);
			setSelectedOrder(order);
		} catch (error) {
			const baseMessage = "Impossible de charger cette commande.";
			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
			setSelectedOrder(null);
		} finally {
			setIsLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		void loadOrder();
	}, [loadOrder]);

	const detail: OrderDetailMetaMock | null = selectedOrder
		? (ORDER_DETAILS_BY_ID[selectedOrder.id] ?? FALLBACK_ORDER_DETAILS)
		: null;
	const timeline = selectedOrder
		? buildTimeline(selectedOrder.createdAt)
		: [];

	const activeStepIndex = selectedOrder
		? getActiveStepIndex(selectedOrder.status)
		: 0;

	const subtotalAmount = detail
		? detail.items.reduce(
				(sum, item) => sum + item.unitPrice * item.quantity,
				0,
			)
		: 0;

	const mapRegion = detail
		? {
				latitude: detail.coordinates.latitude,
				longitude: detail.coordinates.longitude,
				latitudeDelta: 0.02,
				longitudeDelta: 0.02,
			}
		: {
				latitude: FALLBACK_ORDER_DETAILS.coordinates.latitude,
				longitude: FALLBACK_ORDER_DETAILS.coordinates.longitude,
				latitudeDelta: 0.02,
				longitudeDelta: 0.02,
			};

	const contentBottomPadding =
		BOTTOM_ACTION_BAR_MIN_HEIGHT +
		Math.max(insets.bottom, spacing.s2) +
		spacing.s4;

	const handleReload = (): void => {
		if (isReloading) {
			return;
		}

		setIsReloading(true);
		void loadOrder().finally(() => {
			setIsReloading(false);
		});
	};

	const handleSupportPress = (): void => {
		showToast({
			tone: "info",
			title: "Support commande",
			message: `Assistance pour ${selectedOrder?.reference ?? "la commande"}`,
		});
	};

	const handleInvoicePress = (): void => {
		showToast({
			tone: "success",
			title: "Facture",
			message: "La facture sera bientot disponible en telechargement.",
		});
	};

	return (
		<View style={styles.screen}>
			<CartAppBar
				title="Detail Commande"
				onPressBack={() => navigation.goBack()}
				rightIconName="phone"
				onPressRight={handleSupportPress}
				rightButtonAccessibilityLabel="Contacter le support"
			/>

			{errorMessage ? (
				<View style={styles.stateContainer}>
					<ErrorState
						title="Detail indisponible"
						description={errorMessage}
						actionLabel={
							isReloading ? "Rechargement..." : "Reessayer"
						}
						onActionPress={handleReload}
					/>
				</View>
			) : isLoading ? (
				<View style={styles.stateContainer}>
					<ActivityIndicator
						size="small"
						color={lightColors.primary}
					/>
					<Text
						variant="body"
						color="secondary"
						style={styles.loadingLabel}
					>
						Chargement du detail de commande...
					</Text>
				</View>
			) : !selectedOrder || !detail ? (
				<View style={styles.stateContainer}>
					<EmptyState
						title="Commande introuvable"
						description="Cette commande est indisponible ou a ete supprimee."
						actionLabel="Retour a mes commandes"
						onActionPress={() => navigation.goBack()}
					/>
				</View>
			) : (
				<>
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={[
							styles.contentContainer,
							{ paddingBottom: contentBottomPadding },
						]}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.card}>
							<View style={styles.overviewRow}>
								<View style={styles.referenceBlock}>
									<Text
										variant="h2"
										style={{ fontWeight: "700" }}
									>
										#{selectedOrder.reference}
									</Text>
									<Text
										variant="small"
										color="secondary"
										style={styles.referenceDate}
									>
										Passee le{" "}
										{formatOrderDateTime(
											selectedOrder.createdAt,
										)}
									</Text>
								</View>
								<StatusBadge
									orderStatus={selectedOrder.status}
									size="sm"
									compact
								/>
							</View>
							{selectedOrder.status === "cancelled" ? (
								<Text
									variant="small"
									color="danger"
									style={styles.cancelledNote}
								>
									Cette commande a ete annulee.
								</Text>
							) : null}
						</View>

						<View style={styles.card}>
							<Text variant="h2" style={styles.sectionTitle}>
								Suivi de commande
							</Text>
							{timeline.map((step, index) => {
								const isCompleted =
									index < activeStepIndex ||
									selectedOrder.status === "delivered";
								const isActive =
									index === activeStepIndex &&
									selectedOrder.status !== "delivered" &&
									selectedOrder.status !== "cancelled";

								return (
									<View
										key={step.id}
										style={styles.timelineItem}
									>
										{index < timeline.length - 1 ? (
											<View
												style={[
													styles.timelineLine,
													(index < activeStepIndex ||
														selectedOrder.status ===
															"delivered") &&
														styles.timelineLineDone,
												]}
											/>
										) : null}
										<View
											style={[
												styles.timelineDot,
												isCompleted &&
													styles.timelineDotDone,
												isActive &&
													styles.timelineDotActive,
											]}
										>
											{isCompleted ? (
												<Icon
													name="check"
													size={12}
													color="#FFFFFF"
												/>
											) : !isActive ? (
												<View
													style={
														styles.timelineDotInner
													}
												/>
											) : (
												<Icon
													name="package"
													size={12}
													color="#FFFFFF"
												/>
											)}
										</View>
										<View style={styles.timelineContent}>
											<Text
												variant="body"
												style={[
													styles.timelineTitle,
													isActive &&
														styles.timelineTitleActive,
												]}
												color={
													isActive
														? "primary"
														: undefined
												}
											>
												{step.label}
											</Text>
											<Text
												variant="small"
												color="secondary"
											>
												{step.time}
											</Text>
										</View>
									</View>
								);
							})}
						</View>

						<View style={styles.card}>
							<Text variant="h2" style={styles.sectionTitle}>
								Articles ({String(detail.items.length)})
							</Text>
							{detail.items.map((item, index) => (
								<View
									key={item.id}
									style={[
										styles.itemRow,
										index === detail.items.length - 1 &&
											styles.itemRowLast,
									]}
								>
									<Image
										source={{ uri: item.imageUrl }}
										style={styles.itemImage}
									/>
									<View style={styles.itemDetails}>
										<Text
											variant="body"
											style={styles.itemName}
											maxLines={2}
										>
											{item.name}
										</Text>
										<View style={styles.itemMetaRow}>
											<Text
												variant="small"
												color="secondary"
											>
												{String(item.quantity)} x{" "}
												{formatPrice(
													item.unitPrice,
													selectedOrder.currency ??
														"FCFA",
												)}
											</Text>
											<Text
												variant="body"
												style={styles.itemTotal}
											>
												{formatPrice(
													item.unitPrice *
														item.quantity,
													selectedOrder.currency ??
														"FCFA",
												)}
											</Text>
										</View>
									</View>
								</View>
							))}
						</View>

						<View style={styles.card}>
							<Text variant="h2" style={styles.sectionTitle}>
								Informations de livraison
							</Text>
							<View style={styles.mapContainer}>
								<MapView
									style={styles.mapView}
									region={mapRegion}
									scrollEnabled={false}
									zoomEnabled={false}
									pitchEnabled={false}
									rotateEnabled={false}
									toolbarEnabled={false}
									pointerEvents="none"
								>
									<Marker coordinate={detail.coordinates} />
								</MapView>
							</View>

							<View style={styles.infoRow}>
								<Icon
									name="mapPin"
									size={18}
									color={lightColors.text.secondary}
								/>
								<View style={styles.infoTextBlock}>
									<Text variant="small" color="secondary">
										Adresse de livraison
									</Text>
									<Text
										variant="body"
										style={styles.infoValue}
									>
										{detail.deliveryAddress}
									</Text>
								</View>
							</View>

							<View style={styles.infoRow}>
								<Icon
									name="phone"
									size={18}
									color={lightColors.text.secondary}
								/>
								<View style={styles.infoTextBlock}>
									<Text variant="small" color="secondary">
										Contact sur place
									</Text>
									<Text
										variant="body"
										style={styles.infoValue}
									>
										{detail.contactName} -{" "}
										{detail.contactPhone}
									</Text>
								</View>
							</View>
						</View>

						<View style={styles.card}>
							<Text variant="h2" style={styles.sectionTitle}>
								Résumé financier
							</Text>

							<View style={styles.summaryRowsBlock}>
								<View style={styles.summaryRow}>
									<Text variant="body" color="secondary">
										Sous-total (
										{String(
											detail.items.reduce(
												(sum, item) =>
													sum + item.quantity,
												0,
											),
										)}{" "}
										articles)
									</Text>
									<Text
										variant="h2"
										style={styles.summaryAmount}
									>
										{formatPrice(
											subtotalAmount,
											selectedOrder.currency ?? "FCFA",
										)}
									</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text variant="body" color="secondary">
										Frais de livraison
									</Text>
									<Text
										variant="h2"
										style={styles.summaryAmount}
									>
										{formatPrice(
											detail.deliveryFee,
											selectedOrder.currency ?? "FCFA",
										)}
									</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text variant="body" color="secondary">
										TVA (18%)
									</Text>
									<Text
										variant="h2"
										style={styles.summaryAmount}
									>
										Inclus
									</Text>
								</View>
							</View>

							<View style={styles.summaryTotalRow}>
								<Text
									variant="h1"
									style={styles.summaryTotalLabel}
								>
									Total payé
								</Text>
								<Text
									variant="h1"
									style={styles.summaryTotalAmount}
								>
									{formatPrice(
										selectedOrder.total,
										selectedOrder.currency ?? "FCFA",
									)}
								</Text>
							</View>

							<View style={styles.paymentRow}>
								<Icon
									name="smartphone"
									size={20}
									color={lightColors.primary}
								/>
								<View style={styles.paymentTextWrap}>
									<Text variant="body" color="secondary">
										Mode de paiement
									</Text>
									<Text
										variant="h1"
										style={styles.paymentLabel}
									>
										{detail.paymentLabel}
									</Text>
								</View>
							</View>
						</View>
					</ScrollView>

					<View
						style={[
							styles.bottomActions,
							{
								paddingBottom: Math.max(
									insets.bottom,
									spacing.s2,
								),
							},
						]}
					>
						<Button
							title="Facture"
							variant="secondary"
							onPress={handleInvoicePress}
							containerStyle={styles.bottomActionButton}
							leftIcon={
								<Icon
									name="fileText"
									size={18}
									color={lightColors.text.primary}
								/>
							}
						/>
						<Button
							title="Support"
							onPress={handleSupportPress}
							containerStyle={styles.bottomActionButton}
							leftIcon={
								<Icon
									name="headphones"
									size={18}
									color={lightColors.text.onPrimary}
								/>
							}
						/>
					</View>
				</>
			)}
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
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		rowGap: spacing.s2,
	},
	stateContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.s3,
	},
	loadingLabel: {
		marginTop: spacing.s2,
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 12,
		padding: spacing.s3,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "700",
		marginBottom: spacing.s3,
	},
	overviewRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		columnGap: spacing.s2,
	},
	referenceBlock: {
		flexShrink: 1,
		rowGap: spacing.s0,
	},
	referenceDate: {
		marginTop: spacing.s0,
	},
	cancelledNote: {
		marginTop: spacing.s2,
	},
	timelineItem: {
		position: "relative",
		flexDirection: "row",
		columnGap: spacing.s2,
		paddingBottom: spacing.s3,
	},
	timelineLine: {
		position: "absolute",
		left: 11,
		top: 22,
		bottom: 0,
		width: 2,
		backgroundColor: lightColors.border.default,
	},
	timelineLineDone: {
		backgroundColor: lightColors.success,
	},
	timelineDot: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.surface.default,
		alignItems: "center",
		justifyContent: "center",
	},
	timelineDotDone: {
		backgroundColor: lightColors.success,
		borderColor: lightColors.success,
	},
	timelineDotActive: {
		backgroundColor: lightColors.primary,
		borderColor: lightColors.primary,
		shadowColor: lightColors.primary,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.4,
		shadowRadius: 8,
		elevation: 8,
	},
	timelineDotInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: lightColors.border.default,
	},
	timelineContent: {
		flex: 1,
		rowGap: spacing.s0,
	},
	timelineTitle: {
		fontWeight: "700",
	},
	timelineTitleActive: {
		color: lightColors.text.primary,
		fontWeight: "700",
	},
	itemRow: {
		flexDirection: "row",
		columnGap: spacing.s2,
		paddingBottom: spacing.s2,
		marginBottom: spacing.s2,
		borderBottomWidth: 1,
		borderBottomColor: withOpacity(
			lightColors.border.default as string,
			0.45,
		),
	},
	itemRowLast: {
		paddingBottom: 0,
		marginBottom: 0,
		borderBottomWidth: 0,
	},
	itemImage: {
		width: 56,
		height: 56,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		backgroundColor: lightColors.background.default,
	},
	itemDetails: {
		flex: 1,
		rowGap: spacing.s1,
	},
	itemName: {
		fontSize: 14,
		fontWeight: "700",
	},
	itemMetaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		columnGap: spacing.s2,
	},
	itemTotal: {
		fontSize: 14,
		fontWeight: "700",
	},
	mapContainer: {
		height: 180,
		borderRadius: 10,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: lightColors.border.default,
		marginBottom: spacing.s2,
	},
	mapView: {
		flex: 1,
	},
	infoRow: {
		flexDirection: "row",
		columnGap: spacing.s2,
		alignItems: "flex-start",
		marginBottom: spacing.s2,
	},
	infoTextBlock: {
		flex: 1,
		rowGap: spacing.s0,
	},
	infoValue: {
		lineHeight: 20,
		fontSize: 14,
		fontWeight: "700",
	},
	summaryRowsBlock: {
		rowGap: spacing.s2,
		paddingBottom: spacing.s3,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		columnGap: spacing.s2,
	},
	summaryAmount: {
		fontSize: 16,
		fontWeight: "500",
	},
	summaryTotalRow: {
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingTop: spacing.s3,
		marginBottom: spacing.s0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		columnGap: spacing.s2,
	},
	summaryTotalLabel: {
		fontSize: 16,
		fontWeight: "700",
		color: lightColors.primaryDark,
	},
	summaryTotalAmount: {
		fontSize: 16,
		fontWeight: "700",
		color: lightColors.primaryDark,
	},
	summaryExtraRow: {
		marginTop: spacing.s2,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	paymentRow: {
		marginTop: spacing.s1,
		paddingTop: spacing.s2,
		borderTopWidth: 1,
		borderTopColor: withOpacity(lightColors.border.default as string, 0.75),
		borderStyle: "dashed",
		flexDirection: "row",
		alignItems: "center",
		columnGap: spacing.s2,
	},
	paymentTextWrap: {
		flex: 1,
		fontSize: 12,
	},
	paymentLabel: {
		lineHeight: 20,
		fontSize: 14,
		fontWeight: "700",
		flex: 1,
	},
	bottomActions: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		flexDirection: "row",
		columnGap: spacing.s2,
		minHeight: BOTTOM_ACTION_BAR_MIN_HEIGHT,
	},
	bottomActionButton: {
		flex: 1,
	},
});

export default OrderDetailScreen;
