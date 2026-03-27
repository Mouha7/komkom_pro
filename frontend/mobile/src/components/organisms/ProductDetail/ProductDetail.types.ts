import type { StockStatus } from '../../atoms/StatusChip';
import type { CommonIconName } from '../../atoms/Icon';

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

export type ProductDetailAddToCartPayload = {
	productId: string;
	name: string;
	quantity: number;
};

export type ProductDetailProps = {
	productId: string;
	onPressBack: () => void;
	onOpenCart?: () => void;
	onShare?: () => void;
	onAddToCart?: (payload: ProductDetailAddToCartPayload) => void;
};
