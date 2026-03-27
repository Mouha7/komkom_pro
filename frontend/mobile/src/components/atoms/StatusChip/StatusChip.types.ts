import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export type StatusChipProps = {
	label: string;
	tone?: StatusTone;
	size?: 'sm' | 'md' | 'lg';
	compact?: boolean;
	solid?: boolean;
	borderRadius?: number;
	textTransform?: TextStyle['textTransform'];
	containerStyle?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	testID?: string;
};

export type StatusBadgeProps = {
	stockStatus?: StockStatus;
	orderStatus?: OrderStatus;
	size?: 'sm' | 'md' | 'lg';
	compact?: boolean;
	solid?: boolean;
	borderRadius?: number;
	textTransform?: TextStyle['textTransform'];
	containerStyle?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	testID?: string;
};
