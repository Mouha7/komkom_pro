import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { CartItem } from './CartItem';
import { listCartItems } from '../../../api/cart';
import type { CartItemData } from '../../../components';

const meta = {
	title: 'Molecules/CartItem',
	component: CartItem,
};

export default meta;

const ApiCartItemStory: React.FC<{ index: number }> = ({ index }) => {
	const [items, setItems] = useState<CartItemData[]>([]);

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
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const item = items[index];

	if (!item) {
		return (
			<CartItem
				item={{
					productId: 'loading',
					name: 'Chargement',
					price: 0,
					quantity: 1,
					currency: 'FCFA',
				}}
				disabled
			/>
		);
	}

	return <CartItem item={item} onIncrease={() => undefined} onDecrease={() => undefined} />;
};

export const Default = {
	render: () => <ApiCartItemStory index={0} />,
};

export const List = {
	render: () => (
		<View style={{ rowGap: spacing.s2 }}>
			<ApiCartItemStory index={0} />
			<ApiCartItemStory index={1} />
		</View>
	),
};
