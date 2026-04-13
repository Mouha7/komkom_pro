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
import {
	DEFAULT_STORE_PROFILE,
	type StoreProfileModel,
	type StoreProfileUpdatePayload,
} from './profile';
import {
	EMPLOYEES,
	type EmployeeModel,
	type InviteEmployeePayload,
	type UpdateEmployeeRolePayload,
} from './employees';

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

let STORE_PROFILE: StoreProfileModel = clone(DEFAULT_STORE_PROFILE);
let STORE_EMPLOYEES: EmployeeModel[] = clone(EMPLOYEES);

const getStoreEmployees = (storeId: string): EmployeeModel[] =>
	STORE_EMPLOYEES.filter((employee) => employee.storeId === storeId);

const findActor = (
	storeId: string,
	actorUserId?: string,
): EmployeeModel | null => {
	if (!actorUserId) {
		return null;
	}

	return (
		getStoreEmployees(storeId).find((employee) => employee.userId === actorUserId) ??
		null
	);
};

const isStoreOwnerActor = (
	storeId: string,
	actorUserId?: string,
): boolean => {
	if (!actorUserId) {
		return false;
	}

	if (STORE_PROFILE.id === storeId && STORE_PROFILE.userId === actorUserId) {
		return true;
	}

	return Boolean(findActor(storeId, actorUserId)?.isOwner);
};

const assertCanInvite = (storeId: string, actorUserId?: string): void => {
	if (!isStoreOwnerActor(storeId, actorUserId)) {
		throw new Error('Seul le proprietaire peut inviter des employes.');
	}
};

const assertCanChangeRole = (
	storeId: string,
	targetEmployee: EmployeeModel,
	actorUserId?: string,
): void => {
	if (!isStoreOwnerActor(storeId, actorUserId)) {
		throw new Error('Seul le proprietaire peut changer les roles.');
	}

	if (targetEmployee.isOwner) {
		throw new Error('Le proprietaire ne peut pas changer son propre role.');
	}

	if (actorUserId && targetEmployee.userId === actorUserId) {
		throw new Error('Le proprietaire ne peut pas changer son propre role.');
	}
};

