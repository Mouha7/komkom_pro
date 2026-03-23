import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { styles } from './CartItem.styles';
import type { CartItemProps } from './CartItem.types';

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
};

const deriveBrand = (name: string): string => {
	const firstToken = name.trim().split(/\s+/)[0] || 'PRODUIT';
	return firstToken.toUpperCase();
};

export const CartItem: React.FC<CartItemProps> = ({
	item,
	onIncrease,
	onDecrease,
	onRemove,
	disabled = false,
	testID,
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<View style={styles.imageWrap}>
				<Image
					source={{ uri: item.imageUrl || 'https://via.placeholder.com/200x200?text=Produit' }}
					style={styles.image}
					resizeMode="cover"
				/>
			</View>
			<View style={styles.body}>
				<View style={styles.topRow}>
					<Text variant="overline" style={styles.brand}>
						{item.brand || deriveBrand(item.name)}
					</Text>
					<Pressable
						onPress={() => onRemove?.(item.productId)}
						disabled={disabled}
						style={styles.removeButton}
						accessibilityRole="button"
						accessibilityLabel={'Retirer ' + item.name}
					>
						<Icon name="close" size={24} color="#374151" />
					</Pressable>
				</View>
				<Text variant="h2" maxLines={2} style={styles.title}>
					{item.name}
				</Text>
				<View style={styles.footer}>
					<View style={styles.priceWrap}>
						<Text variant="small" style={styles.totalPrice}>
							{formatPrice(item.price * item.quantity, item.currency || 'FCFA')}
						</Text>
						{item.description ? (
							<Text variant="small" color="secondary" style={styles.unitPrice}>
								{item.description}
							</Text>
						) : null}
					</View>
					<View style={styles.qtyControl}>
						<Pressable
							onPress={() => onDecrease?.(item.productId)}
							disabled={disabled || item.quantity <= 1}
							style={styles.qtyAction}
							accessibilityRole="button"
							accessibilityLabel={'Diminuer quantite de ' + item.name}
						>
							<Icon name="minus" size={20} color="#111827" />
						</Pressable>
						<Text variant="small" style={styles.qtyValue}>
							{String(item.quantity)}
						</Text>
						<Pressable
							onPress={() => onIncrease?.(item.productId)}
							disabled={disabled}
							style={styles.qtyAction}
							accessibilityRole="button"
							accessibilityLabel={'Augmenter quantite de ' + item.name}
						>
							<Icon name="plus" size={20} color="#111827" />
						</Pressable>
					</View>
				</View>
			</View>
		</View>
	);
};
