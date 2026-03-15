import type { StyleProp, ViewStyle } from 'react-native';

import type { OrderStatus } from '../../atoms/StatusChip';

export type OrderSummaryItem = {
	id: string;
	reference: string;
	total: number;
	currency?: string;
	status: OrderStatus;
	createdAt?: string;
};

export type OrderListProps = {
	orders: OrderSummaryItem[];
	currency?: string;
	isLoading?: boolean;
	emptyLabel?: string;
	onPressOrder?: (orderId: string) => void;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
