import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { OrderList } from './OrderList';
import type { OrderSummaryItem } from '../../../components';
import { listOrders } from '../../../api/orders';

const meta = {
	title: 'Organisms/OrderList',
	component: OrderList,
};

export default meta;

const ApiOrderListStory: React.FC = () => {
	const [orders, setOrders] = useState<OrderSummaryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		void listOrders()
			.then((nextOrders) => {
				if (isMounted) {
					setOrders(nextOrders);
				}
			})
			.catch(() => {
				if (isMounted) {
					setOrders([]);
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

	return <OrderList orders={orders} isLoading={isLoading} onPressOrder={() => undefined} />;
};

export const Default = {
	render: () => <ApiOrderListStory />,
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
