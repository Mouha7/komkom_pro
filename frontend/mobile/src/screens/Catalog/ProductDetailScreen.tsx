import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProductDetail } from '../../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
	return (
		<ProductDetail
			productId={route.params.productId}
			onPressBack={() => navigation.goBack()}
			onOpenCart={() => navigation.navigate('Cart')}
		/>
	);
};

export default ProductDetailScreen;
