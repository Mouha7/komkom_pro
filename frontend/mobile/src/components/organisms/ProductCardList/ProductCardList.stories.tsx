import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { ProductCardList } from './ProductCardList';
import type { ProductListItemData } from '../../../components';
import { listProducts } from '../../../api/products';

const meta = {
	title: 'Organisms/ProductCardList',
	component: ProductCardList,
};

export default meta;

const ApiProductCardListStory: React.FC<{ variant?: 'portrait' | 'landscape' }> = ({ variant = 'portrait' }) => {
	const [products, setProducts] = useState<ProductListItemData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		void listProducts({ perPage: 6 })
			.then((nextProducts) => {
				if (isMounted) {
					setProducts(nextProducts.slice(0, 3));
				}
			})
			.catch(() => {
				if (isMounted) {
					setProducts([]);
				}
			})
			.finally(() => {
				if (isMounted) {
					setIsLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<ProductCardList
			items={products}
			variant={variant}
			isLoadingInitial={isLoading}
			onPressProduct={() => undefined}
			onAddToCart={() => undefined}
			onCartToggle={() => undefined}
		/>
	);
};

export const Default = {
	render: () => <ApiProductCardListStory />,
};

export const LoadingInitial = {
	render: () => <ProductCardList items={[]} isLoadingInitial skeletonCount={4} />,
};

export const LoadingMore = {
	render: () => (
		<ProductCardList
			items={[]}
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
			<ApiProductCardListStory variant='landscape' />
		</View>
	),
};
