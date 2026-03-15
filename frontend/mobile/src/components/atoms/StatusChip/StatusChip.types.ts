import type { StyleProp, ViewStyle } from 'react-native';

export type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export type StatusChipProps = {
	label: string;
	tone?: StatusTone;
	compact?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};

export type StatusBadgeProps = {
	stockStatus?: StockStatus;
	orderStatus?: OrderStatus;
	compact?: boolean;
	testID?: string;
};
