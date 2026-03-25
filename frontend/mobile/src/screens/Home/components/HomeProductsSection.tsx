import React from "react";
import { View, StyleSheet } from "react-native";

import { EmptyState, ProductCard, Text } from "../../../components";
import { lightColors } from "../../../styles/colors";
import type { HomeProductItem } from "./HomeSections.types";
import { spacing } from "../../../styles/spacing";

type HomeProductsSectionProps = {
	items: HomeProductItem[];
	onPressProduct: (productId: string) => void;
	onAddToCart: (productId: string) => void;
	onCartToggle: (productId: string, isSelected: boolean, productName: string) => void;
	onOutOfStockPress?: (productName: string) => void;
};

export const HomeProductsSection: React.FC<HomeProductsSectionProps> = ({
	items,
	onPressProduct,
	onAddToCart,
    onCartToggle,
	onOutOfStockPress,
}) => {

	return (
		<View style={styles.section}>
			<Text variant="h2" style={styles.title} textColorOverride={lightColors.text.primary}>
				En stock pres de vous
			</Text>
			{items.length === 0 ? (
				<EmptyState
					title="Aucun produit trouve"
					description="Essayez une autre recherche ou une autre categorie."
					icon="package"
				/>
			) : (
				<View style={styles.list}>
					{items.map((item) => (
						<ProductCard
							key={item.productId}
							variant="portrait"
							productId={item.productId}
							name={item.name}
							price={item.price}
							currency={item.currency}
							description={item.description}
							imageUrl={item.imageUrl}
							stockStatus={item.stockStatus}
							onPress={onPressProduct}
							onAddToCart={onAddToCart}
							onCartToggle={onCartToggle}						onOutOfStockPress={onOutOfStockPress}                            containerStyle={{ width: '48%' }}
						/>
					))}
				</View>
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
	list: {
		flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: spacing.s3,
	},
});
