import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { CartItem } from './CartItem';

const meta = {
	title: 'Molecules/CartItem',
	component: CartItem,
};

export default meta;

const sample = {
	productId: 'prod-1',
	name: 'Perceuse visseuse sans fil 18V',
	price: 35000,
	quantity: 2,
	description: 'Unite',
	stockStatus: 'in_stock' as const,
};

export const Default = {
	render: () => <CartItem item={sample} onIncrease={() => undefined} onDecrease={() => undefined} />,
};

export const List = {
	render: () => (
		<View style={{ rowGap: spacing.s2 }}>
			<CartItem item={sample} onIncrease={() => undefined} onDecrease={() => undefined} />
			<CartItem
				item={{ ...sample, productId: 'prod-2', name: 'Cable electrique U1000 R2V 3G1.5', quantity: 1 }}
				onIncrease={() => undefined}
				onDecrease={() => undefined}
				onRemove={() => undefined}
			/>
		</View>
	),
};
