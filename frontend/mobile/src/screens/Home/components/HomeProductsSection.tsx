import React from "react";
import { View, StyleSheet } from "react-native";

import { EmptyState, Icon, ProductCardList, Text } from "../../../components";
import { lightColors } from "../../../styles/colors";
import type { HomeProductItem } from "./HomeSections.types";
import { spacing } from "../../../styles/spacing";

type HomeProductsSectionProps = {
	items: HomeProductItem[];
	onPressProduct: (productId: string) => void;
	onAddToCart: (productId: string) => void;
	onCartToggle: (productId: string, isSelected: boolean, productName: string) => void;
	onOutOfStockPress?: (productName: string) => void;
	isLoadingInitial?: boolean;
	isLoadingMore?: boolean;
	skeletonCount?: number;
};

export const HomeProductsSection: React.FC<HomeProductsSectionProps> = ({
	items,
	onPressProduct,
	onAddToCart,
	onCartToggle,
	onOutOfStockPress,
	isLoadingInitial = false,
	isLoadingMore = false,
	skeletonCount = 0,
}) => {
	const hasSkeletons = skeletonCount > 0;
	const showInitialSkeletons = isLoadingInitial && hasSkeletons;

	return (
		<View style={styles.section}>
			<Text variant="h2" style={styles.title} textColorOverride={lightColors.text.primary}>
				En stock pres de vous
			</Text>
			{items.length === 0 && !showInitialSkeletons ? (
				<EmptyState
					title="Aucun produit trouve"
					description="Essayez une autre recherche ou une autre categorie."
					icon={<Icon name="package" size={44} color={lightColors.text.secondary} />}
				/>
			) : (
				<ProductCardList
					items={items}
					variant="portrait"
					isLoadingInitial={isLoadingInitial}
					isLoadingMore={isLoadingMore}
					skeletonCount={skeletonCount}
					onPressProduct={onPressProduct}
					onAddToCart={onAddToCart}
					onCartToggle={onCartToggle}
					onOutOfStockPress={onOutOfStockPress}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		rowGap: spacing.s3,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
	},
});
