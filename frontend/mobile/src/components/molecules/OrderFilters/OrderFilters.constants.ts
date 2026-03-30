import type { OrderFilterOption } from './OrderFilters.types';

export const ORDER_FILTERS: OrderFilterOption[] = [
	{
		id: 'all',
		label: 'Toutes',
	},
	{
		id: 'in_progress',
		label: 'En cours',
	},
	{
		id: 'delivered',
		label: 'Livrées',
	},
	{
		id: 'cancelled',
		label: 'Annulées',
	},
];
