export type ViewMode = 'grid' | 'list';

export type CatalogCategory = {
	id: string;
	name: string;
};

export type CatalogAppBarProps = {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	onFilterPress: () => void;
	categories: CatalogCategory[];
	selectedCategoryId?: string;
	onCategorySelect: (categoryId: string) => void;
};
