/**
 * Product types/categories constants and utilities
 */

export const PRODUCT_TYPES = {
	GROS_OEUVRE: 'gros-oeuvre',
	OUTILLAGE: 'outillage',
	PLOMBERIE: 'plomberie',
	ELECTRICITE: 'electricite',
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

/**
 * Mapping from product type to user-friendly label
 */
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
	[PRODUCT_TYPES.GROS_OEUVRE]: 'Gros œuvre',
	[PRODUCT_TYPES.OUTILLAGE]: 'Outillage',
	[PRODUCT_TYPES.PLOMBERIE]: 'Plomberie',
	[PRODUCT_TYPES.ELECTRICITE]: 'Électricité',
};

/**
 * Ordered list of all product types for UI display
 */
export const ALL_PRODUCT_TYPES: ProductType[] = [
	PRODUCT_TYPES.GROS_OEUVRE,
	PRODUCT_TYPES.OUTILLAGE,
	PRODUCT_TYPES.PLOMBERIE,
	PRODUCT_TYPES.ELECTRICITE,
];

/**
 * Helper to get label for a product type
 */
export const getProductTypeLabel = (type: ProductType): string => {
	return PRODUCT_TYPE_LABELS[type] || type;
};
