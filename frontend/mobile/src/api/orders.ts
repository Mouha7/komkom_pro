import type { OrderSummaryItem } from '../components';
import { getJson } from './httpClient';
import { getDevApiV1 } from './devApi';

let cachedOrders: OrderSummaryItem[] = [];

export const listOrders = async (): Promise<OrderSummaryItem[]> => {
	try {
		const v1 = await getDevApiV1();
		cachedOrders = v1.orders as OrderSummaryItem[];
		return cachedOrders;
	} catch {
		if (cachedOrders.length > 0) {
			return cachedOrders;
		}
		throw new Error('Orders unavailable');
	}
};

export const getOrderById = async (orderId: string): Promise<OrderSummaryItem> => {
	try {
		const order = await getJson<OrderSummaryItem>(`/api/v1/orders/${orderId}`);
		return order;
	} catch {
		if (cachedOrders.length > 0) {
			const cachedOrder = cachedOrders.find((nextOrder) => nextOrder.id === orderId);
			if (cachedOrder) {
				return cachedOrder;
			}
		}
		throw new Error('Order unavailable');
	}
};
