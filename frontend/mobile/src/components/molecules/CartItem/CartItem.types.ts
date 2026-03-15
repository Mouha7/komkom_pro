import type { StyleProp, ViewStyle } from 'react-native';

import type { StockStatus } from '../../atoms/StatusChip';

export type CartItemData = {
	productId: string;
	name: string;
	price: number;
	currency?: string;
	quantity: number;
	description?: string;
	imageUrl?: string;
	stockStatus?: StockStatus;
};

export type CartItemProps = {
	item: CartItemData;
	onIncrease?: (productId: string) => void;
	onDecrease?: (productId: string) => void;
	onRemove?: (productId: string) => void;
	disabled?: boolean;
	testID?: string;
	containerStyle?: StyleProp<ViewStyle>;
};