const assertCanRevoke = (
	storeId: string,
	targetEmployee: EmployeeModel,
	actorUserId?: string,
): void => {
	const isOwnerActor = isStoreOwnerActor(storeId, actorUserId);
	const actorEmployee = findActor(storeId, actorUserId);
	const isManagerActor = !isOwnerActor && actorEmployee?.role === 'manager';

	if (targetEmployee.isOwner) {
		throw new Error('Le proprietaire ne peut pas etre revoque.');
	}

	if (actorUserId && targetEmployee.userId === actorUserId) {
		throw new Error('Vous ne pouvez pas vous revoquer vous-meme.');
	}

	if (isOwnerActor) {
		return;
	}

	if (isManagerActor && targetEmployee.role === 'seller') {
		return;
	}

	throw new Error('Vous ne pouvez pas revoquer cet employe.');
};

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
	 * GET /api/v1/cart/add/:productId/:quantity
	 * Add product to cart by productId (or increment quantity if already present)
	 */
	async addProductToCart(productId: string, quantity: number): Promise<CartItemModel[]> {
		await sleep(NETWORK_DELAY_MS);

		const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
		const existingItem = CART.find((item) => item.productId === productId);

		if (existingItem) {
			existingItem.quantity += safeQuantity;
			return clone(CART);
		}

		const product = PRODUCTS.find((item) => item.id === productId);
		if (!product) {
			return clone(CART);
		}

		const productDetail = PRODUCT_DETAILS.find((item) => item.id === productId);
		const nextCartItem: CartItemModel = {
			id: product.id,
			productId: product.id,
			brand: productDetail?.brand ?? 'KOMKOM',
			name: product.name,
			price: product.price,
			currency: product.currency,
			quantity: safeQuantity,
			description: productDetail?.unitLabel ?? product.description,
			stockStatus: product.stockStatus,
			imageUrl: product.imageUrl,
		};

		CART.push(nextCartItem);
		return clone(CART);
	},

	/**
	 * GET /api/v1/cart/update/:productId/:quantity
	 * Set an absolute quantity for one cart item
	 */
	async updateCartItemQuantity(productId: string, quantity: number): Promise<CartItemModel[]> {
		await sleep(NETWORK_DELAY_MS);

		const nextQuantity = Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0;
		const cartItemIndex = CART.findIndex((item) => item.productId === productId);

		if (cartItemIndex === -1) {
			return clone(CART);
		}

		if (nextQuantity <= 0) {
			CART.splice(cartItemIndex, 1);
			return clone(CART);
		}

		CART[cartItemIndex].quantity = nextQuantity;
		return clone(CART);
	},

	/**
	 * GET /api/v1/cart/remove/:productId
	 * Remove one cart item by productId
	 */
	async removeCartItem(productId: string): Promise<CartItemModel[]> {
		await sleep(NETWORK_DELAY_MS);
		const cartItemIndex = CART.findIndex((item) => item.productId === productId);
		if (cartItemIndex !== -1) {
			CART.splice(cartItemIndex, 1);
		}
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

	/**
	 * GET /api/v1/profile/:userId
	 * Returns store profile by user ID
	 */
	async getStoreProfile(userId: string): Promise<StoreProfileModel | null> {
		await sleep(NETWORK_DELAY_MS);
		if (STORE_PROFILE.userId !== userId) {
			return null;
		}

		return clone(STORE_PROFILE);
	},

	/**
	 * PUT /api/v1/profile/:userId
	 * Updates store profile in memory
	 */
	async updateStoreProfile(
		userId: string,
		payload: StoreProfileUpdatePayload,
	): Promise<StoreProfileModel | null> {
		await sleep(NETWORK_DELAY_MS);
		if (STORE_PROFILE.userId !== userId) {
			return null;
		}

		STORE_PROFILE = {
			...STORE_PROFILE,
			...payload,
			location: {
				...STORE_PROFILE.location,
				...(payload.location ?? {}),
			},
		};

		return clone(STORE_PROFILE);
	},

	/**
	 * GET /api/v1/stores/:storeId/employees
	 * Returns employees list for store
	 */
	async getEmployees(storeId: string): Promise<EmployeeModel[]> {
		await sleep(NETWORK_DELAY_MS);
		return clone(
			STORE_EMPLOYEES.filter((employee) => employee.storeId === storeId),
		);
	},

	/**
	 * POST /api/v1/stores/:storeId/employees
	 * Creates a pending employee invitation
	 */
	async inviteEmployee(
		storeId: string,
		payload: InviteEmployeePayload,
		actorUserId?: string,
	): Promise<EmployeeModel> {
		await sleep(NETWORK_DELAY_MS);
		assertCanInvite(storeId, actorUserId);

		const nextEmployee: EmployeeModel = {
			id: `emp-${Date.now()}`,
			storeId,
			fullName: payload.fullName,
			email: payload.email,
			phone: payload.phone,
			role: payload.role,
			status: 'pending',
			createdAt: new Date().toISOString(),
		};

		STORE_EMPLOYEES = [nextEmployee, ...STORE_EMPLOYEES];
		return clone(nextEmployee);
	},

	/**
	 * PUT /api/v1/stores/:storeId/employees/:employeeId/role
	 * Updates one employee role
	 */
	async updateEmployeeRole(
		storeId: string,
		employeeId: string,
		payload: UpdateEmployeeRolePayload,
		actorUserId?: string,
	): Promise<EmployeeModel | null> {
		await sleep(NETWORK_DELAY_MS);

		const employeeIndex = STORE_EMPLOYEES.findIndex(
			(employee) =>
				employee.id === employeeId && employee.storeId === storeId,
		);

		if (employeeIndex === -1) {
			return null;
		}

		const targetEmployee = STORE_EMPLOYEES[employeeIndex];
		assertCanChangeRole(storeId, targetEmployee, actorUserId);

		STORE_EMPLOYEES[employeeIndex] = {
			...targetEmployee,
			role: payload.role,
			status: 'active',
		};

		return clone(STORE_EMPLOYEES[employeeIndex]);
	},

	/**
	 * DELETE /api/v1/stores/:storeId/employees/:employeeId
	 * Revokes employee access
	 */
	async revokeEmployeeAccess(
		storeId: string,
		employeeId: string,
		actorUserId?: string,
	): Promise<boolean> {
		await sleep(NETWORK_DELAY_MS);

		const targetEmployee = STORE_EMPLOYEES.find(
			(employee) => employee.id === employeeId && employee.storeId === storeId,
		);

		if (!targetEmployee) {
			return false;
		}

		assertCanRevoke(storeId, targetEmployee, actorUserId);

		const previousLength = STORE_EMPLOYEES.length;
		STORE_EMPLOYEES = STORE_EMPLOYEES.filter(
			(employee) =>
				!(employee.id === employeeId && employee.storeId === storeId),
		);

		return STORE_EMPLOYEES.length !== previousLength;
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
	 * GET /cart/add/:productId/:quantity
	 */
	async addProductToCart(productId: string, quantity: number): Promise<CartItemModel[]> {
		return mockServiceApi.addProductToCart(productId, quantity);
	},

	/**
	 * GET /cart/update/:productId/:quantity
	 */
	async updateCartItemQuantity(productId: string, quantity: number): Promise<CartItemModel[]> {
		return mockServiceApi.updateCartItemQuantity(productId, quantity);
	},

	/**
	 * GET /cart/remove/:productId
	 */
	async removeCartItem(productId: string): Promise<CartItemModel[]> {
		return mockServiceApi.removeCartItem(productId);
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
