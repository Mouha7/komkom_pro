import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";

import { Button, Icon, StatusBadge, Text } from "../../atoms";
import { lightColors } from "../../../styles/colors";
import { styles } from "./ProductCard.styles";
import type { ProductCardProps } from "./ProductCard.types";

const formatAmount = (price: number): string => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

export const ProductCard: React.FC<ProductCardProps> = ({
	productId,
	name,
	price,
	currency = "FCFA",
	description,
	imageUrl,
	stockStatus = "in_stock",
	variant = "portrait",
	onAddToCart,
	onCartToggle,
	onPress,
	disabled = false,
	testID,
	containerStyle,
}) => {
	const isLandscape = variant === "landscape";
	const [isAddedToCart, setIsAddedToCart] = useState(false);
	const isCartActionDisabled = disabled || stockStatus === "out_of_stock";

	const handleAddToCart = (): void => {
		if (isCartActionDisabled) {
			return;
		}

		setIsAddedToCart((prev) => {
			const next = !prev;
			if (next) {
				onAddToCart?.(productId);
			}
			onCartToggle?.(productId, next, name);
			return next;
		});
	};

	if (isLandscape) {
		return (
			<View style={[styles.containerLandscape, containerStyle]} testID={testID}>
				<Pressable
					style={styles.landscapeTouchable}
					onPress={() => onPress?.(productId)}
					disabled={disabled}
					accessibilityRole="button"
					accessibilityLabel={name}
				>
					<View style={styles.landscapeImageWrap}>
						<Image
							source={{
								uri: imageUrl || "https://via.placeholder.com/300x300?text=Produit",
							}}
							style={styles.landscapeImage}
							resizeMode="cover"
						/>
						<View style={styles.landscapeImageBadge}>
							<StatusBadge stockStatus={stockStatus} compact solid />
						</View>
					</View>

					<View style={styles.landscapeContent}>
						<View style={styles.landscapeHeader}>
							<Text variant="h3" maxLines={2}>
								{name}
							</Text>
							{description ? (
								<Text variant="body" color="secondary" maxLines={1}>
									{description}
								</Text>
							) : null}
						</View>

						<View style={styles.landscapeBottom}>
							<View style={styles.landscapePriceWrap}>
								<Text variant="h2" style={styles.priceAmount}>
									{formatAmount(price)}
								</Text>
								<Text variant="small" style={styles.priceCurrency}>
									{currency}
								</Text>
							</View>
							<Button
								title={isAddedToCart ? "Ajoute au panier" : "Ajouter au panier"}
								iconOnly
								leftIcon={
									<Icon
										name={isAddedToCart ? "check" : "plus"}
										size={24}
										color={lightColors.text.onPrimary}
										accessibilityLabel={isAddedToCart ? "check" : "plus"}
									/>
								}
								onPress={handleAddToCart}
								disabled={isCartActionDisabled}
								accessibilityLabel={
									isCartActionDisabled
										? `Produit en rupture: ${name}`
										: isAddedToCart
											? "Produit ajoute au panier"
											: `Ajouter ${name} au panier`
								}
								containerStyle={[
									styles.actionButtonBase,
									styles.landscapeActionButton,
									isAddedToCart && styles.actionButtonSuccess,
									isCartActionDisabled && styles.actionButtonDisabled,
								]}
							/>
						</View>
					</View>
				</Pressable>
			</View>
		);
	}

	return (
		<View style={[styles.containerPortrait, containerStyle]} testID={testID}>
			<Pressable
				onPress={() => onPress?.(productId)}
				disabled={disabled}
				accessibilityRole="button"
				accessibilityLabel={name}
			>
				<View style={styles.landscapeImageWrap}>
					<View style={styles.landscapeImageBadge}>
						<StatusBadge stockStatus={stockStatus} compact solid />
					</View>

					<Image
						source={{
							uri: imageUrl || "https://via.placeholder.com/300x200?text=Produit",
						}}
						style={styles.portraitImage}
						resizeMode="cover"
					/>
				</View>
				<View style={styles.portraitTouchable}>
					<View style={styles.portraitContent}>
						<Text variant="h3" maxLines={2}>
							{name}
						</Text>
						{description ? (
							<Text variant="body" color="secondary" maxLines={1}>
								{description}
							</Text>
						) : null}
					</View>

					<View style={styles.portraitPriceRow}>
						<View style={styles.portraitPriceWrap}>
							<Text variant="h2" style={styles.priceAmount}>
								{formatAmount(price)}
							</Text>
							<Text variant="small" style={styles.priceCurrency}>
								{currency}
							</Text>
						</View>
						<Button
							title={isAddedToCart ? "Ajoute au panier" : "Ajouter au panier"}
							iconOnly
							leftIcon={
								<Icon
									name={isAddedToCart ? "check" : "plus"}
									size={24}
									color={lightColors.text.onPrimary}
									accessibilityLabel={isAddedToCart ? "check" : "plus"}
								/>
							}
							onPress={handleAddToCart}
							disabled={isCartActionDisabled}
							accessibilityLabel={
								isCartActionDisabled
									? `Produit en rupture: ${name}`
									: isAddedToCart
										? "Produit ajoute au panier"
										: `Ajouter ${name} au panier`
							}
							containerStyle={[
								styles.actionButtonBase,
								styles.portraitActionButton,
								isAddedToCart && styles.actionButtonSuccess,
								isCartActionDisabled && styles.actionButtonDisabled,
							]}
						/>
					</View>
				</View>
			</Pressable>
		</View>
	);
};
