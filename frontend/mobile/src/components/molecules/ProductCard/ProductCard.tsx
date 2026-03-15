import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { Button, StatusBadge, Text } from '../../atoms';
import { styles } from './ProductCard.styles';
import type { ProductCardProps } from './ProductCard.types';

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
};

export const ProductCard: React.FC<ProductCardProps> = ({
	productId,
	name,
	price,
	currency = 'FCFA',
	description,
	imageUrl,
	stockStatus = 'in_stock',
	onAddToCart,
	onPress,
	disabled = false,
	testID,
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<Pressable
				style={styles.touchable}
				onPress={() => onPress?.(productId)}
				disabled={disabled}
				accessibilityRole="button"
				accessibilityLabel={name}
			>
				<View style={styles.head}>
					<StatusBadge stockStatus={stockStatus} compact />
				</View>

				<Image
					source={{ uri: imageUrl || 'https://via.placeholder.com/300x200?text=Produit' }}
					style={styles.image}
					resizeMode="cover"
				/>

				<View style={styles.content}>
					<Text variant="h3" maxLines={2}>
						{name}
					</Text>
					{description ? (
						<Text variant="body" color="secondary" maxLines={1}>
							{description}
						</Text>
					) : null}
				</View>

				<View style={styles.priceRow}>
					<View style={styles.priceWrap}>
						<Text variant="h2">{formatPrice(price, currency)}</Text>
					</View>
					<Button
						title="+"
						onPress={() => onAddToCart?.(productId)}
						disabled={disabled}
						accessibilityLabel={'Ajouter ' + name + ' au panier'}
						containerStyle={styles.actionButton}
					/>
				</View>
			</Pressable>
		</View>
	);
};
