import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
	CatalogAppBar,
	CatalogFilterModal,
	ProductCardList,
	Icon,
	EmptyState,
	ErrorState,
	ScrollToTopButton,
	useScrollToTopButton,
} from '../../components';
import type { CatalogCategory, ViewMode, FilterOptions, ProductListItemData } from '../../components';
import { lightColors } from '../../styles/colors';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { listCatalogCategories, listProducts } from '../../api/products';
import { styles } from './CatalogScreen.styles';

type CatalogScreenProps = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, 'Catalog'>,
	NativeStackScreenProps<RootStackParamList>
>;

const LOAD_MORE_DELAY_MS = 1200;
const BATCH_SIZE = 4;
const SCROLL_END_THRESHOLD = 220;
const SCROLL_TO_TOP_VISIBILITY_THRESHOLD = 260;

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ route, navigation }) => {
	// Hooks
	const { addItem, removeItem } = useCart();
	const { showToast } = useToast();
	const loadMoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isLoadMoreLockedRef = useRef(false);

	// Search and view mode
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<ViewMode>('list');
	const [isLoadingInitial, setIsLoadingInitial] = useState(true);
	const [isReloading, setIsReloading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
	const [allProducts, setAllProducts] = useState<ProductListItemData[]>([]);
	const [apiError, setApiError] = useState<string | null>(null);

	// Filter modal
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

	// Categories
	const [categories, setCategories] = useState<CatalogCategory[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>('all');

	// Get variant based on viewMode
	const getProductCardVariant = useCallback((): 'portrait' | 'landscape' => {
		return viewMode === 'grid' ? 'portrait' : 'landscape';
	}, [viewMode]);

	const loadCatalogData = useCallback(async (): Promise<void> => {
		setApiError(null);
		setIsLoadingInitial(true);

		try {
			const [nextProducts, nextCategories] = await Promise.all([
				listProducts({ perPage: 100 }),
				listCatalogCategories(),
			]);

			setAllProducts(nextProducts);
			setCategories(nextCategories);
		} catch {
			setApiError('Impossible de charger le catalogue depuis json-server.');
		} finally {
			setIsLoadingInitial(false);
		}
	}, []);

	useEffect(() => {
		void loadCatalogData();
	}, [loadCatalogData]);

	useEffect(() => {
		const initialCategoryId = route.params?.categoryId;
		if (initialCategoryId) {
			setSelectedCategoryId(initialCategoryId);
		}
	}, [route.params?.categoryId]);

	// Filter products based on search, category, and filter options
	const filteredProducts = useMemo(() => {
		return allProducts.filter((product) => {
			// Search filter
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				product.name.toLowerCase().includes(searchLower) ||
				(product.description?.toLowerCase().includes(searchLower) ?? false);
			if (!matchesSearch) return false;

			// Category filter (except 'all' which shows all)
			if (selectedCategoryId && selectedCategoryId !== 'all') {
				if (product.categoryId !== selectedCategoryId) return false;
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
	}, [allProducts, searchQuery, selectedCategoryId, filterOptions]);

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

	const handleCatalogScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>): void => {
			const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
			const y = contentOffset.y;

			const distanceFromEnd = contentSize.height - (y + layoutMeasurement.height);
			if (distanceFromEnd <= SCROLL_END_THRESHOLD) {
				handleLoadMore();
			}
		},
		[handleLoadMore],
	);

	const {
		scrollViewRef,
		isScrollTopVisible,
		handleScroll,
		handleScrollToTop,
		resetScrollTopVisibility,
	} = useScrollToTopButton({
		visibilityThreshold: SCROLL_TO_TOP_VISIBILITY_THRESHOLD,
		onScroll: handleCatalogScroll,
	});

	// Reset pagination when filters change
	useEffect(() => {
		setVisibleCount(BATCH_SIZE);
		setIsLoadingMore(false);
		isLoadMoreLockedRef.current = false;
		resetScrollTopVisibility();

		if (loadMoreTimeoutRef.current) {
			clearTimeout(loadMoreTimeoutRef.current);
			loadMoreTimeoutRef.current = null;
		}
	}, [searchQuery, selectedCategoryId, filterOptions, resetScrollTopVisibility]);

	const handlePressProduct = useCallback((productId: string) => {
		navigation.navigate('ProductDetail', { productId });
	}, [navigation]);

	const handleAddToCart = useCallback((productId: string) => {
		void addItem(productId, 1).then(() => {
			showToast({
				tone: 'success',
				title: 'Produit ajoute',
				message: `Produit ${productId} ajoute au panier`,
				actionLabel: 'Voir',
				actionLabelA11y: 'Voir le panier',
				onActionPress: () => navigation.navigate('Cart'),
			});
		});
	}, [addItem, navigation, showToast]);

	const handleCartToggle = useCallback((productId: string, isSelected: boolean, productName: string) => {
		if (isSelected) {
			return;
		}

		void removeItem(productId).then(() => {
			showToast({
				tone: 'info',
				title: 'Produit retire',
				message: `${productName} a ete retire du panier`,
				actionLabel: 'Voir',
				actionLabelA11y: 'Voir le panier',
				onActionPress: () => navigation.navigate('Cart'),
			});
		});
	}, [navigation, removeItem, showToast]);

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
		setSelectedCategoryId(categoryId);
	};

	const handleApplyFilters = () => {
		setFilterModalVisible(false);
	};

	const handleRetryCatalog = (): void => {
		if (isReloading) {
			return;
		}

		setIsReloading(true);
		void loadCatalogData().finally(() => {
			setIsReloading(false);
		});
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
				{apiError ? (
					<ErrorState
						title='Catalogue indisponible'
						description={apiError}
						actionLabel={isReloading ? 'Rechargement...' : 'Reessayer'}
						onActionPress={handleRetryCatalog}
					/>
				) : filteredProducts.length === 0 ? (
					<EmptyState
						title="Aucun produit trouvé"
						description="Essayez une autre recherche, catégorie, ou modifiez vos filtres."
						icon={<Icon name="package" size={44} color={lightColors.text.secondary} />}
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

export default CatalogScreen;

