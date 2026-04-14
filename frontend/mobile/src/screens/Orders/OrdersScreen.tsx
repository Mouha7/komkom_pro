import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ErrorState, OrdersAppBar, OrdersListFiltered } from '../../components';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useOrders } from '../../hooks/useOrders';
import { useToast } from '../../hooks/useToast';
import { lightColors } from '../../styles/colors';

type OrdersScreenProps = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, 'Orders'>,
	NativeStackScreenProps<RootStackParamList>
>;

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
	const { orders, isLoading, errorMessage, reload } = useOrders();
	const { showToast } = useToast();
	const [searchQuery, setSearchQuery] = useState('');
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
			<OrdersAppBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
			<View style={styles.contentContainer}>
				{errorMessage ? (
					<ErrorState
						title='Commandes indisponibles'
						description={errorMessage}
						actionLabel={isReloading ? 'Rechargement...' : 'Reessayer'}
						onActionPress={handleReload}
					/>
				) : (
					<OrdersListFiltered
						orders={orders}
						searchQuery={searchQuery}
						isLoading={isLoading}
						onClearSearch={() => setSearchQuery('')}
						onViewDetails={(orderId) => {
							navigation.navigate('OrderDetail', { orderId });
						}}
						onFollowOrder={(orderId) => {
							navigation.navigate('OrderTracking', { orderId });
						}}
						onRecommend={(orderId) => {
							showToast({
								tone: 'success',
								title: 'Recommander',
								message: `Recommander les articles de ${orderId}`,
								actionLabel: 'Ajouter au panier',
								actionLabelA11y: 'Ajouter au panier',
								onActionPress: () => navigation.navigate('Cart'),
							});
						}}
						onRetry={handleReload}
					/>
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	contentContainer: {
		flex: 1,
	},
});

export default OrdersScreen;

