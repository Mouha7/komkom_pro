import { appConfig } from '../config';
import { mockServiceApi } from '../mocks/mockService';

export class HttpError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'HttpError';
		this.status = status;
	}
}

export class NetworkError extends Error {
	readonly url: string;

	constructor(url: string, message: string) {
		super(message);
		this.name = 'NetworkError';
		this.url = url;
	}
}

export const buildApiUrl = (path: string): string => {
	const base = appConfig.apiBaseUrl.replace(/\/$/, '');
	const nextPath = path.startsWith('/') ? path : `/${path}`;
	return `${base}${nextPath}`;
};

/**
 * Detect if we should use mock service instead of real HTTP
 * Returns true if apiBaseUrl is localhost or 127.0.0.1
 */
const isMockMode = (): boolean => {
	const base = appConfig.apiBaseUrl;
	return base.includes('localhost') || base.includes('127.0.0.1');
};

/**
 * Route request to mock service if applicable
 */
const getMockResponse = async <T>(path: string): Promise<T> => {
	// Map paths to mock service endpoints
	const normalizedPath = path.replace(/^\//, '').replace(/\/$/, '');

	// GET /api - aggregated endpoint for devApi compatibility
	if (normalizedPath === 'api') {
		const [products, catalogCategories, homeCategories, homePromos, cart, orders] = await Promise.all([
			mockServiceApi.getProducts(),
			mockServiceApi.getCatalogCategories(),
			mockServiceApi.getHomeCategories(),
			mockServiceApi.getHomePromos(),
			mockServiceApi.getCart(),
			mockServiceApi.getOrders(),
		]);

		return {
			v1: {
				products,
				catalog: { categories: catalogCategories },
				home: { categories: homeCategories, promos: homePromos },
				cart,
				orders,
			},
		} as T;
	}

	// API v1 endpoints
	if (normalizedPath.startsWith('api/v1')) {
		// GET /api/v1/products
		if (normalizedPath === 'api/v1/products') {
			return (await mockServiceApi.getProducts()) as T;
		}

		// GET /api/v1/products/:id
		const productMatch = normalizedPath.match(/^api\/v1\/products\/(.+)$/);
		if (productMatch) {
			const detail = await mockServiceApi.getProductDetail(productMatch[1]);
			return (detail || {}) as T;
		}

		// GET /api/v1/catalog/categories
		if (normalizedPath === 'api/v1/catalog/categories') {
			return (await mockServiceApi.getCatalogCategories()) as T;
		}

		// GET /api/v1/home/categories
		if (normalizedPath === 'api/v1/home/categories') {
			return (await mockServiceApi.getHomeCategories()) as T;
		}

		// GET /api/v1/home/promos
		if (normalizedPath === 'api/v1/home/promos') {
			return (await mockServiceApi.getHomePromos()) as T;
		}

		// GET /api/v1/cart
		if (normalizedPath === 'api/v1/cart') {
			return (await mockServiceApi.getCart()) as T;
		}

		// GET /api/v1/orders
		if (normalizedPath === 'api/v1/orders') {
			return (await mockServiceApi.getOrders()) as T;
		}

		// GET /api/v1/auth/defaults
		if (normalizedPath === 'api/v1/auth/defaults') {
			return (await mockServiceApi.getAuthDefaults()) as T;
		}
	}

	// Legacy json-server style endpoints (root level)
	if (normalizedPath === 'productDetails') {
		return (await mockServiceApi.getProductDetail('prod-1')) as T; // or return all
	}
	if (normalizedPath === 'catalogCategories') {
		return (await mockServiceApi.getCatalogCategories()) as T;
	}
	if (normalizedPath === 'homeCategories') {
		return (await mockServiceApi.getHomeCategories()) as T;
	}
	if (normalizedPath === 'homePromos') {
		return (await mockServiceApi.getHomePromos()) as T;
	}
	if (normalizedPath === 'cart') {
		return (await mockServiceApi.getCart()) as T;
	}
	if (normalizedPath === 'orders') {
		return (await mockServiceApi.getOrders()) as T;
	}
	if (normalizedPath === 'authDefaults') {
		return (await mockServiceApi.getAuthDefaults()) as T;
	}

	throw new HttpError(404, `Mock endpoint not found: ${path}`);
};

export const getJson = async <T>(path: string): Promise<T> => {
	const requestUrl = buildApiUrl(path);

	// Use mock service for localhost/127.0.0.1
	if (isMockMode()) {
		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.debug(`[api:mock] ${path}`);
		}
		return getMockResponse<T>(path);
	}

	let response: Response;

	try {
		response = await fetch(requestUrl, {
			headers: {
				Accept: 'application/json',
			},
		});
	} catch (error) {
		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.warn('[api] Network request failed', { requestUrl, error });
		}

		const localhostHint =
			requestUrl.includes('://localhost:') || requestUrl.includes('://127.0.0.1:')
				? ' If you are on a physical device, use LAN IP or EXPO_PUBLIC_API_TUNNEL_BASE_URL (ngrok).' 
				: '';

		throw new NetworkError(requestUrl, `Network request failed for ${requestUrl}.${localhostHint}`.trim());
	}

	if (!response.ok) {
		throw new HttpError(response.status, `Request failed with status ${response.status} for ${requestUrl}`);
	}

	return (await response.json()) as T;
};
