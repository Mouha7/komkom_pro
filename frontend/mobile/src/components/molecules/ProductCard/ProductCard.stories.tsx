import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { ProductCard } from './ProductCard';

const meta = {
	title: 'Molecules/ProductCard',
	component: ProductCard,
};

export default meta;

export const Default = {
	render: () => (
		<ProductCard
			productId="product-1"
			name="Perceuse visseuse sans fil 18V"
			price={35000}
			description="Unite"
			onAddToCart={() => undefined}
		/>
	),
};

export const States = {
	render: () => (
		<View style={{ rowGap: spacing.s3 }}>
			<ProductCard
				productId="product-2"
				name="Ciment Portland CPJ 35"
				price={4500}
				description="Sac de 50 kg"
				stockStatus="in_stock"
				onAddToCart={() => undefined}
			/>
			<ProductCard
				productId="product-3"
				name="Cable electrique U1000 R2V 3G1.5"
				price={18500}
				description="Rouleau de 50m"
				stockStatus="low_stock"
				onAddToCart={() => undefined}
			/>
		</View>
	),
};

export const Loading = {
	render: () => (
		<View style={{ rowGap: spacing.s3 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<ProductCard
					loading
					productId="loading-product-1"
					name=""
					price={0}
					containerStyle={{ width: '48%' }}
				/>
				<ProductCard
					loading
					productId="loading-product-2"
					name=""
					price={0}
					containerStyle={{ width: '48%' }}
				/>
			</View>
			<ProductCard
				loading
				productId="loading-product-3"
				name=""
				price={0}
				variant="landscape"
			/>
		</View>
	),
};
