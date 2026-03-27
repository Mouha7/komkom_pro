import type { CartItemData } from '../components';
import { getDevApiV1 } from './devApi';

let cachedCartItems: CartItemData[] = [];

export const listCartItems = async (): Promise<CartItemData[]> => {
	try {
		const v1 = await getDevApiV1();
		cachedCartItems = v1.cart as CartItemData[];
		return cachedCartItems;
	} catch {
		if (cachedCartItems.length > 0) {
			return cachedCartItems;
		}
		throw new Error('Cart unavailable');
	}
};
