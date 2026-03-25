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
	stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
	categoryId: string;
};
