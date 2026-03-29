import React from 'react';
import { View, useWindowDimensions } from 'react-native';

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
	const { width: screenWidth } = useWindowDimensions();
	const isRegularScreen = screenWidth >= 768 && screenWidth < 1024;
	const isLargeScreen = screenWidth >= 1024;
	const iconSize = isLargeScreen ? 24 : isRegularScreen ? 22 : 20;
	const isDecreaseDisabled = disabled || quantity <= minQuantity;

	return (
		<View
			style={[
				styles.container,
				isRegularScreen && styles.containerRegular,
				isLargeScreen && styles.containerLarge,
				containerStyle,
			]}
			testID={testID}
		>
			<QuantityButton
				icon='minus'
				onPress={onDecrease}
				disabled={isDecreaseDisabled}
				accessibilityLabel={decreaseAccessibilityLabel}
				iconSize={iconSize}
				containerStyle={[
					isRegularScreen && styles.buttonRegular,
					isLargeScreen && styles.buttonLarge,
					buttonStyle,
				]}
			/>
			<Text
				variant={valueVariant}
				style={[
					isRegularScreen && styles.valueRegular,
					isLargeScreen && styles.valueLarge,
					valueStyle,
				]}
			>
				{String(quantity)}
			</Text>
			<QuantityButton
				icon='plus'
				onPress={onIncrease}
				disabled={disabled}
				accessibilityLabel={increaseAccessibilityLabel}
				iconSize={iconSize}
				containerStyle={[
					isRegularScreen && styles.buttonRegular,
					isLargeScreen && styles.buttonLarge,
					buttonStyle,
				]}
			/>
		</View>
	);
};