export type OrderLineItemMock = {
	id: string;
	name: string;
	quantity: number;
	unitPrice: number;
	imageUrl: string;
};

export type OrderDetailMetaMock = {
	items: OrderLineItemMock[];
	deliveryFee: number;
	paymentLabel: string;
	deliveryAddress: string;
	contactName: string;
	contactPhone: string;
	coordinates: {
		latitude: number;
		longitude: number;
	};
};

type OrderStatusMock = 'draft' | 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export type OrderConfirmationDataMock = {
	orderId: string;
	status: 'secured' | 'pending' | 'completed';
	deliveryTime: string;
	address: string;
	addressSubtitle: string;
	paymentMethod: string;
	commodities: number;
	subtotal: number;
	deliveryFee: number;
	total: number;
	currency: string;
};

export type InvoiceSourceOrderMock = {
	id: string;
	reference: string;
	total: number;
	currency?: string;
	status: OrderStatusMock;
	createdAt?: string;
};

export type InvoicePaymentStatusMock = 'paid' | 'pending' | 'cancelled';

export type InvoiceDataMock = {
	orderId: string;
	orderReference: string;
	invoiceNumber: string;
	issuedAt: string;
	currency: string;
	paymentStatus: InvoicePaymentStatusMock;
	paymentStatusLabel: string;
	paymentLabel: string;
	issuer: {
		name: string;
		address: string;
		email: string;
		phone: string;
	};
	client: {
		name: string;
		address: string;
		phone: string;
	};
	items: Array<{
		id: string;
		name: string;
		quantity: number;
		unitPrice: number;
		lineTotal: number;
	}>;
	subtotal: number;
	deliveryFee: number;
	taxRate: number;
	taxAmount: number;
	total: number;
};

export const FALLBACK_ORDER_DETAILS: OrderDetailMetaMock = {
	items: [
		{
			id: 'item-default-1',
			name: 'Ciment Portland CEM II 50kg',
			quantity: 4,
			unitPrice: 4500,
			imageUrl:
				'https://storage.googleapis.com/banani-generated-images/generated-images/98be0bb0-cfb1-47d0-860a-d579b30211d9.jpg',
		},
	],
	deliveryFee: 5000,
	paymentLabel: 'Mobile Money - Paye',
	deliveryAddress: 'Quincaillerie ABC, Treichville, Abidjan, Cote d\'Ivoire',
	contactName: 'Contact Chantier',
	contactPhone: '+225 01 23 45 67 89',
	coordinates: {
		latitude: 5.3167,
		longitude: -4.0333,
	},
};

export const ORDER_DETAILS_BY_ID: Record<string, OrderDetailMetaMock> = {
	'cmd-1029': {
		items: [
			{
				id: 'cmd-1029-1',
				name: 'Ciment Portland CEM II 50kg',
				quantity: 5,
				unitPrice: 4500,
				imageUrl:
					'https://storage.googleapis.com/banani-generated-images/generated-images/98be0bb0-cfb1-47d0-860a-d579b30211d9.jpg',
			},
			{
				id: 'cmd-1029-2',
				name: 'Peinture Acrylique Blanche 15L',
				quantity: 2,
				unitPrice: 35000,
				imageUrl:
					'https://storage.googleapis.com/banani-generated-images/generated-images/7ee19046-19e3-49c0-a8b3-f9949b69ffb2.jpg',
			},
		],
		deliveryFee: 5000,
		paymentLabel: 'Mobile Money (Wave) - Paye',
		deliveryAddress:
			"Quincaillerie ABC, Boulevard Giscard d'Estaing, Treichville, Abidjan",
		contactName: 'Mamadou Diaby',
		contactPhone: '+225 01 23 45 67 89',
		coordinates: {
			latitude: 5.3048,
			longitude: -4.0155,
		},
	},
	'cmd-1030': {
		items: [
			{
				id: 'cmd-1030-1',
				name: 'Fer a beton 10mm (Barre 12m)',
				quantity: 10,
				unitPrice: 3500,
				imageUrl:
					'https://storage.googleapis.com/banani-generated-images/generated-images/aa539e0f-e83d-4709-8718-e451323b6704.jpg',
			},
		],
		deliveryFee: 7000,
		paymentLabel: 'Mobile Money (Orange) - Paye',
		deliveryAddress: 'Depot chantier Rivera 2, Cocody, Abidjan',
		contactName: 'Kone Yacouba',
		contactPhone: '+225 05 11 22 33 44',
		coordinates: {
			latitude: 5.3562,
			longitude: -3.9894,
		},
	},
	'cmd-1031': {
		items: [
			{
				id: 'cmd-1031-1',
				name: 'Tube PVC 32mm',
				quantity: 12,
				unitPrice: 2800,
				imageUrl: 'https://images.unsplash.com/photo-1581093588401-16ec4d0f251a?auto=format&fit=crop&w=640&q=80',
			},
			{
				id: 'cmd-1031-2',
				name: 'Robinet Mitigeur',
				quantity: 2,
				unitPrice: 8900,
				imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=640&q=80',
			},
		],
		deliveryFee: 5200,
		paymentLabel: 'Carte bancaire - Paye',
		deliveryAddress: 'Zone 4, Marcory, Abidjan',
		contactName: 'Awa Traore',
		contactPhone: '+225 07 98 76 54 32',
		coordinates: {
			latitude: 5.281,
			longitude: -3.9746,
		},
	},
	'cmd-1032': {
		...FALLBACK_ORDER_DETAILS,
		paymentLabel: 'Commande annulee - Aucun paiement',
	},
	'cmd-1033': {
		...FALLBACK_ORDER_DETAILS,
		paymentLabel: 'Commande annulee - Aucun paiement',
	},
};

