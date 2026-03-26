export type FilterOptions = {
	priceMin?: number;
	priceMax?: number;
	inStock?: boolean;
};

export type CatalogFilterModalProps = {
	visible: boolean;
	filters: FilterOptions;
	onFiltersChange: (filters: FilterOptions) => void;
	onClose: () => void;
	onApply: () => void;
};
