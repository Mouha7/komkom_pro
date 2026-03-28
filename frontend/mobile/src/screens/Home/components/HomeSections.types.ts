import type { ProductType, StockStatus } from '../../../constants';

export type HomeCategoryItem = {
	id: string;
	label: string;
	iconName: 'building2' | 'hammer' | 'droplet' | 'zap';
};

export type HomePromoItem = {
	id: string;
	title: string;
	description?: string;
	ctaLabel?: string;
	backgroundColor?: string;
};

export type HomeProductItem = {
	productId: string;
	name: string;
	price: number;
	currency?: string;
	description?: string;
	imageUrl?: string;
	stockStatus?: StockStatus;
	categoryId?: ProductType;
};
