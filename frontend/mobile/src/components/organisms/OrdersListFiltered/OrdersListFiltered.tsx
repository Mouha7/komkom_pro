import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text } from '../../atoms';
import { OrderCard } from '../../molecules/OrderCard';
import { OrderFiltersBar } from '../../molecules/OrderFilters';
import { ORDER_FILTERS } from '../../molecules/OrderFilters/OrderFilters.constants';
import type { OrderFilterType } from '../../molecules/OrderFilters/OrderFilters.types';
import { styles } from './OrdersListFiltered.styles';
import type { OrdersListFilteredProps, OrderSummaryItem } from './OrdersListFiltered.types';

const mapStatusToFilter = (status: string): OrderFilterType => {
	switch (status) {
		case 'pending':
			return 'in_progress';
		case 'delivered':
			return 'delivered';
		case 'cancelled':
			return 'cancelled';
		default:
			return 'all';
	}
};

export const OrdersListFiltered: React.FC<OrdersListFilteredProps> = ({
	orders,
	searchQuery = '',
	isLoading = false,
	errorMessage,
	onViewDetails,
	onFollowOrder,
	onRecommend,
	onRetry,
	containerStyle,
	testID,
}) => {
	const [activeFilter, setActiveFilter] = useState<OrderFilterType>('all');

	const filteredOrders = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		return orders.filter((order) => {
			const matchesFilter =
				activeFilter === 'all' || mapStatusToFilter(order.status) === activeFilter;

			if (!matchesFilter) {
				return false;
			}

			if (!normalizedQuery) {
				return true;
			}

			const searchableText = [order.reference, order.id]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();

			return searchableText.includes(normalizedQuery);
		});
	}, [orders, activeFilter, searchQuery]);

	const handleFilterChange = (filter: OrderFilterType): void => {
		setActiveFilter(filter);
	};

	if (errorMessage) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>{errorMessage}</Text>
				{onRetry && (
					<Text style={[styles.emptyText, { marginTop: 16, color: '#ED762F' }]}>
						Tap to retry
					</Text>
				)}
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>Chargement des commandes...</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			{/* Filter Bar */}
			<OrderFiltersBar
				activeFilter={activeFilter}
				filters={ORDER_FILTERS}
				onFilterChange={handleFilterChange}
			/>

			{/* Orders List */}
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={styles.listContainer}
				scrollEventThrottle={16}
			>
				{filteredOrders.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>Aucune commande dans cette catégorie</Text>
					</View>
				) : (
					filteredOrders.map((order) => (
						<OrderCard
							key={order.id}
							orderId={order.id}
							reference={order.reference}
							date={order.createdAt || 'Date non disponible'}
							status={order.status}
							itemsCount={order.itemsCount || 0}
							items={[]}
							total={order.total}
							currency={order.currency}
							onViewDetails={() => onViewDetails?.(order.id)}
							onFollowOrder={() => onFollowOrder?.(order.id)}
							onRecommend={() => onRecommend?.(order.id)}
						/>
					))
				)}
			</ScrollView>
		</View>
	);
};
