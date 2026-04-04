import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	AppBar,
	Button,
	EmptyState,
	ErrorState,
	Icon,
	IconOnlyButton,
	Text,
	type OrderSummaryItem,
} from '../../components';
import { getOrderById } from '../../api/orders';
import { useInvoicePdfActions } from '../../features/invoicePdf';
import { useResponsive } from '../../hooks/useResponsive';
import {
	getInvoiceDataByOrderId,
	type InvoiceDataMock,
} from '../../mocks/orders';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors, withOpacity } from '../../styles/colors';
import { clamp } from '../../styles/responsive';
import { spacing } from '../../styles/spacing';
import { formatPrice } from '../../utils/formatPrice';

type OrderInvoiceScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'OrderInvoice'
>;

const BOTTOM_ACTION_BAR_MIN_HEIGHT = 52;

const STATUS_STYLE_BY_PAYMENT: Record<
	InvoiceDataMock['paymentStatus'],
	{ text: string; background: string }
> = {
	paid: {
		text: lightColors.success,
		background: withOpacity(lightColors.success, 0.12),
	},
	pending: {
		text: lightColors.warning,
		background: withOpacity(lightColors.warning, 0.16),
	},
	cancelled: {
		text: lightColors.danger,
		background: withOpacity(lightColors.danger, 0.12),
	},
};

