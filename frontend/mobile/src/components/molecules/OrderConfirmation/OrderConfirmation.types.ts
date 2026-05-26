import type { StyleProp, ViewStyle } from 'react-native';

export interface OrderConfirmationHeaderIconProps {
	containerStyle?: StyleProp<ViewStyle>;
}

export type OrderConfirmationStatusType = 'secured' | 'pending' | 'completed';

export interface OrderConfirmationSummaryItem {
	label: string;
	value: string;
	subvalue?: string;
}

export interface OrderConfirmationSummaryCardProps {
	orderId: string;
	status: OrderConfirmationStatusType;
	items: OrderConfirmationSummaryItem[];
	totalAmount: string;
	containerStyle?: StyleProp<ViewStyle>;
}

export interface OrderConfirmationActionBarProps {
	onFollowOrder: () => void;
	onReturnHome: () => void;
	containerStyle?: StyleProp<ViewStyle>;
}

export interface OrderConfirmationScreenData {
	orderId: string;
	status: OrderConfirmationStatusType;
	deliveryTime: string;
	address: string;
	addressSubtitle: string;
	paymentMethod: string;
	commodities: number;
	subtotal: number;
	deliveryFee: number;
	total: number;
	currency: string;
}
