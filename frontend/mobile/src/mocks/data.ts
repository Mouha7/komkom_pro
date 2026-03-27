/**
 * Mock data for development and testing
 * Centralized, type-safe data source to replace json-server
 */

export interface ProductModel {
	id: string;
	name: string;
	price: number;
	currency: string;
	description: string;
	imageUrl: string;
	stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
	categoryId: string;
}

export interface ProductDetailModel extends ProductModel {
	brand: string;
	reference: string;
	unitLabel: string;
	imageUrls: string[];
	specifications: Array<{ label: string; value: string }>;
	highlights: Array<{
		iconName: string;
		title: string;
		description: string;
	}>;
}

export interface CatalogCategoryModel {
	id: string;
	name: string;
}

export interface HomeCategoryModel {
	id: string;
	label: string;
	iconName: string;
}

export interface HomePromoModel {
	id: string;
	title: string;
	description: string;
	ctaLabel: string;
}

export interface CartItemModel {
	id: string;
	productId: string;
	brand: string;
	name: string;
	price: number;
	currency: string;
	quantity: number;
	description: string;
	stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
	imageUrl: string;
}

export interface OrderModel {
	id: string;
	reference: string;
	total: number;
	currency: string;
	status: 'pending' | 'confirmed' | 'delivered';
	createdAt: string;
}

export interface AuthDefaultsModel {
	countryCode: string;
	region: {
		latitude: number;
		longitude: number;
		latitudeDelta: number;
		longitudeDelta: number;
	};
}

// ============ PRODUCTS ============

export const PRODUCTS: ProductModel[] = [
	{
		id: 'prod-1',
		name: 'Perceuse Visseuse sans fil 18V',
		price: 35000,
		currency: 'FCFA',
		description: 'Perceuse professionnelle 18V',
		imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'in_stock',
		categoryId: 'outillage',
	},
	{
		id: 'prod-2',
		name: 'Ciment Portland CPJ 35',
		price: 4500,
		currency: 'FCFA',
		description: 'Sac de 50 kg',
		imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'in_stock',
		categoryId: 'gros-oeuvre',
	},
	{
		id: 'prod-3',
		name: 'Cable Electrique U1000 R2V 3G1.5',
		price: 18500,
		currency: 'FCFA',
		description: 'Rouleau de 50m',
		imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'low_stock',
		categoryId: 'electricite',
	},
	{
		id: 'prod-4',
		name: 'Peinture Acrylique Blanc Mat',
		price: 12500,
		currency: 'FCFA',
		description: 'Seau de 15L',
		imageUrl: 'https://images.unsplash.com/photo-1574359411659-15573f67077f?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'in_stock',
		categoryId: 'gros-oeuvre',
	},
	{
		id: 'prod-5',
		name: 'Tube PVC Ø32mm - 1m',
		price: 2800,
		currency: 'FCFA',
		description: 'Pour plomberie',
		imageUrl: 'https://images.unsplash.com/photo-1581093588401-16ec4d0f251a?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'in_stock',
		categoryId: 'plomberie',
	},
	{
		id: 'prod-6',
		name: 'Robinet Mitigeur Chrome',
		price: 8900,
		currency: 'FCFA',
		description: 'Haute qualite',
		imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'in_stock',
		categoryId: 'plomberie',
	},
	{
		id: 'prod-7',
		name: 'Clou Galvanise 100mm - Kg',
		price: 1500,
		currency: 'FCFA',
		description: 'Boite de 5kg',
		imageUrl: 'https://images.unsplash.com/photo-1609205260988-8f26dd8c9f48?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'in_stock',
		categoryId: 'gros-oeuvre',
	},
	{
		id: 'prod-8',
		name: 'Vis a Bois 4x40mm - Boite',
		price: 2200,
		currency: 'FCFA',
		description: '500 pieces',
		imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=640&q=80',
		stockStatus: 'low_stock',
		categoryId: 'outillage',
	},
];

// ============ PRODUCT DETAILS ============

