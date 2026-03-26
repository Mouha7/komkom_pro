import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { ProductCardList } from './ProductCardList';

const meta = {
	title: 'Organisms/ProductCardList',
	component: ProductCardList,
};

export default meta;

const sampleProducts = [
	{
		productId: 'product-1',
		name: 'Perceuse Visseuse sans fil 18V',
		price: 3500,
		description: 'Unite',
		stockStatus: 'in_stock' as const,
	},
	{
		productId: 'product-2',
		name: 'Ciment Portland CPJ 35',
		price: 4500,
		description: 'Sac de 50 kg',
		stockStatus: 'low_stock' as const,
	},
	{
		productId: 'product-3',
		name: 'Cable Electrique U1000 R2V 3G1.5',
		price: 18500,
		description: 'Rouleau de 50m',
		stockStatus: 'out_of_stock' as const,
	},
];

export const Default = {
	render: () => (
		<ProductCardList
			items={sampleProducts}
			onPressProduct={() => undefined}
			onAddToCart={() => undefined}
			onCartToggle={() => undefined}
		/>
	),
};

export const LoadingInitial = {
	render: () => <ProductCardList items={[]} isLoadingInitial skeletonCount={4} />,
};

export const LoadingMore = {
	render: () => (
		<ProductCardList
			items={sampleProducts}
			isLoadingMore
			skeletonCount={2}
			onPressProduct={() => undefined}
			onAddToCart={() => undefined}
			onCartToggle={() => undefined}
		/>
	),
};

export const Landscape = {
	render: () => (
		<View style={{ rowGap: spacing.s3 }}>
			<ProductCardList
				items={sampleProducts}
				variant="landscape"
				onPressProduct={() => undefined}
				onAddToCart={() => undefined}
				onCartToggle={() => undefined}
			/>
		</View>
	),
};
