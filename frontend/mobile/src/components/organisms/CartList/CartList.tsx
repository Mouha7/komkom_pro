import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import { Text } from "../../atoms";
import { CartItem } from "../../molecules/CartItem";
import { OrderSummaryCard } from "../OrderSummaryCard";
import { styles } from "./CartList.styles";
import type { CartListProps } from "./CartList.types";

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat("fr-FR").format(price) + " " + currency;
};

export const CartList: React.FC<CartListProps> = ({
	items,
	currency = "FCFA",
	isLoading = false,
	emptyLabel = "Votre panier est vide.",
	onIncreaseQty,
	onDecreaseQty,
	onRemoveItem,
	onCheckout,
	containerStyle,
	testID,
	renderItemFooter,
}) => {
	const [localItems, setLocalItems] = useState(items);

	useEffect(() => {
		setLocalItems(items);
	}, [items]);

	const subtotal = localItems.reduce(
		(total, item) => total + item.price * item.quantity,
		0,
	);
	const totalItems = localItems.reduce((total, item) => total + item.quantity, 0);

	const handleIncreaseQty = useMemo(
		() => (productId: string): void => {
			setLocalItems((current) =>
				current.map((item) =>
					item.productId === productId
						? { ...item, quantity: item.quantity + 1 }
						: item,
				),
			);
			onIncreaseQty?.(productId);
		},
		[onIncreaseQty],
	);

	const handleDecreaseQty = useMemo(
		() => (productId: string): void => {
			setLocalItems((current) =>
				current.map((item) => {
					if (item.productId !== productId) {
						return item;
					}

					return {
						...item,
						quantity: Math.max(1, item.quantity - 1),
					};
				}),
			);
			onDecreaseQty?.(productId);
		},
		[onDecreaseQty],
	);

	if (isLoading) {
		return (
			<View style={[styles.loader, containerStyle]} testID={testID}>
				<ActivityIndicator size="large" color="#ED762F" />
			</View>
		);
	}

	if (localItems.length === 0) {
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
				data={localItems}
				scrollEnabled={false}
				keyExtractor={(item) => item.productId}
				contentContainerStyle={styles.listContent}
				renderItem={(info) => (
					<View>
						<CartItem
							item={info.item}
							onIncrease={handleIncreaseQty}
							onDecrease={handleDecreaseQty}
							onRemove={onRemoveItem}
						/>
						{renderItemFooter ? renderItemFooter(info) : null}
					</View>
				)}
			/>
			<OrderSummaryCard
				totalItems={totalItems}
				subtotalText={formatPrice(subtotal, currency)}
				deliveryText='À calculer'
				totalText={formatPrice(subtotal, currency)}
			/>
		</View>
	);
};
