import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { CartList } from './CartList';
import type { CartItemData } from '../../../components';
import { listCartItems } from '../../../api/cart';

const meta = {
	title: 'Organisms/CartList',
	component: CartList,
};

export default meta;

const ApiCartListStory: React.FC = () => {
	const [items, setItems] = useState<CartItemData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		void listCartItems()
			.then((nextItems) => {
				if (isMounted) {
					setItems(nextItems);
				}
			})
			.catch(() => {
				if (isMounted) {
					setItems([]);
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
		<CartList
			items={items}
			isLoading={isLoading}
			onIncreaseQty={() => undefined}
			onDecreaseQty={() => undefined}
			onRemoveItem={() => undefined}
			onCheckout={() => undefined}
		/>
	);
};

export const Default = {
	render: () => <ApiCartListStory />,
};

export const Empty = {
	render: () => <CartList items={[]} />,
};

export const Loading = {
	render: () => (
		<View style={{ paddingVertical: spacing.s5 }}>
			<CartList items={[]} isLoading />
		</View>
	),
};
