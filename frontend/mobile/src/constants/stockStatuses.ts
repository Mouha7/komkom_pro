/**
 * Stock status constants and utilities
 */

export const STOCK_STATUSES = {
	IN_STOCK: "in_stock",
	LOW_STOCK: "low_stock",
	OUT_OF_STOCK: "out_of_stock",
} as const;

export type StockStatus = (typeof STOCK_STATUSES)[keyof typeof STOCK_STATUSES];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
	in_stock: "En stock",
	low_stock: "Stock limité",
	out_of_stock: "Rupture",
};

export const ALL_STOCK_STATUSES: StockStatus[] = [
	STOCK_STATUSES.IN_STOCK,
	STOCK_STATUSES.LOW_STOCK,
	STOCK_STATUSES.OUT_OF_STOCK,
];

export const getStockStatusLabel = (status: StockStatus): string => {
	return STOCK_STATUS_LABELS[status];
};
