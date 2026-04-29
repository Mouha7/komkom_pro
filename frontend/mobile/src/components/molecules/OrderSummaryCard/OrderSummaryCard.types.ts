import type { StyleProp, ViewStyle } from 'react-native';

export type OrderSummaryCardProps = {
	totalItems: number;
	subtotalText: string;
	deliveryText: string;
	totalText: string;
	subtotalLabel?: string;
	deliveryLabel?: string;
	totalLabel?: string;
	containerStyle?: StyleProp<ViewStyle>;
};
