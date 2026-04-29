import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProductDetail } from '../../components';
import { useCart } from '../../hooks/useCart';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
	const { addItem } = useCart();

	return (
		<ProductDetail
			productId={route.params.productId}
			onPressBack={() => navigation.goBack()}
			onOpenCart={() => navigation.navigate('Cart')}
			onAddToCart={(payload) => {
				void addItem(payload.productId, payload.quantity);
			}}
		/>
	);
};

export default ProductDetailScreen;
