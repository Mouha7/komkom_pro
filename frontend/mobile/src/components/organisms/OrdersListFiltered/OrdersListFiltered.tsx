import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { EmptyState, Icon, Text } from '../../atoms';
import { OrderCard } from '../../molecules/OrderCard';
import { OrderFiltersBar } from '../../molecules/OrderFilters';
import { ORDER_FILTERS } from '../../molecules/OrderFilters/OrderFilters.constants';
import type { OrderFilterType } from '../../molecules/OrderFilters/OrderFilters.types';
import { FALLBACK_ORDER_ITEMS_BY_STATUS } from '../../../mocks/orders';
import { formatDateSafe, parseDateSafe } from '../../../utils/formatDate';
import { styles } from './OrdersListFiltered.styles';
import type { OrdersListFilteredProps, OrderSummaryItem } from './OrdersListFiltered.types';

const mapStatusToFilter = (status: string): OrderFilterType => {
	switch (status) {
		case 'pending':
		case 'confirmed':
			return 'in_progress';
		case 'delivered':
			return 'delivered';
		case 'cancelled':
			return 'cancelled';
		default:
			return 'in_progress';
	}
};

const formatOrderDate = (isoDate?: string): string => {
	const date = parseDateSafe(isoDate);
	if (!date) {
		return 'Date non disponible';
	}

	const today = new Date();
	const isToday =
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear();

	const timeLabel = formatDateSafe(date, {
		hour: '2-digit',
		minute: '2-digit',
	});

	if (isToday) {
		return `Aujourd'hui, ${timeLabel}`;
	}

	const dayLabel = formatDateSafe(date, {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	return `${dayLabel}, ${timeLabel}`;
};

const resolveOrderItems = (order: OrderSummaryItem) => {
	if (order.items && order.items.length > 0) {
		return order.items;
	}

	if (order.itemsSummary) {
		return [{ name: order.itemsSummary, quantity: 1 }];
	}

	switch (order.status) {
		case 'pending':
			return [...FALLBACK_ORDER_ITEMS_BY_STATUS.pending];
		case 'confirmed':
			return [...FALLBACK_ORDER_ITEMS_BY_STATUS.confirmed];
		case 'delivered':
			return [...FALLBACK_ORDER_ITEMS_BY_STATUS.delivered];
		case 'cancelled':
			return [...FALLBACK_ORDER_ITEMS_BY_STATUS.cancelled];
		case 'draft':
		default:
			return [...FALLBACK_ORDER_ITEMS_BY_STATUS.pending];
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
	onClearSearch,
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

	const handleResetEmptyState = (): void => {
		setActiveFilter('all');
		onClearSearch?.();
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

	const hasSearch = searchQuery.trim().length > 0;
	const isFilterActive = activeFilter !== 'all';
	const isOrdersDatasetEmpty = orders.length === 0;

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
				showsVerticalScrollIndicator={false}
			>
				{filteredOrders.length === 0 ? (
					<EmptyState
						title={isOrdersDatasetEmpty ? 'Aucune commande' : 'Aucun resultat'}
						description={
							isOrdersDatasetEmpty
								? 'Vos commandes apparaitront ici apres votre premier achat.'
								: 'Aucune commande ne correspond a votre recherche ou a ce filtre.'
						}
						actionLabel={
							hasSearch || isFilterActive
								? 'Reinitialiser les filtres'
								: onRetry
									? 'Actualiser'
									: undefined
						}
						onActionPress={
							hasSearch || isFilterActive
								? handleResetEmptyState
								: onRetry
						}
						icon={<Icon name='package' size={42} color='#6B7280' />}
						containerStyle={styles.emptyStateCard}
					/>
				) : (
					filteredOrders.map((order) => {
						const resolvedItems = resolveOrderItems(order);
						return (
						<OrderCard
							key={order.id}
							orderId={order.id}
							reference={order.reference}
							date={formatOrderDate(order.createdAt)}
							status={order.status}
							itemsCount={order.itemsCount || resolvedItems.length}
							items={resolvedItems}
							total={order.total}
							currency={order.currency}
							onViewDetails={() => onViewDetails?.(order.id)}
							onFollowOrder={() => onFollowOrder?.(order.id)}
							onRecommend={() => onRecommend?.(order.id)}
						/>
						);
					})
				)}
			</ScrollView>
		</View>
	);
};
