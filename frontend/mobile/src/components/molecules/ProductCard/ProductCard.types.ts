import type { StyleProp, ViewStyle } from 'react-native';

import type { StockStatus } from '../../atoms/StatusChip';

export type ProductCardProps = {
	productId: string;
	name: string;
	price: number;
	currency?: string;
	description?: string;
	imageUrl?: string;
	stockStatus?: StockStatus;
	onAddToCart?: (productId: string) => void;
	onPress?: (productId: string) => void;
	disabled?: boolean;
	testID?: string;
	containerStyle?: StyleProp<ViewStyle>;
};
