import React from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';

import { StatusBadge, Text } from '../../atoms';
import { formatAmount } from '../../../utils/formatPrice';
import { formatDateSafe, parseDateSafe } from '../../../utils/formatDate';
import { styles } from './OrderList.styles';
import type { OrderListProps, OrderSummaryItem } from './OrderList.types';

const formatPrice = (price: number, currency: string): string => {
	return formatAmount(price) + ' ' + currency;
};

const renderDate = (isoDate?: string): string => {
	const date = parseDateSafe(isoDate);
	if (!date) {
		return 'Date non disponible';
	}
	return formatDateSafe(date, { day: '2-digit', month: 'short', year: 'numeric' });
};

const Row: React.FC<{
	item: OrderSummaryItem;
	currency: string;
	onPressOrder?: (orderId: string) => void;
}> = ({ item, currency, onPressOrder }) => {
	return (
		<Pressable
			style={styles.item}
			onPress={() => onPressOrder?.(item.id)}
			accessibilityRole="button"
			accessibilityLabel={'Commande ' + item.reference}
		>
			<View style={styles.head}>
				<View style={styles.meta}>
					<Text variant="h3">{item.reference}</Text>
					<Text variant="small" color="secondary">
						{renderDate(item.createdAt)}
					</Text>
				</View>
				<StatusBadge orderStatus={item.status} compact />
			</View>
			<View style={styles.bottom}>
				<Text variant="small" color="secondary">
					Total
				</Text>
				<Text variant="h2">{formatPrice(item.total, item.currency || currency)}</Text>
			</View>
		</Pressable>
	);
};

export const OrderList: React.FC<OrderListProps> = ({
	orders,
	currency = 'FCFA',
	isLoading = false,
	emptyLabel = 'Aucune commande disponible.',
	onPressOrder,
	containerStyle,
	testID,
}) => {
	if (isLoading) {
		return (
			<View style={[styles.loader, containerStyle]} testID={testID}>
				<ActivityIndicator size="large" color="#ED762F" />
			</View>
		);
	}

	if (orders.length === 0) {
		return (
			<View style={[styles.empty, containerStyle]} testID={testID}>
				<Text variant="body" color="secondary">
					{emptyLabel}
				</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<FlatList
				data={orders}
				scrollEnabled={false}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => <Row item={item} currency={currency} onPressOrder={onPressOrder} />}
			/>
		</View>
	);
};
