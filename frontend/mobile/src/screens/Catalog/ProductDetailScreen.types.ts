import type { StockStatus } from '../../components';
import type { CommonIconName } from '../../components';

export type ProductDetailSpecification = {
	label: string;
	value: string;
};

export type ProductDetailHighlight = {
	iconName: CommonIconName;
	title: string;
	description: string;
};

export type ProductDetailData = {
	id: string;
	brand: string;
	reference: string;
	name: string;
	price: number;
	currency: string;
	unitLabel: string;
	stockStatus: StockStatus;
	imageUrls: string[];
	description: string;
	specifications: ProductDetailSpecification[];
	highlights: ProductDetailHighlight[];
};
