import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";

import { Button, Icon, StatusBadge, Text } from "../../atoms";
import { lightColors } from "../../../styles/colors";
import { styles } from "./ProductCard.styles";
import type { ProductCardProps } from "./ProductCard.types";

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat("fr-FR").format(price) + " " + currency;
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
	onPress,
	disabled = false,
	testID,
	containerStyle,
}) => {
	const isLandscape = variant === "landscape";
	const [isAddedToCart, setIsAddedToCart] = useState(false);

	const handleAddToCart = (): void => {
		setIsAddedToCart(true);
		onAddToCart?.(productId);
	};

	if (isLandscape) {
		return (
			<View style={[styles.container, containerStyle]} testID={testID}>
				<Pressable
					style={styles.landscapeTouchable}
					onPress={() => onPress?.(productId)}
					disabled={disabled}
					accessibilityRole="button"
					accessibilityLabel={name}
				>
					{/* Image à gauche avec badge */}
					<View style={styles.landscapeImageWrap}>
						<Image
							source={{
								uri:
									imageUrl ||
									"https://via.placeholder.com/300x300?text=Produit",
							}}
							style={styles.landscapeImage}
							resizeMode="cover"
						/>
						<View style={styles.landscapeImageBadge}>
							<StatusBadge stockStatus={stockStatus} compact />
						</View>
					</View>

					{/* Contenu à droite */}
					<View style={styles.landscapeContent}>
						{/* Header: titre et description */}
						<View style={styles.landscapeHeader}>
							<Text variant="h3" maxLines={2}>
								{name}
							</Text>
							{description ? (
								<Text
									variant="body"
									color="secondary"
									maxLines={1}
								>
									{description}
								</Text>
							) : null}
						</View>

						{/* Bottom: prix et bouton */}
						<View style={styles.landscapeBottom}>
							<View style={styles.landscapePriceWrap}>
								<Text variant="h2">
									{formatPrice(price, currency)}
								</Text>
							</View>
							<Button
								title={
									isAddedToCart
										? "Ajoute au panier"
										: "Ajouter au panier"
								}
								iconOnly
								leftIcon={
									<Icon
										name={isAddedToCart ? "check" : "plus"}
										size={24}
										color={lightColors.text.onPrimary}
										accessibilityLabel={
											isAddedToCart ? "check" : "plus"
										}
									/>
								}
								onPress={handleAddToCart}
								disabled={disabled}
								accessibilityLabel={
									isAddedToCart
										? "Produit ajoute au panier"
										: "Ajouter " + name + " au panier"
								}
								containerStyle={[
									styles.actionButtonBase,
									styles.landscapeActionButton,
									isAddedToCart && styles.actionButtonSuccess,
								]}
							/>
						</View>
					</View>
				</Pressable>
			</View>
		);
	}

	// PORTRAIT (default)
	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<Pressable
				// style={styles.portraitTouchable}
				onPress={() => onPress?.(productId)}
				disabled={disabled}
				accessibilityRole="button"
				accessibilityLabel={name}
			>
				<View style={styles.landscapeImageWrap}>
					<View style={styles.landscapeImageBadge}>
						<StatusBadge stockStatus={stockStatus} compact />
					</View>

					<Image
						source={{
							uri:
								imageUrl ||
								"https://via.placeholder.com/300x300?text=Produit",
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
							<Text variant="h2">
								{formatPrice(price, currency)}
							</Text>
						</View>
						<Button
							title={
								isAddedToCart
									? "Ajoute au panier"
									: "Ajouter au panier"
							}
							iconOnly
							leftIcon={
								<Icon
									name={isAddedToCart ? "check" : "plus"}
									size={24}
									color={lightColors.text.onPrimary}
									accessibilityLabel={
										isAddedToCart ? "check" : "plus"
									}
								/>
							}
							onPress={handleAddToCart}
							disabled={disabled}
							accessibilityLabel={
								isAddedToCart
									? "Produit ajoute au panier"
									: "Ajouter " + name + " au panier"
							}
							containerStyle={[
								styles.actionButtonBase,
								styles.portraitActionButton,
								isAddedToCart && styles.actionButtonSuccess,
							]}
						/>
					</View>
				</View>
			</Pressable>
		</View>
	);
};
