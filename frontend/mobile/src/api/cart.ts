import type { CartItemData } from '../components';
import { getJson } from './httpClient';
import { getDevApiV1 } from './devApi';

let cachedCartItems: CartItemData[] = [];

const updateCachedCartItems = (items: CartItemData[]): CartItemData[] => {
	cachedCartItems = items;
	return cachedCartItems;
};

export const listCartItems = async (): Promise<CartItemData[]> => {
	try {
		const v1 = await getDevApiV1();
		return updateCachedCartItems(v1.cart as CartItemData[]);
	} catch {
		if (cachedCartItems.length > 0) {
			return cachedCartItems;
		}
		throw new Error('Cart unavailable');
	}
};

export const addCartItem = async (productId: string, quantity: number = 1): Promise<CartItemData[]> => {
	try {
		const nextItems = await getJson<CartItemData[]>(
			`/api/v1/cart/add/${productId}/${Math.max(1, Math.floor(quantity))}`,
		);
		return updateCachedCartItems(nextItems);
	} catch {
		throw new Error('Unable to add cart item');
	}
};

export const updateCartItemQuantity = async (productId: string, quantity: number): Promise<CartItemData[]> => {
	try {
		const nextItems = await getJson<CartItemData[]>(
			`/api/v1/cart/update/${productId}/${Math.max(0, Math.floor(quantity))}`,
		);
		return updateCachedCartItems(nextItems);
	} catch {
		throw new Error('Unable to update cart item');
	}
};

export const removeCartItem = async (productId: string): Promise<CartItemData[]> => {
	try {
		const nextItems = await getJson<CartItemData[]>(`/api/v1/cart/remove/${productId}`);
		return updateCachedCartItems(nextItems);
	} catch {
		throw new Error('Unable to remove cart item');
	}
};
