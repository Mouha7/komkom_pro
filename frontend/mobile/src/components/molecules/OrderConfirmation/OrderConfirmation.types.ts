export interface OrderConfirmationHeaderIconProps {
	containerStyle?: any;
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
	containerStyle?: any;
}

export interface OrderConfirmationActionBarProps {
	onFollowOrder: () => void;
	onReturnHome: () => void;
	containerStyle?: any;
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
