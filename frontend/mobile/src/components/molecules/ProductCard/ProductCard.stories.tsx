import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { ProductCard } from './ProductCard';
import type { ProductListItemData } from '../../../components';
import { listProducts } from '../../../api/products';

const meta = {
	title: 'Molecules/ProductCard',
	component: ProductCard,
};

export default meta;

const ApiProductCardStory: React.FC<{ index: number; stockOverride?: ProductListItemData['stockStatus'] }> = ({
	index,
	stockOverride,
}) => {
	const [products, setProducts] = useState<ProductListItemData[]>([]);

	useEffect(() => {
		let isMounted = true;
		void listProducts({ perPage: 8 })
			.then((nextProducts) => {
				if (isMounted) {
					setProducts(nextProducts);
				}
			})
			.catch(() => {
				if (isMounted) {
					setProducts([]);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const product = products[index];

	if (!product) {
		return <ProductCard loading productId='loading-product' name='' price={0} />;
	}

	return (
		<ProductCard
			productId={product.productId}
			name={product.name}
			price={product.price}
			description={product.description}
			stockStatus={stockOverride ?? product.stockStatus}
			onAddToCart={() => undefined}
		/>
	);
};

export const Default = {
	render: () => <ApiProductCardStory index={0} />,
};

export const States = {
	render: () => (
		<View style={{ rowGap: spacing.s3 }}>
			<ApiProductCardStory index={1} />
			<ApiProductCardStory index={2} />
			<Text style={{ opacity: 0.6 }}>Demarrer json-server pour visualiser les donnees reelles.</Text>
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
