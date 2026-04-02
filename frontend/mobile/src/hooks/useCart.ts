import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import type { CartItemData } from '../components';
import {
	addCartItem,
	listCartItems,
	removeCartItem,
	updateCartItemQuantity,
} from '../api/cart';

type UseCartResult = {
	items: CartItemData[];
	totalItemsCount: number;
	isLoading: boolean;
	errorMessage: string | null;
	reload: () => Promise<void>;
	addItem: (productId: string, quantity?: number) => Promise<void>;
	setItemQuantity: (productId: string, quantity: number) => Promise<void>;
	removeItem: (productId: string) => Promise<void>;
};

export const useCart = (): UseCartResult => {
	const [items, setItems] = useState<CartItemData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isMutating, setIsMutating] = useState(false);

	const reload = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const nextItems = await listCartItems();
			setItems(nextItems);
		} catch (error) {
			const baseMessage = 'Impossible de charger le panier.';

			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const addItem = useCallback(async (productId: string, quantity: number = 1): Promise<void> => {
		setIsMutating(true);
		setErrorMessage(null);
		try {
			const nextItems = await addCartItem(productId, quantity);
			setItems(nextItems);
		} catch (error) {
			const baseMessage = 'Impossible de mettre a jour le panier.';
			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
		} finally {
			setIsMutating(false);
		}
	}, []);

	const setItemQuantity = useCallback(async (productId: string, quantity: number): Promise<void> => {
		setIsMutating(true);
		setErrorMessage(null);
		try {
			const nextItems = await updateCartItemQuantity(productId, quantity);
			setItems(nextItems);
		} catch (error) {
			const baseMessage = 'Impossible de mettre a jour la quantite.';
			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
		} finally {
			setIsMutating(false);
		}
	}, []);

	const removeItem = useCallback(async (productId: string): Promise<void> => {
		setIsMutating(true);
		setErrorMessage(null);
		try {
			const nextItems = await removeCartItem(productId);
			setItems(nextItems);
		} catch (error) {
			const baseMessage = 'Impossible de retirer cet article.';
			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
		} finally {
			setIsMutating(false);
		}
	}, []);

	useEffect(() => {
		void reload();
	}, [reload]);

	useFocusEffect(
		useCallback(() => {
			void reload();
		}, [reload]),
	);

	const totalItemsCount = items.reduce(
		(total, item) => total + Math.max(0, Math.floor(item.quantity)),
		0,
	);

	return {
		items,
		totalItemsCount,
		isLoading: isLoading || isMutating,
		errorMessage,
		reload,
		addItem,
		setItemQuantity,
		removeItem,
	};
};
