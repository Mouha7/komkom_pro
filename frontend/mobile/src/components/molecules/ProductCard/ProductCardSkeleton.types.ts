import type { StyleProp, ViewStyle } from 'react-native';

import type { ProductCardVariant } from './ProductCard.types';

export type ProductCardSkeletonProps = {
	variant?: ProductCardVariant;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
