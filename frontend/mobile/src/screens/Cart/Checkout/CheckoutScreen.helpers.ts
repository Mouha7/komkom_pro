import type { CartItemData } from '../../../components';

import { ESTIMATED_DELIVERY_FEE } from './CheckoutScreen.constants';
import type { CheckoutTotals } from './CheckoutScreen.types';

export const computeCheckoutTotals = (items: CartItemData[]): CheckoutTotals => {
	const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
	const totalItems = items.reduce((total, item) => total + item.quantity, 0);
	const deliveryFee = items.length > 0 ? ESTIMATED_DELIVERY_FEE : 0;

	return {
		subtotal,
		deliveryFee,
		total: subtotal + deliveryFee,
		totalItems,
	};
};
