import type { CatalogCategory, ProductListItemData, ProductDetailData } from '../components';
import type { ProductType, StockStatus } from '../constants';
import type { HomeCategoryItem, HomePromoItem } from '../screens/Home/components';
import { getJson } from './httpClient';
import { getDevApiV1 } from './devApi';

type ProductApiModel = {
	id: string;
	name: string;
	price: number;
	currency?: string;
	description?: string;
	imageUrl?: string;
	stockStatus?: StockStatus;
	categoryId?: ProductType;
};

type ProductDetailApiModel = ProductApiModel & Partial<Omit<ProductDetailData, 'id' | 'name' | 'price'>>;

let cachedProducts: ProductApiModel[] = [];
let cachedCatalogCategories: CatalogCategory[] = [];
let cachedHomeCategories: HomeCategoryItem[] = [];
let cachedHomePromos: HomePromoItem[] = [];
const cachedProductDetails = new Map<string, ProductDetailData>();

export type ListProductsParams = {
	page?: number;
	perPage?: number;
	search?: string;
	categoryId?: string;
	stockStatuses?: StockStatus[];
	priceMin?: number;
	priceMax?: number;
};

const toProductListItem = (model: ProductApiModel): ProductListItemData => ({
	productId: model.id,
	name: model.name,
	price: model.price,
	currency: model.currency,
	description: model.description,
	imageUrl: model.imageUrl,
	stockStatus: model.stockStatus,
	categoryId: model.categoryId,
});

const toProductDetailData = (model: ProductDetailApiModel): ProductDetailData => {
	const imageUrls = Array.isArray(model.imageUrls) ? model.imageUrls.filter(Boolean) : [];
	const fallbackImage = model.imageUrl ?? '';

	return {
		id: model.id,
		brand: model.brand ?? 'KomKom',
		reference: model.reference ?? model.id,
		name: model.name,
		price: model.price,
		currency: model.currency ?? 'FCFA',
		unitLabel: model.unitLabel ?? 'Unite',
		stockStatus: model.stockStatus ?? 'in_stock',
		imageUrls: imageUrls.length > 0 ? imageUrls : fallbackImage ? [fallbackImage] : [],
		description: model.description ?? '',
		specifications: Array.isArray(model.specifications) ? model.specifications : [],
		highlights: Array.isArray(model.highlights) ? model.highlights : [],
	};
};

const getProductsSource = async (): Promise<ProductApiModel[]> => {
	try {
		const v1 = await getDevApiV1();
		cachedProducts = v1.products as ProductApiModel[];
		return cachedProducts;
	} catch {
		if (cachedProducts.length > 0) {
			return cachedProducts;
		}
		throw new Error('Products unavailable');
	}
};

export const listProducts = async (params: ListProductsParams = {}): Promise<ProductListItemData[]> => {
	const sourceProducts = await getProductsSource();
	const page = Math.max(1, params.page ?? 1);
	const perPage = Math.max(1, params.perPage ?? 24);

	const filtered = sourceProducts.filter((item) => {
		if (params.search) {
			const q = params.search.toLowerCase();
			const haystack = `${item.name} ${item.description ?? ''}`.toLowerCase();
			if (!haystack.includes(q)) {
				return false;
			}
		}

		if (params.categoryId && params.categoryId !== 'all' && item.categoryId !== params.categoryId) {
			return false;
		}

		if (params.stockStatuses && params.stockStatuses.length > 0) {
			if (!item.stockStatus || !params.stockStatuses.includes(item.stockStatus)) {
				return false;
			}
		}

		if (typeof params.priceMin === 'number' && item.price < params.priceMin) {
			return false;
		}

		if (typeof params.priceMax === 'number' && item.price > params.priceMax) {
			return false;
		}

		return true;
	});

	const start = (page - 1) * perPage;
	const end = start + perPage;

	return filtered.slice(start, end).map(toProductListItem);
};

export const getProductDetail = async (productId: string): Promise<ProductDetailData> => {
	try {
		const detail = await getJson<Partial<ProductDetailApiModel>>(`/api/v1/products/${productId}`);
		if (detail && typeof detail === 'object' && typeof detail.id === 'string') {
			const normalizedDetail = toProductDetailData(detail as ProductDetailApiModel);
			cachedProductDetails.set(productId, normalizedDetail);
			return normalizedDetail;
		}
	} catch {
		// Fall through to aggregated source and cache fallback.
	}

	try {
		const sourceProducts = await getProductsSource();
		const fallbackModel = sourceProducts.find((item) => item.id === productId);

		if (fallbackModel) {
			const normalizedDetail = toProductDetailData(fallbackModel);
			cachedProductDetails.set(productId, normalizedDetail);
			return normalizedDetail;
		}
	} catch {
		const cachedDetail = cachedProductDetails.get(productId);
		if (cachedDetail) {
			return cachedDetail;
		}
		throw new Error(`Product ${productId} not found`);
	}

	const cachedDetail = cachedProductDetails.get(productId);
	if (cachedDetail) {
		return cachedDetail;
	}

	throw new Error(`Product ${productId} not found`);
};

export const listCatalogCategories = async (): Promise<CatalogCategory[]> => {
	try {
		const v1 = await getDevApiV1();
		cachedCatalogCategories = v1.catalog.categories as CatalogCategory[];
		return cachedCatalogCategories;
	} catch {
		if (cachedCatalogCategories.length > 0) {
			return cachedCatalogCategories;
		}
		throw new Error('Catalog categories unavailable');
	}
};

export const listHomeCategories = async (): Promise<HomeCategoryItem[]> => {
	try {
		const v1 = await getDevApiV1();
		cachedHomeCategories = v1.home.categories as HomeCategoryItem[];
		return cachedHomeCategories;
	} catch {
		if (cachedHomeCategories.length > 0) {
			return cachedHomeCategories;
		}
		throw new Error('Home categories unavailable');
	}
};

export const listHomePromos = async (): Promise<HomePromoItem[]> => {
	try {
		const v1 = await getDevApiV1();
		cachedHomePromos = v1.home.promos as HomePromoItem[];
		return cachedHomePromos;
	} catch {
		if (cachedHomePromos.length > 0) {
			return cachedHomePromos;
		}
		throw new Error('Home promos unavailable');
	}
};
