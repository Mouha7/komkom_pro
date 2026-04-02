/**
 * Mock Service - Centralized in-memory API for development
 * Replaces json-server by exposing the same interface
 * Simulates network delays for realistic UI testing
 */

import {
	AUTH_DEFAULTS,
	CART,
	CATALOG_CATEGORIES,
	ORDERS,
	PRODUCT_DETAILS,
	PRODUCTS,
	HOME_CATEGORIES,
	HOME_PROMOS,
	type ProductModel,
	type ProductDetailModel,
	type CatalogCategoryModel,
	type HomeCategoryModel,
	type HomePromoModel,
	type CartItemModel,
	type OrderModel,
	type AuthDefaultsModel,
} from './data';
import { NOTIFICATIONS, type NotificationModel } from './notifications';

/**
 * Simulated network delay (ms)
 * Adjust to test loading states and performance
 */
const NETWORK_DELAY_MS = 200;

/**
 * Helper: Simulate network delay
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper: Clone data to prevent mutations
 */
const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

// ============ API V1 ENDPOINTS ============

export const mockServiceApi = {
	/**
	 * GET /api/v1/products
	 * Returns list of all products
	 */
	async getProducts(): Promise<ProductModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(PRODUCTS);
	},

	/**
	 * GET /api/v1/products/:id
	 * Returns product details by ID
	 */
	async getProductDetail(productId: string): Promise<ProductDetailModel | null> {
		await sleep(NETWORK_DELAY_MS);
		const detail = PRODUCT_DETAILS.find((p) => p.id === productId);
		return detail ? clone(detail) : null;
	},

	/**
	 * GET /api/v1/catalog/categories
	 * Returns list of all catalog categories
	 */
	async getCatalogCategories(): Promise<CatalogCategoryModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(CATALOG_CATEGORIES);
	},

	/**
	 * GET /api/v1/home/categories
	 * Returns home categories with icons
	 */
	async getHomeCategories(): Promise<HomeCategoryModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(HOME_CATEGORIES);
	},

	/**
	 * GET /api/v1/home/promos
	 * Returns home promotions
	 */
	async getHomePromos(): Promise<HomePromoModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(HOME_PROMOS);
	},

	/**
	 * GET /api/v1/cart
	 * Returns current cart items
	 */
	async getCart(): Promise<CartItemModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(CART);
	},

	/**
	 * POST /api/v1/cart
	 * Add item to cart (mock: append to array, no persistence)
	 */
	async addToCart(item: CartItemModel): Promise<CartItemModel> {
		await sleep(NETWORK_DELAY_MS);
		// In memory only - will reset on app restart
		CART.push(item);
		return clone(item);
	},

	/**
	 * PUT /api/v1/cart/:id
	 * Update cart item (mock: find and update, no persistence)
	 */
	async updateCartItem(itemId: string, updatedItem: Partial<CartItemModel>): Promise<CartItemModel | null> {
		await sleep(NETWORK_DELAY_MS);
		const item = CART.find((c) => c.id === itemId);
		if (!item) return null;
		Object.assign(item, updatedItem);
		return clone(item);
	},

	/**
	 * DELETE /api/v1/cart/:id
	 * Remove item from cart (mock: remove from array)
	 */
	async removeFromCart(itemId: string): Promise<boolean> {
		await sleep(NETWORK_DELAY_MS);
		const index = CART.findIndex((c) => c.id === itemId);
		if (index === -1) return false;
		CART.splice(index, 1);
		return true;
	},

	/**
	 * GET /api/v1/orders
	 * Returns list of all orders
	 */
	async getOrders(): Promise<OrderModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(ORDERS);
	},

	/**
	 * GET /api/v1/notifications
	 * Returns list of notifications
	 */
	async getNotifications(): Promise<NotificationModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(NOTIFICATIONS);
	},

	/**
	 * GET /api/v1/notifications/:id/read
	 * Marks a notification as read
	 */
	async markNotificationAsRead(notificationId: string): Promise<NotificationModel | null> {
		await sleep(NETWORK_DELAY_MS);
		const notification = NOTIFICATIONS.find((nextNotification) => nextNotification.id === notificationId);
		if (!notification) {
			return null;
		}
		notification.isRead = true;
		return clone(notification);
	},

	/**
	 * GET /api/v1/notifications/mark-all-read
	 * Marks all notifications as read
	 */
	async markAllNotificationsAsRead(): Promise<NotificationModel[]> {
		await sleep(NETWORK_DELAY_MS);
		NOTIFICATIONS.forEach((notification) => {
			notification.isRead = true;
		});
		return clone(NOTIFICATIONS);
	},

	/**
	 * GET /api/v1/orders/:id
	 * Returns one order by ID
	 */
	async getOrderById(orderId: string): Promise<OrderModel | null> {
		await sleep(NETWORK_DELAY_MS);
		const order = ORDERS.find((nextOrder) => nextOrder.id === orderId);
		return order ? clone(order) : null;
	},

	/**
	 * POST /api/v1/orders
	 * Create new order (mock: append to array, no persistence)
	 */
	async createOrder(order: Omit<OrderModel, 'id' | 'createdAt'>): Promise<OrderModel> {
		await sleep(NETWORK_DELAY_MS);
		const newOrder: OrderModel = {
			id: `cmd-${Date.now()}`,
			createdAt: new Date().toISOString(),
			...order,
		};
		ORDERS.push(newOrder);
		return clone(newOrder);
	},

	/**
	 * GET /api/v1/auth/defaults
	 * Returns authentication defaults (country code, region)
	 */
	async getAuthDefaults(): Promise<AuthDefaultsModel> {
		await sleep(NETWORK_DELAY_MS);
		return clone(AUTH_DEFAULTS);
	},
};

/**
 * Legacy json-server compatibility layer
 * Maps old json-server routes to new mockServiceApi
 */
export const mockServiceLegacy = {
	/**
	 * GET /productDetails
	 * Legacy endpoint for product details
	 */
	async getProductDetails(): Promise<ProductDetailModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(PRODUCT_DETAILS);
	},

	/**
	 * GET /catalogCategories
	 */
	async getCatalogCategories(): Promise<CatalogCategoryModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(CATALOG_CATEGORIES);
	},

	/**
	 * GET /homeCategories
	 */
	async getHomeCategories(): Promise<HomeCategoryModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(HOME_CATEGORIES);
	},

	/**
	 * GET /homePromos
	 */
	async getHomePromos(): Promise<HomePromoModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(HOME_PROMOS);
	},

	/**
	 * GET /cart
	 */
	async getCart(): Promise<CartItemModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(CART);
	},

	/**
	 * GET /orders
	 */
	async getOrders(): Promise<OrderModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(ORDERS);
	},

	/**
	 * GET /notifications
	 */
	async getNotifications(): Promise<NotificationModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(NOTIFICATIONS);
	},

	/**
	 * GET /authDefaults
	 */
	async getAuthDefaults(): Promise<AuthDefaultsModel> {
		await sleep(NETWORK_DELAY_MS);
		return clone(AUTH_DEFAULTS);
	},
};

export default mockServiceApi;
