import { useCallback, useEffect, useState } from 'react';

import type { OrderSummaryItem } from '../components';
import { listOrders } from '../api/orders';

type UseOrdersResult = {
	orders: OrderSummaryItem[];
	isLoading: boolean;
	errorMessage: string | null;
	reload: () => Promise<void>;
};

export const useOrders = (): UseOrdersResult => {
	const [orders, setOrders] = useState<OrderSummaryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const reload = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const nextOrders = await listOrders();
			setOrders(nextOrders);
		} catch {
			setErrorMessage('Impossible de charger les commandes depuis json-server.');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void reload();
	}, [reload]);

	return {
		orders,
		isLoading,
		errorMessage,
		reload,
	};
};
