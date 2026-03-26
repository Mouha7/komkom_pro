import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { CatalogAppBar, CatalogFilterModal, ProductCardList, EmptyState, ScrollToTopButton } from '../../components';
import type { CatalogCategory, ViewMode, FilterOptions, ProductListItemData } from '../../components';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';
import { PRODUCT_TYPES, STOCK_STATUSES } from '../../constants';
import { useToast } from '../../hooks/useToast';

type CatalogScreenProps = BottomTabScreenProps<MainTabParamList, 'Catalog'>;

const INITIAL_LOAD_DELAY_MS = 600;
const LOAD_MORE_DELAY_MS = 1200;
const BATCH_SIZE = 4;
const SCROLL_END_THRESHOLD = 220;
const SCROLL_TO_TOP_VISIBILITY_THRESHOLD = 260;

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ route }) => {
	// Mock product data
	const mockProducts: ProductListItemData[] = [
		{
			productId: 'prod-1',
			name: 'Perceuse Visseuse sans fil 18V',
			price: 35000,
			currency: 'FCFA',
			description: 'Perceuse professionnelle DeWalt 18V',
			stockStatus: STOCK_STATUSES.IN_STOCK,
			categoryId: PRODUCT_TYPES.OUTILLAGE,
		},
		{
			productId: 'prod-2',
			name: 'Ciment Portland CPJ 35',
			price: 4500,
			currency: 'FCFA',
			description: 'Sac de 50 kg',
			stockStatus: STOCK_STATUSES.IN_STOCK,
			categoryId: PRODUCT_TYPES.GROS_OEUVRE,
		},
		{
			productId: 'prod-3',
			name: 'Câble Électrique U1000 R2V 3G1.5',
			price: 18500,
			currency: 'FCFA',
			description: 'Rouleau de 50m',
			stockStatus: STOCK_STATUSES.LOW_STOCK,
			categoryId: PRODUCT_TYPES.PLOMBERIE,
		},
		{
			productId: 'prod-4',
			name: 'Peinture Acrylique Blanc Mat',
			price: 12500,
			currency: 'FCFA',
			description: 'Seau de 15L',
			stockStatus: STOCK_STATUSES.IN_STOCK,
			categoryId: PRODUCT_TYPES.GROS_OEUVRE,
		},
		{
			productId: 'prod-5',
			name: 'Tube PVC Ø32mm - 1m',
			price: 2800,
			currency: 'FCFA',
			description: 'Pour plomberie',
			stockStatus: STOCK_STATUSES.IN_STOCK,
			categoryId: PRODUCT_TYPES.PLOMBERIE,
		},
		{
			productId: 'prod-6',
			name: 'Robinet Mitigeur Chromé',
			price: 8900,
			currency: 'FCFA',
			description: 'Haute qualité',
			stockStatus: STOCK_STATUSES.IN_STOCK,
			categoryId: PRODUCT_TYPES.PLOMBERIE,
		},
		{
			productId: 'prod-7',
			name: 'Clou Galvanisé 100mm - Kg',
			price: 1500,
			currency: 'FCFA',
			description: 'Boîte de 5kg',
			stockStatus: STOCK_STATUSES.IN_STOCK,
			categoryId: PRODUCT_TYPES.GROS_OEUVRE,
		},
		{
			productId: 'prod-8',
			name: 'Vis à Bois 4x40mm - Boîte',
			price: 2200,
			currency: 'FCFA',
			description: '500 pièces',
			stockStatus: STOCK_STATUSES.LOW_STOCK,
			categoryId: PRODUCT_TYPES.OUTILLAGE,
		},
	];

	// Hooks
	const { showToast } = useToast();
	const initialLoadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const loadMoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isLoadMoreLockedRef = useRef(false);
	const scrollViewRef = useRef<ScrollView>(null);

	// Search and view mode
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<ViewMode>('list');
	const [isLoadingInitial, setIsLoadingInitial] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
	const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

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

	const handleScrollToTop = useCallback((): void => {
		scrollViewRef.current?.scrollTo({ y: 0, animated: true });
	}, []);

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

			// Stock status filter
			if (filterOptions.stockStatuses && filterOptions.stockStatuses.length > 0) {
				if (!product.stockStatus || !filterOptions.stockStatuses.includes(product.stockStatus)) {
					return false;
				}
			}

			// Product type filter (from modal)
			if (filterOptions.categoryIds && filterOptions.categoryIds.length > 0) {
				if (!product.categoryId || !filterOptions.categoryIds.includes(product.categoryId)) {
					return false;
				}
			}

			return true;
		});
	}, [searchQuery, selectedCategoryId, filterOptions]);

	const hasMoreProducts = visibleCount < filteredProducts.length;
	const displayedProducts = useMemo(
		() => filteredProducts.slice(0, visibleCount),
		[filteredProducts, visibleCount],
	);

	// Calculate skeleton count
	const skeletonCount = isLoadingMore
		? Math.min(BATCH_SIZE, Math.max(filteredProducts.length - visibleCount, 0))
		: isLoadingInitial
			? BATCH_SIZE
			: 0;

	// Initial loading effect
	useEffect(() => {
		if (initialLoadTimeoutRef.current) {
			clearTimeout(initialLoadTimeoutRef.current);
		}

		initialLoadTimeoutRef.current = setTimeout(() => {
			setIsLoadingInitial(false);
			initialLoadTimeoutRef.current = null;
		}, INITIAL_LOAD_DELAY_MS);

		return () => {
			if (initialLoadTimeoutRef.current) {
				clearTimeout(initialLoadTimeoutRef.current);
				initialLoadTimeoutRef.current = null;
			}
		};
	}, []);

	// Reset pagination when filters change
	useEffect(() => {
		setVisibleCount(BATCH_SIZE);
		setIsLoadingMore(false);
		isLoadMoreLockedRef.current = false;
		setIsScrollTopVisible(false);

		if (loadMoreTimeoutRef.current) {
			clearTimeout(loadMoreTimeoutRef.current);
			loadMoreTimeoutRef.current = null;
		}
	}, [searchQuery, selectedCategoryId, filterOptions]);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (loadMoreTimeoutRef.current) {
				clearTimeout(loadMoreTimeoutRef.current);
			}
		};
	}, []);

	// Handlers
	const handleLoadMore = useCallback((): void => {
		if (isLoadMoreLockedRef.current || isLoadingMore || !hasMoreProducts) {
			return;
		}

		isLoadMoreLockedRef.current = true;
		setIsLoadingMore(true);

		if (loadMoreTimeoutRef.current) {
			clearTimeout(loadMoreTimeoutRef.current);
		}

		loadMoreTimeoutRef.current = setTimeout(() => {
			setVisibleCount((previousCount) =>
				Math.min(previousCount + BATCH_SIZE, filteredProducts.length),
			);
			setIsLoadingMore(false);
			isLoadMoreLockedRef.current = false;
			loadMoreTimeoutRef.current = null;
		}, LOAD_MORE_DELAY_MS);
	}, [filteredProducts.length, hasMoreProducts, isLoadingMore]);

	const handleScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>): void => {
			const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
			const y = contentOffset.y;

			setIsScrollTopVisible(y > SCROLL_TO_TOP_VISIBILITY_THRESHOLD);

			const distanceFromEnd = contentSize.height - (y + layoutMeasurement.height);
			if (distanceFromEnd <= SCROLL_END_THRESHOLD) {
				handleLoadMore();
			}
		},
		[handleLoadMore],
	);

	const handlePressProduct = useCallback((productId: string) => {
		console.log('Product pressed:', productId);
		// TODO: Navigate to ProductDetailScreen
	}, []);

	const handleAddToCart = useCallback((productId: string) => {
		console.log('Add to cart:', productId);
		// TODO: Call cart API
	}, []);

	const handleCartToggle = useCallback((productId: string, isSelected: boolean, productName: string) => {
		if (isSelected) {
			showToast({
				tone: 'success',
				title: 'Produit ajoute',
				message: `${productName} a ete ajoute au panier`,
				actionLabel: 'Voir',
				actionLabelA11y: 'Voir le panier',
			});
			return;
		}

		showToast({
			tone: 'info',
			title: 'Produit retire',
			message: `${productName} a ete retire du panier`,
			actionLabel: 'Voir',
			actionLabelA11y: 'Voir le panier',
		});
	}, [showToast]);

	const handleOutOfStockPress = useCallback((productName: string) => {
		showToast({
			tone: 'info',
			title: 'Produit en rupture',
			message: `${productName} n'est pas disponible actuellement`,
		});
	}, [showToast]);

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

			<ScrollView
				ref={scrollViewRef}
				style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				{filteredProducts.length === 0 ? (
					<EmptyState
						title="Aucun produit trouvé"
						description="Essayez une autre recherche, catégorie, ou modifiez vos filtres."
						icon="package"
					/>
				) : (
					<ProductCardList
						items={displayedProducts}
						variant={getProductCardVariant()}
						isLoadingInitial={isLoadingInitial}
						isLoadingMore={isLoadingMore}
						skeletonCount={skeletonCount}
						onPressProduct={handlePressProduct}
						onAddToCart={handleAddToCart}
						onCartToggle={handleCartToggle}
						onOutOfStockPress={handleOutOfStockPress}
					/>
				)}
			</ScrollView>

			<ScrollToTopButton
				visible={isScrollTopVisible}
				onPress={handleScrollToTop}
				accessibilityLabel="Retour au top du catalogue"
			/>
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