export const OrderInvoiceScreen: React.FC<OrderInvoiceScreenProps> = ({
	navigation,
	route,
}) => {
	const insets = useSafeAreaInsets();
	const { width, isCompactPhone, isMedium, isExpanded } = useResponsive();
	const [order, setOrder] = useState<OrderSummaryItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isReloading, setIsReloading] = useState(false);

	const orderId = route.params.orderId;

	const loadOrder = useCallback(async (): Promise<void> => {
		setErrorMessage(null);
		setIsLoading(true);

		try {
			const response = await getOrderById(orderId);
			setOrder(response);
		} catch (error) {
			const baseMessage = 'Impossible de charger cette facture.';
			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
			setOrder(null);
		} finally {
			setIsLoading(false);
		}
	}, [orderId]);

	useEffect(() => {
		void loadOrder();
	}, [loadOrder]);

	const invoice = useMemo(
		() => getInvoiceDataByOrderId(orderId, order),
		[order, orderId],
	);
	const pdfActions = useInvoicePdfActions(invoice);

	const contentBottomPadding =
		BOTTOM_ACTION_BAR_MIN_HEIGHT +
		Math.max(insets.bottom, spacing.s2) +
		spacing.s4;

	const horizontalPadding = isExpanded
		? clamp(width * 0.08, spacing.s4, spacing.s8)
		: isMedium
			? spacing.s5
			: spacing.s3;
	const contentMaxWidth = isExpanded ? clamp(width * 0.86, 760, 980) : undefined;
	const quantityColumnWidth = isCompactPhone ? 30 : isExpanded ? 44 : 38;
	const amountColumnWidth = isCompactPhone ? 84 : isExpanded ? 120 : 96;
	const invoiceTitleStyle = isCompactPhone ? styles.invoiceNumberCompact : null;
	const totalLabelStyle = isCompactPhone ? styles.totalLabelCompact : null;
	const totalValueStyle = isCompactPhone ? styles.totalValueCompact : null;

	const handleReload = (): void => {
		if (isReloading) {
			return;
		}

		setIsReloading(true);
		void loadOrder().finally(() => {
			setIsReloading(false);
		});
	};

	const handleDownloadPdfPress = (): void => {
		navigation.navigate('OrderInvoicePdfViewer', { orderId });
	};

	const statusStyle = STATUS_STYLE_BY_PAYMENT[invoice.paymentStatus];

	return (
		<View style={styles.screen}>
			<AppBar
				title='Facture'
				leftIconName='arrowLeft'
				onPressLeft={() => navigation.goBack()}
				rightActionSlot={
					order != null ? (
						<IconOnlyButton
							iconName='share'
							onPress={pdfActions.handleShare}
							disabled={pdfActions.activeAction !== null}
							size={54}
							borderRadius={27}
							iconSize={27}
							iconColor={lightColors.text.primary}
							accessibilityLabel='Partager la facture'
						/>
					) : undefined
				}
			/>

			{errorMessage ? (
				<View style={styles.stateContainer}>
					<ErrorState
						title='Facture indisponible'
						description={errorMessage}
						actionLabel={isReloading ? 'Rechargement...' : 'Reessayer'}
						onActionPress={handleReload}
					/>
				</View>
			) : isLoading ? (
				<View style={styles.stateContainer}>
					<ActivityIndicator size='small' color={lightColors.primary} />
					<Text variant='body' color='secondary' style={styles.loadingLabel}>
						Chargement de la facture...
					</Text>
				</View>
			) : !order ? (
				<View style={styles.stateContainer}>
					<EmptyState
						title='Commande introuvable'
						description='Impossible de construire la facture pour cette commande.'
						actionLabel='Retour au detail'
						onActionPress={() => navigation.goBack()}
					/>
				</View>
			) : (
				<>
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={[
							styles.contentContainer,
							{ paddingHorizontal: horizontalPadding },
							contentMaxWidth
								? {
									maxWidth: contentMaxWidth,
									alignSelf: 'center',
									width: '100%',
								}
								: null,
							{ paddingBottom: contentBottomPadding },
						]}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.card}>
							<View style={styles.invoiceHeaderRow}>
								<View>
									<Text variant='overline' color='secondary'>
										Facture
									</Text>
									<Text variant='h2' style={[styles.invoiceNumber, invoiceTitleStyle]}>
										{invoice.invoiceNumber}
									</Text>
								</View>
								<View
									style={[
										styles.statusBadge,
										{ backgroundColor: statusStyle.background },
									]}
								>
									<Text
										variant='small'
										style={{ color: statusStyle.text, fontWeight: '700' }}
									>
										{invoice.paymentStatusLabel}
									</Text>
								</View>
							</View>

							<Text variant='small' color='secondary' style={styles.metaLabel}>
								Reference: {invoice.orderReference}
							</Text>
							<Text variant='small' color='secondary'>
								Date d'emission: {invoice.issuedAt}
							</Text>
						</View>

						<View style={styles.card}>
							<Text variant='h2' style={styles.sectionTitle}>
								Coordonnees
							</Text>
							<View style={styles.addressBlock}>
								<Text variant='overline' color='secondary'>
									Emetteur
								</Text>
								<Text variant='body' style={styles.addressName}>
									{invoice.issuer.name}
								</Text>
								<Text variant='small' color='secondary'>
									{invoice.issuer.address}
								</Text>
								<Text variant='small' color='secondary'>
									{invoice.issuer.email} - {invoice.issuer.phone}
								</Text>
							</View>

							<View style={styles.divider} />

							<View style={styles.addressBlock}>
								<Text variant='overline' color='secondary'>
									Client
								</Text>
								<Text variant='body' style={styles.addressName}>
									{invoice.client.name}
								</Text>
								<Text variant='small' color='secondary'>
									{invoice.client.address}
								</Text>
								<Text variant='small' color='secondary'>
									{invoice.client.phone}
								</Text>
							</View>
						</View>

						<View style={styles.card}>
							<Text variant='h2' style={styles.sectionTitle}>
								Articles
							</Text>
							<View style={styles.tableHeader}>
								<Text variant='overline' color='secondary' style={styles.colDescription}>
									Designation
								</Text>
								<Text
									variant='overline'
									color='secondary'
									style={[styles.colQuantity, { width: quantityColumnWidth }]}
								>
									Qte
								</Text>
								<Text
									variant='overline'
									color='secondary'
									style={[styles.colAmount, { width: amountColumnWidth }]}
								>
									Montant
								</Text>
							</View>

							{invoice.items.map((item) => (
								<View key={item.id} style={styles.tableRow}>
									<View style={styles.colDescription}>
										<Text variant='body' style={styles.itemName} maxLines={2}>
											{item.name}
										</Text>
										<Text variant='small' color='secondary'>
											{formatPrice(item.unitPrice, invoice.currency)} / unite
										</Text>
									</View>
									<Text variant='body' style={[styles.colQuantity, { width: quantityColumnWidth }]}>
										{String(item.quantity)}
									</Text>
									<Text variant='body' style={[styles.colAmount, { width: amountColumnWidth }]}>
										{formatPrice(item.lineTotal, invoice.currency)}
									</Text>
								</View>
							))}
						</View>

						<View style={styles.card}>
							<Text variant='h2' style={styles.sectionTitle}>
								Resume financier
							</Text>

							<View style={styles.summaryRow}>
								<Text variant='body' color='secondary'>
									Sous-total
								</Text>
								<Text variant='body' style={styles.summaryValue}>
									{formatPrice(invoice.subtotal, invoice.currency)}
								</Text>
							</View>
							<View style={styles.summaryRow}>
								<Text variant='body' color='secondary'>
									Frais de livraison
								</Text>
								<Text variant='body' style={styles.summaryValue}>
									{formatPrice(invoice.deliveryFee, invoice.currency)}
								</Text>
							</View>
							<View style={styles.summaryRow}>
								<Text variant='body' color='secondary'>
									TVA ({String(invoice.taxRate)}%)
								</Text>
								<Text variant='body' style={styles.summaryValue}>
									{formatPrice(invoice.taxAmount, invoice.currency)}
								</Text>
							</View>

							<View style={styles.totalRow}>
								<Text variant='h2' style={[styles.totalLabel, totalLabelStyle]}>
									Total TTC
								</Text>
								<Text variant='h1' style={[styles.totalValue, totalValueStyle]}>
									{formatPrice(invoice.total, invoice.currency)}
								</Text>
							</View>

							<View style={styles.paymentRow}>
								<Icon
									name='smartphone'
									size={18}
									color={lightColors.primary}
								/>
								<Text variant='small' color='secondary' style={styles.paymentText}>
									{invoice.paymentLabel}
								</Text>
							</View>
						</View>
					</ScrollView>

					<View
						style={[
							styles.bottomActions,
							{ paddingHorizontal: horizontalPadding },
							contentMaxWidth
								? {
									maxWidth: contentMaxWidth,
									alignSelf: 'center',
									width: '100%',
								}
								: null,
							{ paddingBottom: Math.max(insets.bottom, spacing.s2) },
						]}
					>
						<Button
							title='Telecharger PDF'
							onPress={handleDownloadPdfPress}
							containerStyle={styles.bottomActionButtonRight}
							leftIcon={<Icon name='download' size={18} color={lightColors.text.onPrimary} />}
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
		paddingTop: spacing.s2,
		rowGap: spacing.s2,
	},
	stateContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.s3,
	},
	loadingLabel: {
		marginTop: spacing.s2,
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		borderRadius: 14,
		padding: spacing.s3,
	},
	invoiceHeaderRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		columnGap: spacing.s2,
		rowGap: spacing.s1,
	},
	invoiceNumber: {
		fontSize: 20,
		lineHeight: 26,
		fontWeight: '700',
	},
	invoiceNumberCompact: {
		fontSize: 18,
		lineHeight: 24,
	},
	statusBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
		borderRadius: 999,
	},
	metaLabel: {
		marginTop: spacing.s2,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: spacing.s2,
	},
	addressBlock: {
		rowGap: spacing.s0,
	},
	addressName: {
		fontWeight: '700',
	},
	divider: {
		height: 1,
		backgroundColor: lightColors.border.default,
		marginVertical: spacing.s3,
	},
	tableHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: spacing.s1,
		marginBottom: spacing.s2,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingBottom: spacing.s2,
	},
	colDescription: {
		flex: 1,
		paddingRight: spacing.s2,
	},
	colQuantity: {
		width: 38,
		textAlign: 'center',
	},
	colAmount: {
		width: 96,
		textAlign: 'right',
	},
	itemName: {
		fontWeight: '600',
		marginBottom: spacing.s0,
	},
	summaryRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: spacing.s2,
	},
	summaryValue: {
		fontWeight: '600',
	},
	totalRow: {
		paddingTop: spacing.s2,
		marginTop: spacing.s1,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	totalLabel: {
		fontSize: 18,
		fontWeight: '700',
	},
	totalLabelCompact: {
		fontSize: 16,
	},
	totalValue: {
		fontSize: 22,
		fontWeight: '700',
		color: lightColors.primaryDark,
	},
	totalValueCompact: {
		fontSize: 20,
	},
	paymentRow: {
		marginTop: spacing.s2,
		paddingTop: spacing.s2,
		borderTopWidth: 1,
		borderTopColor: withOpacity(lightColors.border.default, 0.7),
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
	},
	paymentText: {
		flex: 1,
	},
	bottomActions: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		flexDirection: 'row',
		columnGap: spacing.s2,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: withOpacity(lightColors.border.default, 0.9),
	},
	bottomActionButtonLeft: {
		height: BOTTOM_ACTION_BAR_MIN_HEIGHT,
	},
	bottomActionButtonRight: {
		flex: 1,
		height: BOTTOM_ACTION_BAR_MIN_HEIGHT,
	},
});

export default OrderInvoiceScreen;