export const PRODUCT_DETAILS: ProductDetailModel[] = [
	{
		id: 'prod-1',
		brand: 'PROTOOL',
		reference: 'PT-18V-500',
		name: 'Perceuse Visseuse sans fil 18V avec 2 batteries',
		price: 35000,
		currency: 'FCFA',
		unitLabel: 'Unite (Coffret complet)',
		stockStatus: 'in_stock',
		categoryId: 'outillage',
		imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=640&q=80',
		imageUrls: [
			'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80',
			'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=80',
			'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80',
		],
		description: 'Ideale pour le percage dans le bois, le metal et le plastique, ainsi que pour les applications de vissage.',
		specifications: [
			{ label: 'Tension', value: '18 V' },
			{ label: 'Batterie', value: '2.0 Ah Li-Ion (x2)' },
			{ label: 'Mandrin', value: '13 mm sans cle' },
			{ label: 'Couple max', value: '42 Nm' },
			{ label: 'Poids', value: '1.5 kg' },
		],
		highlights: [
			{
				iconName: 'truck',
				title: 'Livraison express disponible',
				description: 'Commandez avant 14h pour une expedition le jour meme.',
			},
			{
				iconName: 'shieldCheck',
				title: 'Garantie Pro 1 An',
				description: 'Couvre les defauts de fabrication et la batterie.',
			},
		],
	},
	{
		id: 'prod-2',
		brand: 'BUILDMAT',
		reference: 'CPJ35-50KG',
		name: 'Ciment Portland CPJ 35 - Sac de 50kg',
		price: 4500,
		currency: 'FCFA',
		unitLabel: 'Sac de 50kg',
		stockStatus: 'low_stock',
		categoryId: 'gros-oeuvre',
		imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=640&q=80',
		imageUrls: [
			'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=900&q=80',
		],
		description: 'Ciment haute resistance pour travaux de maconnerie et gros oeuvre.',
		specifications: [
			{ label: 'Poids', value: '50 kg' },
			{ label: 'Classe', value: 'CPJ 35' },
			{ label: 'Usage', value: 'Maconnerie et dalle' },
		],
		highlights: [
			{
				iconName: 'package',
				title: 'Retrait en magasin',
				description: 'Disponible en retrait sous 2h selon stock.',
			},
		],
	},
];

// ============ CATALOG CATEGORIES ============

export const CATALOG_CATEGORIES: CatalogCategoryModel[] = [
	{ id: 'all', name: 'Tous' },
	{ id: 'gros-oeuvre', name: 'Gros oeuvre' },
	{ id: 'outillage', name: 'Outillage' },
	{ id: 'plomberie', name: 'Plomberie' },
	{ id: 'electricite', name: 'Electricite' },
];

// ============ HOME CATEGORIES ============

export const HOME_CATEGORIES: HomeCategoryModel[] = [
	{ id: 'gros-oeuvre', label: 'Gros oeuvre', iconName: 'building2' },
	{ id: 'outillage', label: 'Outillage', iconName: 'hammer' },
	{ id: 'plomberie', label: 'Plomberie', iconName: 'droplet' },
	{ id: 'electricite', label: 'Electricite', iconName: 'zap' },
];

// ============ HOME PROMOTIONS ============

export const HOME_PROMOS: HomePromoModel[] = [
	{
		id: 'promo-ciment',
		title: '-15% sur le ciment',
		description: 'Offre valable jusqu\'a vendredi',
		ctaLabel: 'Commander',
	},
	{
		id: 'promo-outillage',
		title: '-10% sur l\'outillage',
		description: 'Prix pro sur une selection de references',
		ctaLabel: 'Commander',
	},
];

// ============ CART ============

export const CART: CartItemModel[] = [
	{
		id: 'prod-1',
		productId: 'prod-1',
		brand: 'PROTOOL',
		name: 'Perceuse Visseuse sans fil 18V avec 2 batteries',
		price: 35000,
		currency: 'FCFA',
		quantity: 1,
		description: 'Unite',
		stockStatus: 'in_stock',
		imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
	},
	{
		id: 'prod-2',
		productId: 'prod-2',
		brand: 'BUILDMAT',
		name: 'Ciment Portland CPJ 35 - Sac de 50kg',
		price: 4500,
		currency: 'FCFA',
		quantity: 20,
		description: '4 500 / Sac',
		stockStatus: 'low_stock',
		imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=400&q=80',
	},
];

// ============ ORDERS ============

export const ORDERS: OrderModel[] = [
	{
		id: 'cmd-1029',
		reference: 'CMD-1029',
		total: 34950,
		currency: 'FCFA',
		status: 'pending',
		createdAt: '2026-03-12T10:00:00.000Z',
	},
	{
		id: 'cmd-1030',
		reference: 'CMD-1030',
		total: 87200,
		currency: 'FCFA',
		status: 'confirmed',
		createdAt: '2026-03-13T15:30:00.000Z',
	},
	{
		id: 'cmd-1031',
		reference: 'CMD-1031',
		total: 19100,
		currency: 'FCFA',
		status: 'delivered',
		createdAt: '2026-03-15T09:45:00.000Z',
	},
];

// ============ AUTH DEFAULTS ============

export const AUTH_DEFAULTS: AuthDefaultsModel = {
	countryCode: '+221',
	region: {
		latitude: 14.7167,
		longitude: -17.4677,
		latitudeDelta: 0.06,
		longitudeDelta: 0.06,
	},
};
