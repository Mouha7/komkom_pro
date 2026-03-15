import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { OrderList } from './OrderList';

const meta = {
	title: 'Organisms/OrderList',
	component: OrderList,
};

export default meta;

const sampleOrders = [
	{ id: 'ord-1', reference: 'CMD-1029', total: 65000, status: 'confirmed' as const, createdAt: '2026-02-20' },
	{ id: 'ord-2', reference: 'CMD-1030', total: 24500, status: 'delivered' as const, createdAt: '2026-02-18' },
	{ id: 'ord-3', reference: 'CMD-1031', total: 35000, status: 'pending' as const, createdAt: '2026-02-15' },
];

export const Default = {
	render: () => <OrderList orders={sampleOrders} onPressOrder={() => undefined} />,
};

export const Empty = {
	render: () => <OrderList orders={[]} />,
};

export const Loading = {
	render: () => (
		<View style={{ paddingVertical: spacing.s5 }}>
			<OrderList orders={[]} isLoading />
		</View>
	),
};
