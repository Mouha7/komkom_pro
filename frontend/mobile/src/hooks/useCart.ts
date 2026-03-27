import { useCallback, useEffect, useState } from 'react';

import type { CartItemData } from '../components';
import { listCartItems } from '../api/cart';

type UseCartResult = {
	items: CartItemData[];
	isLoading: boolean;
	errorMessage: string | null;
	reload: () => Promise<void>;
};

export const useCart = (): UseCartResult => {
	const [items, setItems] = useState<CartItemData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const reload = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const nextItems = await listCartItems();
			setItems(nextItems);
		} catch {
			setErrorMessage('Impossible de charger le panier depuis json-server.');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void reload();
	}, [reload]);

	return {
		items,
		isLoading,
		errorMessage,
		reload,
	};
};
