import type { ProductType, StockStatus } from '../../../constants';

export type FilterOptions = {
	priceMin?: number;
	priceMax?: number;
	stockStatuses?: StockStatus[];
	categoryIds?: ProductType[];
};

export type CatalogFilterModalProps = {
	visible: boolean;
	filters: FilterOptions;
	onFiltersChange: (filters: FilterOptions) => void;
	onClose: () => void;
	onApply: () => void;
};
