import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppBar, ErrorState, OrderList, Text } from '../../components';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useOrders } from '../../hooks/useOrders';
import { useToast } from '../../hooks/useToast';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type OrdersScreenProps = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, 'Orders'>,
	NativeStackScreenProps<RootStackParamList>
>;

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
	const { orders, isLoading, errorMessage, reload } = useOrders();
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
			<AppBar title='Commandes' titleAlign='left' />
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
				{errorMessage ? (
					<ErrorState
						title='Commandes indisponibles'
						description={errorMessage}
						actionLabel={isReloading ? 'Rechargement...' : 'Reessayer'}
						onActionPress={handleReload}
					/>
				) : (
					<View style={styles.card}>
						<Text variant='h3' textColorOverride={lightColors.text.primary}>
							Historique de commandes
						</Text>
						<OrderList
							orders={orders}
							isLoading={isLoading}
							onPressOrder={(orderId) => {
								showToast({
									tone: 'info',
									title: 'Detail commande',
									message: `Commande ${orderId} selectionnee`,
									actionLabel: 'Voir',
									actionLabelA11y: 'Voir le panier',
									onActionPress: () => navigation.navigate('Cart'),
								});
							}}
						/>
					</View>
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
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		padding: spacing.s4,
		rowGap: spacing.s2,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
	},
});

export default OrdersScreen;

