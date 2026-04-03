import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import type { DimensionValue, LayoutChangeEvent } from 'react-native';

import { ProductCard } from '../../molecules';
import { spacing } from '../../../styles/spacing';
import { styles } from './ProductCardList.styles';
import type { ProductCardListProps } from './ProductCardList.types';

const MOBILE_COLUMNS = 2;
const TABLET_COLUMNS = 3;
const DESKTOP_COLUMNS = 4;
const MIN_CARD_WIDTH = 140;

export const ProductCardList: React.FC<ProductCardListProps> = ({
	items,
	variant = 'portrait',
	isLoadingInitial = false,
	isLoadingMore = false,
	skeletonCount = 0,
	minInitialRows = 2,
	onPressProduct,
	onAddToCart,
	onCartToggle,
	onOutOfStockPress,
	containerStyle,
	testID,
}) => {
	const { width: screenWidth } = useWindowDimensions();
	const [listWidth, setListWidth] = useState(0);
	const isLandscape = variant === 'landscape';

	const columns = isLandscape
		? 1
		: screenWidth >= 1024
			? DESKTOP_COLUMNS
			: screenWidth >= 768
				? TABLET_COLUMNS
				: MOBILE_COLUMNS;

	const horizontalGap = isLandscape ? 0 : columns >= DESKTOP_COLUMNS ? spacing.s3 : spacing.s2;
	const effectiveListWidth = listWidth > 0 ? listWidth : Math.max(screenWidth - spacing.s4 * 2, 0);
	const cardWidthPx = Math.max(
		(effectiveListWidth - horizontalGap * (columns - 1)) / columns,
		MIN_CARD_WIDTH,
	);
	const cardWidth: DimensionValue = cardWidthPx;

	const hasSkeletons = skeletonCount > 0;
	const showInitialSkeletons = isLoadingInitial && hasSkeletons;
	const showLoadMoreSkeletons = isLoadingMore && hasSkeletons;
	const initialSkeletonCount = Math.max(skeletonCount, columns * minInitialRows);

	const handleLayout = (event: LayoutChangeEvent): void => {
		setListWidth(event.nativeEvent.layout.width);
	};

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<View
				onLayout={handleLayout}
				style={[
					styles.list,
					isLandscape && styles.listLandscape,
					!isLandscape && { columnGap: horizontalGap },
				]}
			>
				{showInitialSkeletons
					? Array.from({ length: initialSkeletonCount }).map((_, index) => (
							<ProductCard
								key={`product-initial-skeleton-${index}`}
								loading
								productId={`initial-skeleton-${index}`}
								name=""
								price={0}
								variant={variant}
								containerStyle={[styles.card, { width: cardWidth }]}
							/>
						))
					: null}

				{items.map((item) => (
					<ProductCard
						key={item.productId}
						variant={variant}
						productId={item.productId}
						name={item.name}
						price={item.price}
						currency={item.currency}
						description={item.description}
						imageUrl={item.imageUrl}
						stockStatus={item.stockStatus}
						onPress={onPressProduct}
						onAddToCart={onAddToCart}
						onCartToggle={onCartToggle}
						onOutOfStockPress={onOutOfStockPress}
						containerStyle={[styles.card, { width: cardWidth }]}
					/>
				))}

				{showLoadMoreSkeletons
					? Array.from({ length: skeletonCount }).map((_, index) => (
							<ProductCard
								key={`product-loadmore-skeleton-${index}`}
								loading
								productId={`loadmore-skeleton-${index}`}
								name=""
								price={0}
								variant={variant}
								containerStyle={[styles.card, { width: cardWidth }]}
							/>
						))
					: null}
			</View>
		</View>
	);
};
