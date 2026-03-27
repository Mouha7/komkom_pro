import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppBar, CartList, ErrorState } from '../../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
	const { items, isLoading, errorMessage, reload } = useCart();
	const { showToast } = useToast();
	const [isReloading, setIsReloading] = useState(false);

	const handleReload = (): void => {
		if (isReloading) {
			return;
		}

		setIsReloading(true);
		void reload().finally(() => {
			setIsReloading(false);
		});
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<AppBar title='Panier' titleAlign='left' leftIconName='arrowLeft' onPressLeft={() => navigation.goBack()} />
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
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
						onIncreaseQty={(productId) => {
							showToast({
								tone: 'info',
								title: 'Quantite mise a jour',
								message: `Produit ${productId}: quantite augmentee`,
							});
						}}
						onDecreaseQty={(productId) => {
							showToast({
								tone: 'info',
								title: 'Quantite mise a jour',
								message: `Produit ${productId}: quantite reduite`,
							});
						}}
						onRemoveItem={(productId) => {
							showToast({
								tone: 'warning',
								title: 'Article retire',
								message: `Produit ${productId} retire du panier`,
							});
						}}
						onCheckout={() => {
							showToast({
								tone: 'success',
								title: 'Validation',
								message: 'Le checkout sera connecte dans une prochaine iteration.',
							});
						}}
					/>
				)}
			</ScrollView>
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
	contentContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s4,
		paddingBottom: spacing.s5,
	},
});

export default CartScreen;
