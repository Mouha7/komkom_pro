import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, View, useWindowDimensions } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
	ExpandableSection,
	Icon,
	ProductDetailActionBar,
	ProductDetailAppBar,
	ScrollToTopButton,
	Text,
	ErrorState,
	useScrollToTopButton,
} from '../../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useToast } from '../../hooks/useToast';
import { formatAmount } from '../../utils/formatPrice';
import { styles } from './ProductDetailScreen.styles';
import type { ProductDetailData } from './ProductDetailScreen.types';
import { getProductDetail } from '../../api/products';

type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const SCROLL_TO_TOP_VISIBILITY_THRESHOLD = 240;

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
	const { width } = useWindowDimensions();
	const { showToast } = useToast();
	const [product, setProduct] = useState<ProductDetailData | null>(null);
	const [isLoadingProduct, setIsLoadingProduct] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [isFavorite, setIsFavorite] = useState(false);
	const galleryHeight = useMemo(
		() => Math.min(460, Math.max(300, Math.round(width * 0.95))),
		[width],
	);

	const productId = route.params?.productId;

	const loadProduct = useCallback(async (): Promise<void> => {
		if (!productId) {
			setProduct(null);
			setIsLoadingProduct(false);
			setLoadError('Produit introuvable.');
			return;
		}

		setIsLoadingProduct(true);
		setLoadError(null);

		try {
			const detail = await getProductDetail(productId);
			setProduct(detail);
		} catch {
			setLoadError('Impossible de charger les details produit depuis json-server.');
			setProduct(null);
		} finally {
			setIsLoadingProduct(false);
		}
	}, [productId]);

	useEffect(() => {
		void loadProduct();
	}, [loadProduct]);

	const handleDetailScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
		const nextIndex = Math.round(event.nativeEvent.contentOffset.x / Math.max(width, 1));
		setCurrentImageIndex((current) => (current === nextIndex ? current : nextIndex));
	};

	const { scrollViewRef, isScrollTopVisible, handleScroll, handleScrollToTop } = useScrollToTopButton({
		visibilityThreshold: SCROLL_TO_TOP_VISIBILITY_THRESHOLD,
	});

	const handleAddToCart = (): void => {
		if (!product) {
			return;
		}

		showToast({
			tone: 'success',
			title: 'Produit ajoute',
			message: `${quantity} x ${product.name} ajoute au panier`,
			actionLabel: 'Voir',
			actionLabelA11y: 'Voir le panier',
			onActionPress: () => navigation.navigate('Cart'),
		});
	};

	const handleShare = (): void => {
		showToast({
			tone: 'info',
			title: 'Partage',
			message: 'Le partage produit sera active dans une prochaine version.',
		});
	};

	const priceAmount = product ? formatAmount(product.price) : '0';

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
			<View style={styles.appBarOverlay}>
				<ProductDetailAppBar
					onPressBack={() => navigation.goBack()}
					onPressShare={handleShare}
					onPressFavorite={() => setIsFavorite((current) => !current)}
					isFavorite={isFavorite}
				/>
			</View>

			<ScrollView
				ref={scrollViewRef}
				style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
			>
				{loadError ? (
					<ErrorState
						title='Detail produit indisponible'
						description={loadError}
						actionLabel={isLoadingProduct ? 'Rechargement...' : 'Reessayer'}
						onActionPress={() => {
							void loadProduct();
						}}
					/>
				) : null}

				{product ? (
					<>
						<View style={[styles.galleryWrap, { height: galleryHeight }]}>
							<ScrollView
								horizontal
								pagingEnabled
								showsHorizontalScrollIndicator={false}
								onMomentumScrollEnd={handleDetailScroll}
								style={styles.imagePager}
							>
								{product.imageUrls.map((imageUrl) => (
									<Image
										key={imageUrl}
										source={{ uri: imageUrl }}
										style={[styles.image, { width }]}
										resizeMode='contain'
									/>
								))}
							</ScrollView>
							<View style={styles.dotsWrap}>
								{product.imageUrls.map((imageUrl, index) => (
									<View
										key={`${imageUrl}-${index}`}
										style={[styles.dot, index === currentImageIndex && styles.dotActive]}
									/>
								))}
							</View>
						</View>

						<View style={styles.mainBlock}>
							<View style={styles.stockChip}>
								<Text variant='small' style={styles.stockLabel}>
									EN STOCK
								</Text>
							</View>

							<View style={styles.brandRow}>
								<Text variant='small' style={styles.brandLabel}>
									{product.brand}
								</Text>
								<Text variant='small' style={styles.referenceLabel}>
									Ref: {product.reference}
								</Text>
							</View>

							<Text variant='h1' style={styles.productName}>
								{product.name}
							</Text>

							<View style={styles.priceRow}>
								<Text style={styles.priceValue}>{priceAmount}</Text>
								<Text variant='h2' style={styles.priceCurrency}>
									{product.currency}
								</Text>
							</View>

							<View style={styles.unitChip}>
								<Icon name='package' size={16} color='#4B5563' />
								<Text variant='body' style={styles.unitLabel}>
									{product.unitLabel}
								</Text>
							</View>
						</View>

						<ExpandableSection title='Description' defaultExpanded>
							<Text variant='bodyLarge' style={styles.descriptionText}>
								{product.description}
							</Text>
						</ExpandableSection>

						<ExpandableSection title='Caracteristiques techniques' defaultExpanded>
							<View style={styles.specTable}>
								{product.specifications.map((spec, index) => (
									<View
										key={spec.label}
										style={[styles.specRow, index % 2 === 0 && styles.specRowAlt]}
									>
										<Text variant='body' style={styles.specLabel}>
											{spec.label}
										</Text>
										<Text variant='body' style={styles.specValue}>
											{spec.value}
										</Text>
									</View>
								))}
							</View>
						</ExpandableSection>

						<View style={styles.highlightBlock}>
							{product.highlights.map((highlight) => (
								<View key={highlight.title} style={styles.highlightRow}>
									<View style={styles.highlightIconWrap}>
										<Icon name={highlight.iconName} size={20} color='#ED762F' />
									</View>
									<View style={styles.highlightTexts}>
										<Text variant='h3' style={styles.highlightTitle}>
											{highlight.title}
										</Text>
										<Text variant='body' style={styles.highlightDescription}>
											{highlight.description}
										</Text>
									</View>
								</View>
							))}
						</View>
					</>
				) : null}
			</ScrollView>

			<ScrollToTopButton
				visible={isScrollTopVisible}
				onPress={handleScrollToTop}
				accessibilityLabel='Retour en haut de la fiche produit'
				bottomOffset={92}
			/>

			<View style={styles.actionBarDock}>
				<ProductDetailActionBar
					quantity={quantity}
					onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
					onIncrease={() => setQuantity((current) => current + 1)}
					onAddToCart={handleAddToCart}
					disabled={!product}
				/>
			</View>
		</SafeAreaView>
	);
};

export default ProductDetailScreen;
