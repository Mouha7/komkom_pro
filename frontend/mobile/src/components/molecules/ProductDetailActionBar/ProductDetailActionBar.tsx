import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon } from '../../atoms';
import { QuantityControl } from '../QuantityControl';
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
				<QuantityControl
					quantity={quantity}
					onDecrease={onDecrease}
					onIncrease={onIncrease}
					disabled={disabled}
					decreaseAccessibilityLabel='Diminuer la quantite'
					increaseAccessibilityLabel='Augmenter la quantite'
					containerStyle={styles.quantityControl}
					valueVariant='h3'
					valueStyle={styles.quantityValue}
				/>
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
