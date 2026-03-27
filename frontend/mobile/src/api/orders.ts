import type { OrderSummaryItem } from '../components';
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
