import type { StyleProp, ViewStyle } from 'react-native';
import type { OrderStatus } from '../../atoms/StatusChip';

export type OrderItemSummary = {
	name: string;
	quantity: number;
};

export type OrderCardProps = {
	orderId: string;
	reference: string;
	date: string;
	status: OrderStatus;
	items: OrderItemSummary[];
	itemsCount: number;
	total: number;
	currency?: string;
	onViewDetails?: () => void;
	onFollowOrder?: () => void;
	onRecommend?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
