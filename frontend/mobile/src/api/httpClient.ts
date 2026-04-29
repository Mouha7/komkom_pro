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
		const [products, catalogCategories, homeCategories, homePromos, cart, orders, notifications] = await Promise.all([
			mockServiceApi.getProducts(),
			mockServiceApi.getCatalogCategories(),
			mockServiceApi.getHomeCategories(),
			mockServiceApi.getHomePromos(),
			mockServiceApi.getCart(),
			mockServiceApi.getOrders(),
			mockServiceApi.getNotifications(),
		]);

		return {
			v1: {
				products,
				catalog: { categories: catalogCategories },
				home: { categories: homeCategories, promos: homePromos },
				cart,
				orders,
				notifications,
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

		// GET /api/v1/cart/add/:productId/:quantity
		const cartAddMatch = normalizedPath.match(/^api\/v1\/cart\/add\/([^/]+)\/(\d+)$/);
		if (cartAddMatch) {
			return (await mockServiceApi.addProductToCart(cartAddMatch[1], Number(cartAddMatch[2]))) as T;
		}

		// GET /api/v1/cart/update/:productId/:quantity
		const cartUpdateMatch = normalizedPath.match(/^api\/v1\/cart\/update\/([^/]+)\/(-?\d+)$/);
		if (cartUpdateMatch) {
			return (await mockServiceApi.updateCartItemQuantity(cartUpdateMatch[1], Number(cartUpdateMatch[2]))) as T;
		}

		// GET /api/v1/cart/remove/:productId
		const cartRemoveMatch = normalizedPath.match(/^api\/v1\/cart\/remove\/([^/]+)$/);
		if (cartRemoveMatch) {
			return (await mockServiceApi.removeCartItem(cartRemoveMatch[1])) as T;
		}

		// GET /api/v1/orders
		if (normalizedPath === 'api/v1/orders') {
			return (await mockServiceApi.getOrders()) as T;
		}

		// GET /api/v1/notifications
		if (normalizedPath === 'api/v1/notifications') {
			return (await mockServiceApi.getNotifications()) as T;
		}

		// GET /api/v1/notifications/mark-all-read
		if (normalizedPath === 'api/v1/notifications/mark-all-read') {
			return (await mockServiceApi.markAllNotificationsAsRead()) as T;
		}

		// GET /api/v1/notifications/:id/read
		const notificationReadMatch = normalizedPath.match(
			/^api\/v1\/notifications\/([^/]+)\/read$/,
		);
		if (notificationReadMatch) {
			const updatedNotification = await mockServiceApi.markNotificationAsRead(
				notificationReadMatch[1],
			);
			if (!updatedNotification) {
				throw new HttpError(404, `Notification not found: ${notificationReadMatch[1]}`);
			}
			return updatedNotification as T;
		}

		// GET /api/v1/orders/:id
		const orderMatch = normalizedPath.match(/^api\/v1\/orders\/(.+)$/);
		if (orderMatch) {
			const order = await mockServiceApi.getOrderById(orderMatch[1]);
			if (!order) {
				throw new HttpError(404, `Order not found: ${orderMatch[1]}`);
			}
			return order as T;
		}

		// GET /api/v1/profile/:userId
		const profileMatch = normalizedPath.match(/^api\/v1\/profile\/([^/]+)$/);
		if (profileMatch) {
			const profile = await mockServiceApi.getStoreProfile(profileMatch[1]);
			if (!profile) {
				throw new HttpError(404, `Profile not found: ${profileMatch[1]}`);
			}
			return profile as T;
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
	const cartLegacyAddMatch = normalizedPath.match(/^cart\/add\/([^/]+)\/(\d+)$/);
	if (cartLegacyAddMatch) {
		return (await mockServiceApi.addProductToCart(cartLegacyAddMatch[1], Number(cartLegacyAddMatch[2]))) as T;
	}
	const cartLegacyUpdateMatch = normalizedPath.match(/^cart\/update\/([^/]+)\/(-?\d+)$/);
	if (cartLegacyUpdateMatch) {
		return (await mockServiceApi.updateCartItemQuantity(cartLegacyUpdateMatch[1], Number(cartLegacyUpdateMatch[2]))) as T;
	}
	const cartLegacyRemoveMatch = normalizedPath.match(/^cart\/remove\/([^/]+)$/);
	if (cartLegacyRemoveMatch) {
		return (await mockServiceApi.removeCartItem(cartLegacyRemoveMatch[1])) as T;
	}
	if (normalizedPath === 'orders') {
		return (await mockServiceApi.getOrders()) as T;
	}
	if (normalizedPath === 'notifications') {
		return (await mockServiceApi.getNotifications()) as T;
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
