import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { HomeAppBar } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { styles } from './HomeScreen.styles';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';
import {
	HomeCategoriesSection,
	HomeProductsSection,
	HomePromoCarousel,
	HomeSearchSection,
	type HomeCategoryItem,
	type HomeProductItem,
	type HomePromoItem,
} from './components';

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const getDisplayNameFromEmail = (email?: string): string => {
	if (!email) {
		return 'Amira';
	}

	const [localPart] = email.split('@');
	if (!localPart || localPart.trim().length === 0) {
		return 'Amira';
	}

	const cleaned = localPart.replace(/[._-]+/g, ' ').trim();
	if (cleaned.length === 0) {
		return 'Amira';
	}

	return cleaned
		.split(' ')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	const [query, setQuery] = useState('');
	const { roles, user } = useAuth();
	const { showToast } = useToast();
	const isEmployee = roles.includes('employee');
	const userName = getDisplayNameFromEmail(user?.email);
	const storeName = isEmployee
		? 'Magasin Partenaire KomKom'
		: 'Quincaillerie Centrale';

	const categories: HomeCategoryItem[] = useMemo(
		() => [
			{ id: 'cat-gros-oeuvre', label: 'Gros oeuvre', iconName: 'building2' },
			{ id: 'cat-outillage', label: 'Outillage', iconName: 'hammer' },
			{ id: 'cat-plomberie', label: 'Plomberie', iconName: 'droplet' },
			{ id: 'cat-electricite', label: 'Electricite', iconName: 'zap' },
		],
		[],
	);

	const promos: HomePromoItem[] = useMemo(
		() => [
			{
				id: 'promo-ciment',
				title: '-15% sur le ciment',
				description: "Offre valable jusqu'a vendredi",
				ctaLabel: 'Commander',
			},
			{
				id: 'promo-ferraille',
				title: '-15% sur le ferraille',
				description: "Offre valable jusqu'a vendredi",
				ctaLabel: 'Commander',
			},
		],
		[],
	);

	const products: HomeProductItem[] = useMemo(
		() => [
			{
				productId: 'p-ciment-portland',
				name: 'Ciment Portland CPJ 35',
				price: 4500,
				description: 'Sac de 50 kg',
				imageUrl:
					'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?auto=format&fit=crop&w=640&q=80',
				stockStatus: 'in_stock',
				categoryId: 'cat-gros-oeuvre',
			},
			{
				productId: 'p-perceuse-18v',
				name: 'Perceuse Visseuse sans fil 18V',
				price: 3500,
				description: 'Unite',
				imageUrl:
					'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=640&q=80',
				stockStatus: 'in_stock',
				categoryId: 'cat-outillage',
			},
			{
				productId: 'p-tuyau-pvc',
				name: 'Tuyau PVC evacuation',
				price: 2800,
				description: 'Barre de 4m',
				imageUrl:
					'https://unsplash.com/fr/photos/un-gros-plan-de-tuyaux-et-de-tuyaux-devant-un-arbre-eebb1aXTL_8',
				stockStatus: 'out_of_stock',
				categoryId: 'cat-plomberie',
			},
			{
				productId: 'p-cable-r2v',
				name: 'Cable Electrique U1000 R2V 3G1.5',
				price: 18500,
				description: 'Rouleau de 50m',
				imageUrl:
					'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=640&q=80',
				stockStatus: 'low_stock',
				categoryId: 'cat-electricite',
			},
		],
		[],
	);

	const displayedProducts = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return products;
		}

		return products.filter((product) => {
			const haystack = `${product.name} ${product.description ?? ''}`.toLowerCase();
			return haystack.includes(normalizedQuery);
		});
	}, [products, query]);

	const handleOpenCategory = (category: HomeCategoryItem): void => {
		navigation.navigate('Catalog', { categoryId: category.id, categoryLabel: category.label });
	};

	const handleOpenPromo = (_item: HomePromoItem): void => {
		navigation.navigate('Catalog');
	};

	const handleOpenProduct = (_productId: string): void => {
		navigation.navigate('Catalog');
	};

	const handleAddToCart = (_productId: string): void => {
		return;
	};

	const handleCartToggle = (_productId: string, isSelected: boolean, productName: string): void => {
		if (isSelected) {
			showToast({
				tone: 'success',
				title: 'Produit ajoute',
				message: `${productName} a ete ajoute au panier`,
				actionLabel: 'Voir',
				actionLabelA11y: 'Voir le panier',
				onActionPress: () => navigation.navigate('Catalog'),
			});
			return;
		}

		showToast({
			tone: 'info',
			title: 'Produit retire',
			message: `${productName} a ete retire du panier`,
			actionLabel: 'Voir',
			actionLabelA11y: 'Voir le panier',
			onActionPress: () => navigation.navigate('Catalog'),
		});
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<HomeAppBar
				userName={userName}
				storeName={storeName}
				notificationCount={2}
				cartCount={5}
				onPressProfile={() => navigation.navigate('Profile')}
				onPressNotifications={() => navigation.navigate('Orders')}
				onPressCart={() => navigation.navigate('Catalog')}
			/>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.section}>
					<HomeCategoriesSection items={categories} onPressCategory={handleOpenCategory} />
				</View>

				{promos.length > 0 ? (
					<View style={styles.section}>
						<HomePromoCarousel items={promos} onPressItem={handleOpenPromo} />
					</View>
				) : null}

				<View style={styles.section}>
					<HomeSearchSection value={query} onChangeText={setQuery} />
				</View>

				<View style={styles.section}>
					<HomeProductsSection
						items={displayedProducts}
						onPressProduct={handleOpenProduct}
						onAddToCart={handleAddToCart}
						onCartToggle={handleCartToggle}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;
