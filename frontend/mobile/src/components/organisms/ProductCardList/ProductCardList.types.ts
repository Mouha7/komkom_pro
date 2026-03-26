import type { StyleProp, ViewStyle } from 'react-native';

import type { StockStatus } from '../../atoms';
import type { ProductCardVariant } from '../../molecules';

export type ProductListItemData = {
	productId: string;
	name: string;
	price: number;
	currency?: string;
	description?: string;
	imageUrl?: string;
	stockStatus?: StockStatus;
};

export type ProductCardListProps = {
	items: ProductListItemData[];
	variant?: ProductCardVariant;
	isLoadingInitial?: boolean;
	isLoadingMore?: boolean;
	skeletonCount?: number;
	minInitialRows?: number;
	onPressProduct?: (productId: string) => void;
	onAddToCart?: (productId: string) => void;
	onCartToggle?: (productId: string, isSelected: boolean, productName: string) => void;
	onOutOfStockPress?: (productName: string) => void;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
