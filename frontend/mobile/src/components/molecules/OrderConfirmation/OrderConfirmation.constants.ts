import type { OrderConfirmationScreenData } from './OrderConfirmation.types';

export const MOCK_ORDER_CONFIRMATION_DATA: OrderConfirmationScreenData = {
	orderId: '#KK-84920',
	status: 'secured',
	deliveryTime: 'Aujourd\'hui, 14:00 - 16:00',
	address: 'Quincaillerie de la Paix',
	addressSubtitle: 'Quartier Mermoz, Rue MZ-54',
	paymentMethod: 'À la livraison (Espèces)',
	commodities: 3,
	subtotal: 89_500,
	deliveryFee: 38_000,
	total: 127_500,
	currency: 'FCFA',
};
