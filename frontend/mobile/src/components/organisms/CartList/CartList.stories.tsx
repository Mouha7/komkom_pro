import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { CartList } from './CartList';

const meta = {
	title: 'Organisms/CartList',
	component: CartList,
};

export default meta;

const items = [
	{
		productId: 'prod-1',
		name: 'Perceuse visseuse sans fil 18V',
		price: 35000,
		quantity: 2,
		description: 'Unite',
		stockStatus: 'in_stock' as const,
	},
	{
		productId: 'prod-2',
		name: 'Ciment Portland CPJ 35',
		price: 4500,
		quantity: 1,
		description: 'Sac de 50 kg',
		stockStatus: 'in_stock' as const,
	},
];

export const Default = {
	render: () => (
		<CartList
			items={items}
			onIncreaseQty={() => undefined}
			onDecreaseQty={() => undefined}
			onRemoveItem={() => undefined}
			onCheckout={() => undefined}
		/>
	),
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
