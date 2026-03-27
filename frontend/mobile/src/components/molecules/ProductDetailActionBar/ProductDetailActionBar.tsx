import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Text } from '../../atoms';
import { spacing } from '../../../styles/spacing';
import { styles } from './ProductDetailActionBar.styles';
import type { ProductDetailActionBarProps } from './ProductDetailActionBar.types';

export const ProductDetailActionBar: React.FC<ProductDetailActionBarProps> = ({
	quantity,
	onDecrease,
	onIncrease,
	onAddToCart,
	addToCartLabel = 'Ajouter au panier',
	disabled = false,
	testID,
}) => {
	const insets = useSafeAreaInsets();
	const safeBottom = Math.max(insets.bottom, spacing.s2);

	return (
		<View style={[styles.container, { paddingBottom: safeBottom }]} testID={testID}>
			<View style={styles.content}>
				<View style={styles.quantityControl}>
					<Pressable
						onPress={onDecrease}
						disabled={disabled || quantity <= 1}
						style={({ pressed }) => [
							styles.quantityAction,
							pressed && styles.quantityActionPressed,
							(disabled || quantity <= 1) && styles.quantityActionDisabled,
						]}
						accessibilityRole='button'
						accessibilityLabel='Diminuer la quantite'
					>
						<Icon name='minus' size={20} color='#111827' />
					</Pressable>
					<Text variant='h3' style={styles.quantityValue}>
						{String(quantity)}
					</Text>
					<Pressable
						onPress={onIncrease}
						disabled={disabled}
						style={({ pressed }) => [
							styles.quantityAction,
							pressed && styles.quantityActionPressed,
							disabled && styles.quantityActionDisabled,
						]}
						accessibilityRole='button'
						accessibilityLabel='Augmenter la quantite'
					>
						<Icon name='plus' size={20} color='#111827' />
					</Pressable>
				</View>
				<Button
					title={addToCartLabel}
					onPress={onAddToCart}
					disabled={disabled}
					leftIcon={<Icon name='cart' size={20} color='#FFFFFF' />}
					containerStyle={styles.addButton}
				/>
			</View>
		</View>
	);
};
