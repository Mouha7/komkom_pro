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
	Text,
	type OrderSummaryItem,
} from '../../components';
import { getOrderById } from '../../api/orders';
import {
	estimateInvoicePageCount,
	useInvoicePdfActions,
} from '../../features/invoicePdf';
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

export type OrderInvoicePdfViewerScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'OrderInvoicePdfViewer'
>;

const BOTTOM_ACTION_BAR_MIN_HEIGHT = 52;

const WATERMARK_BY_STATUS: Record<
	InvoiceDataMock['paymentStatus'],
	{ label: string; color: string; borderColor: string }
> = {
	paid: {
		label: 'PAYEE',
		color: 'rgba(22,163,74,0.13)',
		borderColor: 'rgba(22,163,74,0.20)',
	},
	pending: {
		label: 'EN ATTENTE',
		color: 'rgba(245,158,11,0.13)',
		borderColor: 'rgba(245,158,11,0.20)',
	},
	cancelled: {
		label: 'ANNULEE',
		color: 'rgba(220,38,38,0.12)',
		borderColor: 'rgba(220,38,38,0.16)',
	},
};

export const OrderInvoicePdfViewerScreen: React.FC<
	OrderInvoicePdfViewerScreenProps
> = ({ navigation, route }) => {
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
			setErrorMessage(
				__DEV__ && error instanceof Error
					? `${baseMessage} ${error.message}`
					: baseMessage,
			);
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
	const pageCount = useMemo(() => estimateInvoicePageCount(invoice), [invoice]);

	const horizontalPadding = isExpanded
		? clamp(width * 0.08, spacing.s4, spacing.s8)
		: isMedium
			? spacing.s5
			: spacing.s3;
	const contentMaxWidth = isExpanded ? clamp(width * 0.86, 760, 980) : undefined;
	const canvasPadding = isCompactPhone ? spacing.s2 : spacing.s3;
	const colQtyWidth = isCompactPhone ? 28 : isExpanded ? 40 : 32;
	const colPriceWidth = isCompactPhone ? 68 : isExpanded ? 100 : 80;
	const colTotalWidth = isCompactPhone ? 72 : isExpanded ? 108 : 88;

	const contentBottomPadding =
		BOTTOM_ACTION_BAR_MIN_HEIGHT +
		Math.max(insets.bottom, spacing.s2) +
		spacing.s4;
	const contentTopPadding = Math.max(insets.top + spacing.s8, spacing.s10);

	const handleReload = (): void => {
		if (isReloading) {
			return;
		}
		setIsReloading(true);
		void loadOrder().finally(() => {
			setIsReloading(false);
		});
	};

	const watermark = WATERMARK_BY_STATUS[invoice.paymentStatus];
	const appBarTitle = order != null ? `${invoice.invoiceNumber}.pdf` : 'Facture';

	return (
		<View style={styles.screen}>
			<View style={styles.appBarOverlay}>
				<AppBar
					title={appBarTitle}
					leftIconName='arrowLeft'
					onPressLeft={() => navigation.goBack()}
				/>
			</View>

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
						style={styles.canvas}
						contentContainerStyle={[
							{
								paddingHorizontal: canvasPadding,
								paddingTop: contentTopPadding,
								paddingBottom: contentBottomPadding,
							},
						]}
						showsVerticalScrollIndicator={false}
					>
						<View
							style={[
								styles.pdfCard,
								contentMaxWidth
									? { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }
									: null,
							]}
						>
							<View style={styles.watermarkContainer} pointerEvents='none'>
								<View
									style={[
										styles.watermarkInner,
										{ borderColor: watermark.borderColor },
									]}
								>
									<Text
										style={[styles.watermarkText, { color: watermark.color }]}
									>
										{watermark.label}
									</Text>
								</View>
							</View>

							<View style={styles.docContent}>
								<View style={styles.docHeader}>
									<Text style={styles.docLogo}>KomKom</Text>
									<Text style={styles.docTitle}>FACTURE</Text>
								</View>

								<View style={styles.metaRow}>
									<View style={styles.metaCol}>
										<Text style={styles.metaText}>
											<Text style={styles.metaBold}>N° Facture : </Text>
											{invoice.invoiceNumber}
										</Text>
										<Text style={styles.metaText}>
											<Text style={styles.metaBold}>Date d'emission : </Text>
											{invoice.issuedAt}
										</Text>
									</View>
									<View style={[styles.metaCol, styles.metaColRight]}>
										<Text style={[styles.metaText, styles.textRight]}>
											<Text style={styles.metaBold}>Ref. Commande : </Text>
											{invoice.orderReference}
										</Text>
										<Text style={[styles.metaText, styles.textRight]}>
											<Text style={styles.metaBold}>Echeance : </Text>
											{invoice.issuedAt}
										</Text>
									</View>
								</View>

								<View style={styles.addressesRow}>
									<View style={styles.addressCol}>
										<Text style={styles.addressTitle}>Emetteur</Text>
										<Text style={styles.addressName}>{invoice.issuer.name}</Text>
										<Text style={styles.addressText}>{invoice.issuer.address}</Text>
										<Text style={styles.addressText}>
											{invoice.issuer.email} - {invoice.issuer.phone}
										</Text>
									</View>
									<View style={[styles.addressCol, styles.addressColRight]}>
										<Text style={[styles.addressTitle, styles.textRight]}>Client</Text>
										<Text style={[styles.addressName, styles.textRight]}>
											{invoice.client.name}
										</Text>
										<Text style={[styles.addressText, styles.textRight]}>
											{invoice.client.address}
										</Text>
										<Text style={[styles.addressText, styles.textRight]}>
											{invoice.client.phone}
										</Text>
									</View>
								</View>

								<View style={styles.table}>
									<View style={[styles.tableRow, styles.tableHeaderRow]}>
										<Text style={[styles.tableHeaderCell, styles.colDescription]}>
											Description
										</Text>
										<Text
											style={[
												styles.tableHeaderCell,
												styles.textCenter,
												{ width: colQtyWidth },
											]}
										>
											Qte
										</Text>
										<Text
											style={[
												styles.tableHeaderCell,
												styles.textRight,
												{ width: colPriceWidth },
											]}
										>
											Prix U.
										</Text>
										<Text
											style={[
												styles.tableHeaderCell,
												styles.textRight,
												{ width: colTotalWidth },
											]}
										>
											Total
										</Text>
									</View>

									{invoice.items.map((item) => (
										<View key={item.id} style={[styles.tableRow, styles.tableDataRow]}>
											<View style={styles.colDescription}>
												<Text style={styles.itemName} numberOfLines={2}>
													{item.name}
												</Text>
											</View>
											<Text
												style={[
													styles.tableDataCell,
													styles.textCenter,
													{ width: colQtyWidth },
												]}
											>
												{String(item.quantity)}
											</Text>
											<Text
												style={[
													styles.tableDataCell,
													styles.textRight,
													{ width: colPriceWidth },
												]}
											>
												{formatPrice(item.unitPrice, invoice.currency)}
											</Text>
											<Text
												style={[
													styles.tableDataCell,
													styles.textRight,
													{ width: colTotalWidth },
												]}
											>
												{formatPrice(item.lineTotal, invoice.currency)}
											</Text>
										</View>
									))}
								</View>

								<View style={styles.totalsContainer}>
									<View style={styles.totalsBlock}>
										<View style={styles.summaryRow}>
											<Text style={styles.summaryLabel}>Sous-total HT</Text>
											<Text style={styles.summaryValue}>
												{formatPrice(invoice.subtotal, invoice.currency)}
											</Text>
										</View>
										<View style={styles.summaryRow}>
											<Text style={styles.summaryLabel}>Frais de livraison</Text>
											<Text style={styles.summaryValue}>
												{formatPrice(invoice.deliveryFee, invoice.currency)}
											</Text>
										</View>
										<View style={styles.summaryRow}>
											<Text style={styles.summaryLabel}>
												TVA ({String(invoice.taxRate)}%)
											</Text>
											<Text style={styles.summaryValue}>
												{formatPrice(invoice.taxAmount, invoice.currency)}
											</Text>
										</View>
										<View style={[styles.summaryRow, styles.grandTotalRow]}>
											<Text style={styles.grandTotalLabel}>Total TTC</Text>
											<Text style={styles.grandTotalValue}>
												{formatPrice(invoice.total, invoice.currency)}
											</Text>
										</View>
									</View>
								</View>

								<View style={styles.termsBlock}>
									<Text style={styles.termsText}>
										<Text style={styles.termsBold}>Conditions de paiement : </Text>
										Le paiement est du a reception de la facture. Aucun escompte pour
										paiement anticipe. En cas de retard, une penalite de 3 fois le taux
										d'interet legal sera appliquee.
									</Text>
								</View>
							</View>

							<View style={styles.docFooter}>
								<View style={styles.docFooterDivider} />
								<Text style={styles.docFooterText}>
									KomKom Pro Marketplace - Document genere electroniquement
								</Text>
								<Text style={styles.docFooterText}>{`Page 1 sur ${String(pageCount)}`}</Text>
							</View>
						</View>
                        <View style={styles.toolbarRow}>
							<View style={styles.pageIndicatorBadge}>
								<Text style={styles.pageIndicatorText}>{`1 / ${String(pageCount)}`}</Text>
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
							title='Enregistrer'
							variant='secondary'
							onPress={pdfActions.handleSave}
							loading={pdfActions.activeAction === 'save'}
							disabled={pdfActions.activeAction !== null}
							containerStyle={styles.bottomActionButton}
							leftIcon={
								pdfActions.activeAction !== 'save' ? (
									<Icon
										name='download'
										size={18}
										color={lightColors.text.primary}
									/>
								) : undefined
							}
						/>
						<Button
							title='Partager'
							variant='primary'
							onPress={pdfActions.handleShare}
							loading={pdfActions.activeAction === 'share'}
							disabled={pdfActions.activeAction !== null}
							containerStyle={styles.bottomActionButtonFlex}
							leftIcon={
								pdfActions.activeAction !== 'share' ? (
									<Icon
										name='share'
										size={18}
										color={lightColors.text.onPrimary}
									/>
								) : undefined
							}
						/>
					</View>
				</>
			)}
		</View>
	);
};

