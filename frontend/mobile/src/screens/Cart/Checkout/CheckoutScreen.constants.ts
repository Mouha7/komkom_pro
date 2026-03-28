import type { Region } from 'react-native-maps';

import { DAKAR_DEFAULT_REGION } from '../../../features/location';
import type { CheckoutPaymentOption } from './CheckoutScreen.types';

export const ESTIMATED_DELIVERY_FEE = 2500;

export const CHECKOUT_DEFAULT_REGION: Region = {
	...DAKAR_DEFAULT_REGION,
};

export const CHECKOUT_PAYMENT_OPTIONS: CheckoutPaymentOption[] = [
	{
		id: 'cash_on_delivery',
		title: 'Paiement a la livraison',
		description: 'Especes ou Mobile Money a la reception de la marchandise.',
		iconName: 'truck',
	},
	{
		id: 'bank_transfer',
		title: 'Virement bancaire',
		description: 'Le traitement peut prendre 24h a 48h jours ouvres.',
		iconName: 'building2',
	},
];
