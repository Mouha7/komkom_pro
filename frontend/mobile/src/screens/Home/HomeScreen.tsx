import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
	HomeAppBar,
	ScrollToTopButton,
	ErrorState,
	useScrollToTopButton,
} from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useNotifications } from "../../hooks/useNotifications";
import { useToast } from "../../hooks/useToast";
import { styles } from "./HomeScreen.styles";
import type { MainTabParamList } from "../../navigation/BottomTabNavigator";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { listHomeCategories, listHomePromos, listProducts } from "../../api/products";
import {
	HomeCategoriesSection,
	HomeProductsSection,
	HomePromoCarousel,
	HomeSearchSection,
	type HomeCategoryItem,
	type HomeProductItem,
	type HomePromoItem,
} from "./components";

type HomeScreenProps = CompositeScreenProps<
	BottomTabScreenProps<MainTabParamList, "Home">,
	NativeStackScreenProps<RootStackParamList>
>;

const BATCH_SIZE = 4;
const LOAD_MORE_DELAY_MS = 1200;
const SCROLL_END_THRESHOLD = 220;
const SCROLL_TO_TOP_VISIBILITY_THRESHOLD = 260;

const getDisplayNameFromEmail = (email?: string): string => {
	if (!email) {
		return "Amira";
	}

	const [localPart] = email.split("@");
	if (!localPart || localPart.trim().length === 0) {
		return "Amira";
	}

	const cleaned = localPart.replace(/[._-]+/g, " ").trim();
	if (cleaned.length === 0) {
		return "Amira";
	}

	return cleaned
		.split(" ")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	const [query, setQuery] = useState("");
	const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
	const [isLoadingInitial, setIsLoadingInitial] = useState(true);
	const [isReloading, setIsReloading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const loadMoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const [products, setProducts] = useState<HomeProductItem[]>([]);
	const [categories, setCategories] = useState<HomeCategoryItem[]>([]);
	const [promos, setPromos] = useState<HomePromoItem[]>([]);
	const [apiError, setApiError] = useState<string | null>(null);

	const isLoadMoreLockedRef = useRef(false);

	const { roles, user } = useAuth();
	const { addItem, removeItem, totalItemsCount } = useCart();
	const { unreadCount } = useNotifications();
	const { showToast } = useToast();
	const isEmployee = roles.includes("employee");
	const userName = getDisplayNameFromEmail(user?.email);
	const storeName = isEmployee
		? "Magasin Partenaire KomKom"
		: "Quincaillerie Centrale";

	const loadHomeData = useCallback(async (): Promise<void> => {
		setIsLoadingInitial(true);
		setApiError(null);

		try {
			const [nextProducts, nextCategories, nextPromos] = await Promise.all([
				listProducts({ perPage: 100 }),
				listHomeCategories(),
				listHomePromos(),
			]);

			setProducts(nextProducts);
			setCategories(nextCategories);
			setPromos(nextPromos);
		} catch {
			setApiError('Impossible de charger les donnees accueil depuis json-server.');
		} finally {
			setIsLoadingInitial(false);
		}
	}, []);

	const filteredProducts = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return products;
		}

		return products.filter((product) => {
			const haystack =
				`${product.name} ${product.description ?? ""}`.toLowerCase();
			return haystack.includes(normalizedQuery);
		});
	}, [products, query]);

	const hasMoreProducts = visibleCount < filteredProducts.length;
	const displayedProducts = useMemo(
		() => filteredProducts.slice(0, visibleCount),
		[filteredProducts, visibleCount],
	);

	const skeletonCount = isLoadingMore
		? Math.min(
				BATCH_SIZE,
				Math.max(filteredProducts.length - visibleCount, 0),
			)
		: isLoadingInitial
			? BATCH_SIZE
			: 0;

	useEffect(() => {
		void loadHomeData();
	}, [loadHomeData]);

	useEffect(() => {
		return () => {
			if (loadMoreTimeoutRef.current) {
				clearTimeout(loadMoreTimeoutRef.current);
			}
		};
	}, []);

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

	const handleHomeScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>): void => {
			const { contentOffset, contentSize, layoutMeasurement } =
				event.nativeEvent;
			const y = contentOffset.y;

			const distanceFromEnd =
				contentSize.height - (y + layoutMeasurement.height);
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
		onScroll: handleHomeScroll,
	});

	useEffect(() => {
		setVisibleCount(BATCH_SIZE);
		setIsLoadingMore(false);
		isLoadMoreLockedRef.current = false;
		resetScrollTopVisibility();

		if (loadMoreTimeoutRef.current) {
			clearTimeout(loadMoreTimeoutRef.current);
			loadMoreTimeoutRef.current = null;
		}
	}, [query, resetScrollTopVisibility]);

	const handleOpenCategory = (category: HomeCategoryItem): void => {
		navigation.navigate("Catalog", {
			categoryId: category.id,
			categoryLabel: category.label,
		});
	};

	const handleOpenPromo = (_item: HomePromoItem): void => {
		navigation.navigate("Catalog");
	};

	const handleOpenProduct = (productId: string): void => {
		navigation.navigate("ProductDetail", { productId });
	};

	const handleAddToCart = (productId: string): void => {
		void addItem(productId, 1).then(() => {
			showToast({
				tone: "success",
				title: "Produit ajoute",
				message: "Article ajoute au panier",
				actionLabel: "Voir",
				actionLabelA11y: "Voir le panier",
				onActionPress: () => navigation.navigate("Cart"),
			});
		});
	};

	const handleCartToggle = (
		productId: string,
		isSelected: boolean,
		productName: string,
	): void => {
		if (isSelected) {
			return;
		}

		void removeItem(productId).then(() => {
			showToast({
				tone: "info",
				title: "Produit retire",
				message: `${productName} a ete retire du panier`,
				actionLabel: "Voir",
				actionLabelA11y: "Voir le panier",
				onActionPress: () => navigation.navigate("Cart"),
			});
		});
	};

	const handleOutOfStockPress = (productName: string): void => {
		showToast({
			tone: "info",
			title: "Produit en rupture",
			message: `${productName} n'est pas disponible actuellement`,
		});
	};

	const handleRetryHomeData = (): void => {
		if (isReloading) {
			return;
		}

		setIsReloading(true);
		void loadHomeData().finally(() => {
			setIsReloading(false);
		});
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
			<HomeAppBar
				userName={userName}
				storeName={storeName}
				notificationCount={unreadCount}
				cartCount={totalItemsCount}
				onPressProfile={() => navigation.navigate("Profile")}
				onPressNotifications={() => navigation.navigate("Notifications")}
				onPressCart={() => navigation.navigate("Cart")}
			/>

			<ScrollView
				ref={scrollViewRef}
				style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.section}>
					<HomeCategoriesSection
						items={categories}
						onPressCategory={handleOpenCategory}
					/>
				</View>

				{promos.length > 0 ? (
					<View style={styles.section}>
						<HomePromoCarousel
							items={promos}
							onPressItem={handleOpenPromo}
						/>
					</View>
				) : null}

				<View style={styles.section}>
					<HomeSearchSection value={query} onChangeText={setQuery} />
				</View>

				<View style={[styles.section, styles.productsSection]}>
					{apiError ? (
						<ErrorState
							title='Accueil indisponible'
							description={apiError}
							actionLabel={isReloading ? 'Rechargement...' : 'Reessayer'}
							onActionPress={handleRetryHomeData}
						/>
					) : (
						<HomeProductsSection
							items={displayedProducts}
							isLoadingInitial={isLoadingInitial}
							isLoadingMore={isLoadingMore}
							skeletonCount={skeletonCount}
							onPressProduct={handleOpenProduct}
							onAddToCart={handleAddToCart}
							onCartToggle={handleCartToggle}
							onOutOfStockPress={handleOutOfStockPress}
						/>
					)}
				</View>
			</ScrollView>

			<ScrollToTopButton
				visible={isScrollTopVisible}
				onPress={handleScrollToTop}
				accessibilityLabel="Retour en haut de la page accueil"
			/>
		</SafeAreaView>
	);
};

export default HomeScreen;
