import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Button, Text } from '../../atoms';
import { CartItem } from '../../molecules';
import { styles } from './CartList.styles';
import type { CartListProps } from './CartList.types';

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
};

export const CartList: React.FC<CartListProps> = ({
	items,
	currency = 'FCFA',
	isLoading = false,
	emptyLabel = 'Votre panier est vide.',
	onIncreaseQty,
	onDecreaseQty,
	onRemoveItem,
	onCheckout,
	containerStyle,
	testID,
	renderItemFooter,
}) => {
	const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

	if (isLoading) {
		return (
			<View style={[styles.loader, containerStyle]} testID={testID}>
				<ActivityIndicator size="large" color="#ED762F" />
			</View>
		);
	}

	if (items.length === 0) {
		return (
			<View style={[styles.emptyWrap, containerStyle]} testID={testID}>
				<Text variant="body" color="secondary">
					{emptyLabel}
				</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<FlatList
				data={items}
				scrollEnabled={false}
				keyExtractor={(item) => item.productId}
				contentContainerStyle={styles.listContent}
				renderItem={(info) => (
					<View>
						<CartItem
							item={info.item}
							onIncrease={onIncreaseQty}
							onDecrease={onDecreaseQty}
							onRemove={onRemoveItem}
						/>
						{renderItemFooter ? renderItemFooter(info) : null}
					</View>
				)}
			/>
			<View style={styles.summary}>
				<View style={styles.totalRow}>
					<Text variant="body" color="secondary">
						Sous-total
					</Text>
					<Text variant="h2">{formatPrice(subtotal, currency)}</Text>
				</View>
				<Button title="Passer la commande" onPress={onCheckout} />
			</View>
		</View>
	);
};
