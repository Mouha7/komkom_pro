import React, { useMemo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Button, CatalogAppBar, CatalogFilterModal, Text, ProductCardList, EmptyState } from '../../components';
import type { CatalogCategory, ViewMode, FilterOptions, ProductListItemData } from '../../components';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';

type CatalogScreenProps = BottomTabScreenProps<MainTabParamList, 'Catalog'>;

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ route }) => {
	const selectedCategoryLabel = route.params?.categoryLabel;
	const subtitle = selectedCategoryLabel
		? `Categorie selectionnee: ${selectedCategoryLabel}`
		: 'Ecran provisoire pour continuer le dev frontend avant branchement backend.';

	// Mock product data
	const mockProducts: ProductListItemData[] = [
		{
			productId: 'prod-1',
			name: 'Perceuse Visseuse sans fil 18V',
			price: 35000,
			currency: 'FCFA',
			description: 'Perceuse professionnelle DeWalt 18V',
			stockStatus: 'in_stock',
		},
		{
			productId: 'prod-2',
			name: 'Ciment Portland CPJ 35',
			price: 4500,
			currency: 'FCFA',
			description: 'Sac de 50 kg',
			stockStatus: 'in_stock',
		},
		{
			productId: 'prod-3',
			name: 'Câble Électrique U1000 R2V 3G1.5',
			price: 18500,
			currency: 'FCFA',
			description: 'Rouleau de 50m',
			stockStatus: 'low_stock',
		},
		{
			productId: 'prod-4',
			name: 'Peinture Acrylique Blanc Mat',
			price: 12500,
			currency: 'FCFA',
			description: 'Seau de 15L',
			stockStatus: 'in_stock',
		},
		{
			productId: 'prod-5',
			name: 'Tube PVC Ø32mm - 1m',
			price: 2800,
			currency: 'FCFA',
			description: 'Pour plomberie',
			stockStatus: 'in_stock',
		},
		{
			productId: 'prod-6',
			name: 'Robinet Mitigeur Chromé',
			price: 8900,
			currency: 'FCFA',
			description: 'Haute qualité',
			stockStatus: 'in_stock',
		},
		{
			productId: 'prod-7',
			name: 'Clou Galvanisé 100mm - Kg',
			price: 1500,
			currency: 'FCFA',
			description: 'Boîte de 5kg',
			stockStatus: 'in_stock',
		},
		{
			productId: 'prod-8',
			name: 'Vis à Bois 4x40mm - Boîte',
			price: 2200,
			currency: 'FCFA',
			description: '500 pièces',
			stockStatus: 'low_stock',
		},
	];

	// Search and view mode
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<ViewMode>('list');

	// Filter modal
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

	// Categories
	const [categories] = useState<CatalogCategory[]>([
		{ id: 'all', name: 'Tous' },
		{ id: 'gros-oeuvre', name: 'Gros œuvre' },
		{ id: '3-utillage', name: '3 utillage' },
		{ id: 'plomberie', name: 'Plomberie' },
	]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>('all');

	// Get variant based on viewMode
	const getProductCardVariant = useCallback((): 'portrait' | 'landscape' => {
		return viewMode === 'grid' ? 'portrait' : 'landscape';
	}, [viewMode]);

	// Filter products based on search, category, and filter options
	const filteredProducts = useMemo(() => {
		return mockProducts.filter((product) => {
			// Search filter
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				product.name.toLowerCase().includes(searchLower) ||
				(product.description?.toLowerCase().includes(searchLower) ?? false);
			if (!matchesSearch) return false;

			// Category filter (except 'all' which shows all)
			if (selectedCategoryId && selectedCategoryId !== 'all') {
				// Mock mapping: categoryId -> product category
				const categoryMap: Record<string, string[]> = {
					'gros-oeuvre': ['Ciment', 'Clou'],
					'3-utillage': ['Perceuse', 'Vis'],
					plomberie: ['Tube PVC', 'Robinet', 'Câble'],
				};
				const categoryProducts = categoryMap[selectedCategoryId] || [];
				const matchesCategory = categoryProducts.some((cat) =>
					product.name.includes(cat)
				);
				if (!matchesCategory) return false;
			}

			// Price range filter
			if (filterOptions.priceMin && product.price < filterOptions.priceMin) return false;
			if (filterOptions.priceMax && product.price > filterOptions.priceMax) return false;

			// Stock filter
			if (filterOptions.inStock && product.stockStatus !== 'in_stock') return false;

			return true;
		});
	}, [searchQuery, selectedCategoryId, filterOptions]);

	// Handlers
	const handlePressProduct = useCallback((productId: string) => {
		console.log('Product pressed:', productId);
		// TODO: Navigate to ProductDetailScreen
	}, []);

	const handleAddToCart = useCallback((productId: string) => {
		console.log('Add to cart:', productId);
		// TODO: Call cart API
	}, []);

	const handleCartToggle = useCallback((productId: string, isSelected: boolean, productName: string) => {
		console.log('Cart toggle:', { productId, isSelected, productName });
		// TODO: Update product selection state
	}, []);

	const handleOutOfStockPress = useCallback((productName: string) => {
		console.log('Out of stock pressed:', productName);
		// TODO: Show notification
	}, []);

	const handleFilterPress = () => {
		setFilterModalVisible(true);
	};

	const handleCategorySelect = (categoryId: string) => {
		setSelectedCategoryId(categoryId === selectedCategoryId ? undefined : categoryId);
	};

	const handleApplyFilters = () => {
		setFilterModalVisible(false);
		// TODO: Appliquer les filtres à la requête API
		console.log('Filters applied:', filterOptions);
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<CatalogAppBar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				onFilterPress={handleFilterPress}
				categories={categories}
				selectedCategoryId={selectedCategoryId}
				onCategorySelect={handleCategorySelect}
			/>

			<CatalogFilterModal
				visible={filterModalVisible}
				filters={filterOptions}
				onFiltersChange={setFilterOptions}
				onClose={() => setFilterModalVisible(false)}
				onApply={handleApplyFilters}
			/>

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
				{filteredProducts.length === 0 ? (
					<EmptyState
						title="Aucun produit trouvé"
						description="Essayez une autre recherche, catégorie, ou modifiez vos filtres."
						icon="package"
					/>
				) : (
					<ProductCardList
						items={filteredProducts}
						variant={getProductCardVariant()}
						isLoadingInitial={false}
						isLoadingMore={false}
						skeletonCount={0}
						onPressProduct={handlePressProduct}
						onAddToCart={handleAddToCart}
						onCartToggle={handleCartToggle}
						onOutOfStockPress={handleOutOfStockPress}
					/>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s4,
		paddingBottom: spacing.s5,
	},
});

export default CatalogScreen;