export const FALLBACK_ORDER_ITEMS_BY_STATUS: Record<
	OrderStatusMock,
	Array<{ name: string; quantity: number }>
> = {
	draft: [{ name: 'Commande en brouillon', quantity: 1 }],
	pending: [
		{ name: 'Ciment Portland CEM II x50', quantity: 1 },
		{ name: 'Peinture Acrylique Blanche 15L', quantity: 10 },
		{ name: 'Fer a beton 10m', quantity: 8 },
	],
	confirmed: [
		{ name: 'Agglos 15 x 20', quantity: 40 },
		{ name: 'Sable de chantier', quantity: 6 },
		{ name: 'Ciment Portland CEM II x50', quantity: 4 },
	],
	delivered: [
		{ name: 'Tube PVC 32mm', quantity: 12 },
		{ name: 'Robinet Mitigeur', quantity: 2 },
	],
	cancelled: [{ name: 'Commande annulee', quantity: 1 }],
};

export const MOCK_ORDER_CONFIRMATION_DATA: OrderConfirmationDataMock = {
	orderId: '#KK-84920',
	status: 'secured',
	deliveryTime: "Aujourd'hui, 14:00 - 16:00",
	address: 'Quincaillerie de la Paix',
	addressSubtitle: 'Quartier Mermoz, Rue MZ-54',
	paymentMethod: 'A la livraison (Especes)',
	commodities: 3,
	subtotal: 89_500,
	deliveryFee: 38_000,
	total: 127_500,
	currency: 'FCFA',
};

export const getOrderDetailById = (orderId: string): OrderDetailMetaMock =>
	ORDER_DETAILS_BY_ID[orderId] ?? FALLBACK_ORDER_DETAILS;

const INVOICE_TAX_RATE_PERCENT = 18;

const formatInvoiceIssuedAt = (isoDate?: string): string => {
	if (!isoDate) {
		return new Intl.DateTimeFormat('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(new Date());
	}

	const parsedDate = new Date(isoDate);
	if (Number.isNaN(parsedDate.getTime())) {
		return new Intl.DateTimeFormat('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(new Date());
	}

	return new Intl.DateTimeFormat('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(parsedDate);
};

const mapPaymentStatus = (status: OrderStatusMock): InvoicePaymentStatusMock => {
	if (status === 'cancelled') {
		return 'cancelled';
	}

	if (status === 'draft' || status === 'pending') {
		return 'pending';
	}

	return 'paid';
};

const mapPaymentStatusLabel = (status: InvoicePaymentStatusMock): string => {
	if (status === 'paid') {
		return 'Paiement valide';
	}

	if (status === 'cancelled') {
		return 'Commande annulee';
	}

	return 'Paiement en attente';
};

const buildInvoiceNumber = (reference: string, orderId: string): string => {
	const normalizedRef = reference.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
	const shortOrderId = orderId.slice(-4).toUpperCase();
	return `FAC-${normalizedRef}-${shortOrderId}`;
};

export const getInvoiceDataByOrderId = (
	orderId: string,
	sourceOrder?: InvoiceSourceOrderMock | null,
): InvoiceDataMock => {
	const detail = getOrderDetailById(orderId);
	const safeCurrency = sourceOrder?.currency ?? 'FCFA';
	const safeReference = sourceOrder?.reference ?? orderId.toUpperCase();
	const safeStatus = sourceOrder?.status ?? 'pending';

	const items = detail.items.map((item) => ({
		id: item.id,
		name: item.name,
		quantity: item.quantity,
		unitPrice: item.unitPrice,
		lineTotal: item.quantity * item.unitPrice,
	}));

	const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
	const taxAmount = Math.round((subtotal * INVOICE_TAX_RATE_PERCENT) / 100);
	const total = subtotal + detail.deliveryFee + taxAmount;

	const paymentStatus = mapPaymentStatus(safeStatus);

	return {
		orderId,
		orderReference: safeReference,
		invoiceNumber: buildInvoiceNumber(safeReference, orderId),
		issuedAt: formatInvoiceIssuedAt(sourceOrder?.createdAt),
		currency: safeCurrency,
		paymentStatus,
		paymentStatusLabel: mapPaymentStatusLabel(paymentStatus),
		paymentLabel: detail.paymentLabel,
		issuer: {
			name: 'KomKom Pro Marketplace',
			address: 'Dakar, Senegal',
			email: 'billing@komkom.local',
			phone: '+221 77 123 45 67',
		},
		client: {
			name: detail.contactName,
			address: detail.deliveryAddress,
			phone: detail.contactPhone,
		},
		items,
		subtotal,
		deliveryFee: detail.deliveryFee,
		taxRate: INVOICE_TAX_RATE_PERCENT,
		taxAmount,
		total,
	};
};
