import React from 'react';
import { Image, View } from 'react-native';

import { Button, StatusBadge, Text } from '../../atoms';
import { styles } from './CartItem.styles';
import type { CartItemProps } from './CartItem.types';

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
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
			<Image
				source={{ uri: item.imageUrl || 'https://via.placeholder.com/200x200?text=Produit' }}
				style={styles.image}
				resizeMode="cover"
			/>
			<View style={styles.body}>
				<View style={styles.topRow}>
					<Text variant="h3" maxLines={2}>
						{item.name}
					</Text>
					<StatusBadge stockStatus={item.stockStatus || 'in_stock'} compact />
				</View>
				{item.description ? (
					<Text variant="body" color="secondary" maxLines={1}>
						{item.description}
					</Text>
				) : null}
				<View style={styles.footer}>
					<Text variant="h2">{formatPrice(item.price, item.currency || 'FCFA')}</Text>
					<View style={styles.qtyRow}>
						<Button
							title="-"
							variant="secondary"
							onPress={() => onDecrease?.(item.productId)}
							disabled={disabled || item.quantity <= 1}
							containerStyle={styles.actionButton}
						/>
						<Text variant="body">{String(item.quantity)}</Text>
						<Button
							title="+"
							onPress={() => onIncrease?.(item.productId)}
							disabled={disabled}
							containerStyle={styles.actionButton}
						/>
					</View>
				</View>
				<Button
					title="Retirer"
					variant="ghost"
					onPress={() => onRemove?.(item.productId)}
					disabled={disabled}
				/>
			</View>
		</View>
	);
};
