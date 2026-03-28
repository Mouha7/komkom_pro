import React from 'react';
import { View } from 'react-native';

import { QuantityButton, Text } from '../../atoms';
import { styles } from './QuantityControl.styles';
import type { QuantityControlProps } from './QuantityControl.types';

export const QuantityControl: React.FC<QuantityControlProps> = ({
	quantity,
	onDecrease,
	onIncrease,
	disabled = false,
	minQuantity = 1,
	decreaseAccessibilityLabel = 'Diminuer la quantite',
	increaseAccessibilityLabel = 'Augmenter la quantite',
	containerStyle,
	buttonStyle,
	valueStyle,
	valueVariant = 'body',
	testID,
}) => {
	const isDecreaseDisabled = disabled || quantity <= minQuantity;

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<QuantityButton
				icon='minus'
				onPress={onDecrease}
				disabled={isDecreaseDisabled}
				accessibilityLabel={decreaseAccessibilityLabel}
				containerStyle={buttonStyle}
			/>
			<Text variant={valueVariant} style={valueStyle}>
				{String(quantity)}
			</Text>
			<QuantityButton
				icon='plus'
				onPress={onIncrease}
				disabled={disabled}
				accessibilityLabel={increaseAccessibilityLabel}
				containerStyle={buttonStyle}
			/>
		</View>
	);
};