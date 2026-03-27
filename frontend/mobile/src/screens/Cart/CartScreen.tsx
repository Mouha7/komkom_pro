import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, CartAppBar, CartList, ErrorState, Icon, StatusChip } from '../../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const SYNC_BADGE_DURATION_MS = 3200;
let hasShownCartSyncBadgeThisSession = false;

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
	const insets = useSafeAreaInsets();
	const { items, isLoading, errorMessage, reload } = useCart();
	const { showToast } = useToast();
	const [isReloading, setIsReloading] = useState(false);
	const [isSyncBadgeVisible, setIsSyncBadgeVisible] = useState(
		!hasShownCartSyncBadgeThisSession,
	);
	const [footerHeight, setFooterHeight] = useState(0);
	const syncBadgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const contentContainerStyle = useMemo(
		() => [styles.contentContainer, { paddingBottom: footerHeight + spacing.s3 }],
		[footerHeight],
	);

	useEffect(() => {
		if (hasShownCartSyncBadgeThisSession) {
			return () => {
				if (syncBadgeTimerRef.current) {
					clearTimeout(syncBadgeTimerRef.current);
				}
			};
		}

		hasShownCartSyncBadgeThisSession = true;
		syncBadgeTimerRef.current = setTimeout(() => {
			setIsSyncBadgeVisible(false);
		}, SYNC_BADGE_DURATION_MS);

		return () => {
			if (syncBadgeTimerRef.current) {
				clearTimeout(syncBadgeTimerRef.current);
			}
		};
	}, []);

	const handleReload = (): void => {
		if (isReloading) {
			return;
		}

		setIsReloading(true);
		void reload().finally(() => {
			setIsReloading(false);
		});
	};

	const handleCheckout = (): void => {
		showToast({
			tone: 'success',
			title: 'Validation',
			message: 'Le checkout sera connecte dans une prochaine iteration.',
		});
	};

	const handleClearCart = (): void => {
		showToast({
			tone: 'warning',
			title: 'Action indisponible',
			message: 'La suppression globale du panier sera connectee dans une prochaine iteration.',
		});
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<CartAppBar
				title='Mon Panier'
				itemCount={items.length}
				onPressBack={() => navigation.goBack()}
				onPressClear={handleClearCart}
				isClearDisabled={items.length === 0}
			/>
			{isSyncBadgeVisible ? (
				<View style={styles.syncBadgeWrap}>
					<StatusChip
						label="Synchronise a l'instant"
						tone='success'
						compact
						containerStyle={styles.syncBadge}
						testID='cart-sync-badge'
					/>
				</View>
			) : null}

			<ScrollView style={styles.scrollView} contentContainerStyle={contentContainerStyle}>
				{errorMessage ? (
					<ErrorState
						title='Panier indisponible'
						description={errorMessage}
						actionLabel={isReloading ? 'Rechargement...' : 'Reessayer'}
						onActionPress={handleReload}
					/>
				) : (
					<CartList
						items={items}
						isLoading={isLoading}
						onIncreaseQty={() => {
							// Notification desactivee pour augmentation de quantite
						}}
						onDecreaseQty={() => {
							// Notification desactivee pour diminution de quantite
						}}
						onRemoveItem={(productId) => {
							showToast({
								tone: 'warning',
								title: 'Article retire',
								message: `Produit ${productId} retire du panier`,
							});
						}}
						onCheckout={handleCheckout}
					/>
				)}
			</ScrollView>

			<View
				style={[
					styles.checkoutDock,
					{ paddingBottom: Math.max(insets.bottom, spacing.s2) },
				]}
				onLayout={(event) => {
					setFooterHeight(event.nativeEvent.layout.height);
				}}
			>
				<Button
					title='Valider la commande'
					onPress={handleCheckout}
					containerStyle={styles.checkoutButton}
					textStyle={{ fontSize: 16, fontWeight: '700' }}
					rightIcon={<Icon name='arrowRight' size={20} color='#FFFFFF' />}
					accessibilityLabel='Valider la commande'
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	syncBadgeWrap: {
		alignItems: 'center',
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s2,
		paddingBottom: spacing.s1,
	},
	syncBadge: {
		borderRadius: 8,
	},
	contentContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s3,
	},
	checkoutDock: {
		backgroundColor: lightColors.surface.default,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s2,
	},
	checkoutButton: {
		width: '100%',
		minHeight: 48,
	},
});

export default CartScreen;
