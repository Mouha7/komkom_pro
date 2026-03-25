import type { StyleProp, ViewStyle } from 'react-native';

import type { StockStatus } from '../../atoms/StatusChip';

export type ProductCardVariant = 'portrait' | 'landscape';

export type ProductCardProps = {
	productId: string;
	name: string;
	price: number;
	currency?: string;
	description?: string;
	imageUrl?: string;
	stockStatus?: StockStatus;
	variant?: ProductCardVariant;
	onAddToCart?: (productId: string) => void;
	onCartToggle?: (productId: string, isSelected: boolean, productName: string) => void;
	onPress?: (productId: string) => void;
	onOutOfStockPress?: (productName: string) => void;
	disabled?: boolean;
	testID?: string;
	containerStyle?: StyleProp<ViewStyle>;
};