const DOC_FONT_BASE = 9;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	appBarOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 30,
		elevation: 30,
	},
	canvas: {
		flex: 1,
		backgroundColor: lightColors.border.default,
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
	toolbarRow: {
		alignItems: 'center',
		marginTop: spacing.s2,
	},
	pageIndicatorBadge: {
		backgroundColor: 'rgba(15,23,36,0.6)',
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s0,
		borderRadius: 999,
	},
	pageIndicatorText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: '500',
		letterSpacing: 0.5,
	},
	pdfCard: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: spacing.s3,
        marginTop: spacing.s2,
		paddingTop: spacing.s3,
		paddingBottom: 56,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 24,
		elevation: 8,
		overflow: 'hidden',
	},
	watermarkContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 0,
	},
	watermarkInner: {
		borderWidth: 4,
		borderRadius: 6,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s1,
		transform: [{ rotate: '-30deg' }],
	},
	watermarkText: {
		fontSize: 28,
		fontWeight: '800',
		textTransform: 'uppercase',
		letterSpacing: 4,
	},
	docContent: {
		zIndex: 1,
	},
	docHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		borderBottomWidth: 2,
		borderBottomColor: lightColors.primary,
		paddingBottom: 10,
		marginBottom: 16,
	},
	docLogo: {
		fontSize: 18,
		fontWeight: '800',
		color: lightColors.primary,
	},
	docTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: lightColors.text.primary as string,
		letterSpacing: 1,
	},
	metaRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
		columnGap: spacing.s2,
	},
	metaCol: {
		flex: 1,
		rowGap: 4,
	},
	metaColRight: {
		alignItems: 'flex-end',
	},
	metaText: {
		fontSize: DOC_FONT_BASE,
		color: lightColors.text.secondary as string,
		lineHeight: 14,
	},
	metaBold: {
        fontSize: DOC_FONT_BASE,
		fontWeight: '600',
		color: lightColors.text.secondary as string,
	},
	addressesRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
		columnGap: 16,
	},
	addressCol: {
		flex: 1,
		rowGap: 2,
	},
	addressColRight: {
		alignItems: 'flex-end',
	},
	addressTitle: {
		fontSize: 8,
		fontWeight: '600',
		color: lightColors.text.secondary as string,
		textTransform: 'uppercase',
		marginBottom: 4,
	},
	addressName: {
		fontSize: DOC_FONT_BASE,
		fontWeight: '700',
		color: lightColors.text.primary as string,
		lineHeight: 13,
	},
	addressText: {
		fontSize: DOC_FONT_BASE,
		color: lightColors.text.primary as string,
		lineHeight: 13,
	},
	table: {
		marginBottom: 16,
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	tableHeaderRow: {
		backgroundColor: lightColors.background.default,
		paddingHorizontal: spacing.s1,
		paddingVertical: 6,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	tableDataRow: {
		paddingHorizontal: spacing.s1,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: lightColors.border.default,
	},
	tableHeaderCell: {
		fontSize: 8,
		fontWeight: '600',
		color: lightColors.text.secondary as string,
		textTransform: 'uppercase',
	},
	tableDataCell: {
		fontSize: DOC_FONT_BASE,
		color: lightColors.text.primary as string,
		lineHeight: 13,
	},
	colDescription: {
		flex: 1,
		paddingRight: spacing.s1,
	},
	itemName: {
		fontSize: DOC_FONT_BASE,
		fontWeight: '600',
		color: lightColors.text.primary as string,
		lineHeight: 13,
	},
	totalsContainer: {
		alignItems: 'flex-end',
	},
	totalsBlock: {
		width: '60%',
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4,
	},
	summaryLabel: {
		fontSize: DOC_FONT_BASE,
		color: lightColors.text.secondary as string,
	},
	summaryValue: {
		fontSize: DOC_FONT_BASE,
		color: lightColors.text.secondary as string,
		textAlign: 'right',
	},
	grandTotalRow: {
		borderTopWidth: 1,
		borderTopColor: lightColors.text.primary as string,
		paddingTop: 6,
		marginTop: spacing.s1,
	},
	grandTotalLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: lightColors.text.primary as string,
	},
	grandTotalValue: {
		fontSize: 11,
		fontWeight: '700',
		color: lightColors.text.primary as string,
		textAlign: 'right',
	},
	termsBlock: {
		marginTop: spacing.s4,
	},
	termsText: {
		fontSize: 7,
		color: lightColors.text.secondary as string,
		lineHeight: 10,
	},
	termsBold: {
        fontSize: 7,
		fontWeight: '700',
		color: lightColors.text.secondary as string,
	},
	docFooter: {
		marginTop: spacing.s4,
		alignItems: 'center',
		rowGap: spacing.s0,
	},
	docFooterDivider: {
		width: '100%',
		height: 1,
		backgroundColor: lightColors.border.default,
		marginBottom: spacing.s1,
	},
	docFooterText: {
		fontSize: 8,
		color: lightColors.text.secondary as string,
		textAlign: 'center',
	},
	textRight: {
		textAlign: 'right',
	},
	textCenter: {
		textAlign: 'center',
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
	bottomActionButton: {
		height: BOTTOM_ACTION_BAR_MIN_HEIGHT,
	},
	bottomActionButtonFlex: {
		flex: 1,
		height: BOTTOM_ACTION_BAR_MIN_HEIGHT,
	},
});

export default OrderInvoicePdfViewerScreen;