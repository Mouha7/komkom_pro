import type { ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';

import type { CartItemData } from '../../molecules/CartItem';

export type CartListProps = {
	items: CartItemData[];
	currency?: string;
	isLoading?: boolean;
	emptyLabel?: string;
	onIncreaseQty?: (productId: string) => void;
	onDecreaseQty?: (productId: string) => void;
	onRemoveItem?: (productId: string) => void;
	onCheckout?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
	renderItemFooter?: (info: ListRenderItemInfo<CartItemData>) => React.ReactElement | null;
};
