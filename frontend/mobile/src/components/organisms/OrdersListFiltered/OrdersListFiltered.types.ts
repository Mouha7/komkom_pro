import type { StyleProp, ViewStyle } from 'react-native';
import type { OrderStatus } from '../../atoms/StatusChip';
import type { OrderFilterType } from '../../molecules/OrderFilters/OrderFilters.types';

export interface OrderSummaryItem {
	id: string;
	reference: string;
	total: number;
	currency?: string;
	status: OrderStatus;
	createdAt?: string;
	itemsSummary?: string;
	itemsCount?: number;
	items?: Array<{
		name: string;
		quantity: number;
	}>;
}

export type OrdersListFilteredProps = {
	orders: OrderSummaryItem[];
	searchQuery?: string;
	isLoading?: boolean;
	errorMessage?: string;
	onViewDetails?: (orderId: string) => void;
	onFollowOrder?: (orderId: string) => void;
	onRecommend?: (orderId: string) => void;
	onRetry?: () => void;
	onClearSearch?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};

export type OrdersListFilteredState = {
	activeFilter: OrderFilterType;
};
