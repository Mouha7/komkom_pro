import React, { useState } from "react";
import { Image, Pressable, View, useWindowDimensions } from "react-native";

import { Button, Icon, StatusBadge, Text } from "../../atoms";
import { lightColors } from "../../../styles/colors";
import { styles } from "./ProductCard.styles";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import type { ProductCardProps } from "./ProductCard.types";

const formatAmount = (price: number): string => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

export const ProductCard: React.FC<ProductCardProps> = ({
	productId,
	name,
	price,
	loading = false,
	currency = "FCFA",
	description,
	imageUrl,
	stockStatus = "in_stock",
	variant = "portrait",
	onAddToCart,
	onCartToggle,
	onPress,
	onOutOfStockPress,
	disabled = false,
	testID,
	containerStyle,
}) => {
	const { width: screenWidth } = useWindowDimensions();
	const isRegularScreen = screenWidth >= 768 && screenWidth < 1024;
	const isLargeScreen = screenWidth >= 1024;
	const actionIconSize = isLargeScreen ? 28 : isRegularScreen ? 26 : 24;

	if (loading) {
		return (
			<ProductCardSkeleton
				variant={variant}
				containerStyle={containerStyle}
				testID={testID}
			/>
		);
	}

	const isLandscape = variant === "landscape";
	const [isAddedToCart, setIsAddedToCart] = useState(false);
	const isCartActionDisabled = disabled || stockStatus === "out_of_stock";

	const handleCardPress = (): void => {
		if (stockStatus === "out_of_stock") {
			onOutOfStockPress?.(name);
			return;
		}

		onPress?.(productId);
	};

	const handleAddToCart = (): void => {
		if (stockStatus === "out_of_stock") {
			onOutOfStockPress?.(name);
			return;
		}

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
					onPress={handleCardPress}
					disabled={disabled}
					accessibilityRole="button"
					accessibilityLabel={name}
				>
					<View style={styles.landscapeImageWrap}>
						<Image
							source={{
								uri: imageUrl || "https://via.placeholder.com/300x300?text=Produit",
							}}
							style={[
								styles.landscapeImage,
								isRegularScreen && styles.landscapeImageRegular,
								isLargeScreen && styles.landscapeImageLarge,
							]}
							resizeMode="cover"
						/>
						<View
							style={[
								styles.landscapeImageBadge,
								isLargeScreen && styles.landscapeImageBadgeLarge,
							]}
						>
							<StatusBadge stockStatus={stockStatus} compact solid />
						</View>
					</View>

					<View
						style={[
							styles.landscapeContent,
							isRegularScreen && styles.landscapeContentRegular,
							isLargeScreen && styles.landscapeContentLarge,
						]}
					>
						<View
							style={[
								styles.landscapeHeader,
								isRegularScreen && styles.landscapeHeaderRegular,
							]}
						>
							<Text variant="h3" maxLines={2}>
								{name}
							</Text>
							{description ? (
								<Text variant="body" color="secondary" maxLines={1}>
									{description}
								</Text>
							) : null}
						</View>

						<View
							style={[
								styles.landscapeBottom,
								isLargeScreen && styles.landscapeBottomLarge,
							]}
						>
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
										size={actionIconSize}
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
									isRegularScreen && styles.actionButtonBaseRegular,
									isLargeScreen && styles.actionButtonBaseLarge,
									styles.landscapeActionButton,
									isRegularScreen && styles.landscapeActionButtonRegular,
									isLargeScreen && styles.landscapeActionButtonLarge,
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
				onPress={handleCardPress}
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
						style={[
							styles.portraitImage,
							isRegularScreen && styles.portraitImageRegular,
							isLargeScreen && styles.portraitImageLarge,
						]}
						resizeMode="cover"
					/>
				</View>
				<View
					style={[
						styles.portraitTouchable,
						isRegularScreen && styles.portraitTouchableRegular,
						isLargeScreen && styles.portraitTouchableLarge,
					]}
				>
					<View
						style={[
							styles.portraitContent,
							isRegularScreen && styles.portraitContentRegular,
						]}
					>
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
									size={actionIconSize}
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
								isRegularScreen && styles.actionButtonBaseRegular,
								isLargeScreen && styles.actionButtonBaseLarge,
								styles.portraitActionButton,
								isRegularScreen && styles.portraitActionButtonRegular,
								isLargeScreen && styles.portraitActionButtonLarge,
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
