import React from 'react';
import { View } from 'react-native';

import { QuantityButton, Text } from '../../atoms';
import { useResponsive } from '../../../hooks/useResponsive';
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
	const { isCompactPhone: isCompactScreen, isMedium: isRegularScreen, isExpanded: isLargeScreen } =
		useResponsive();
	const iconSize = isCompactScreen ? 18 : isLargeScreen ? 24 : isRegularScreen ? 22 : 20;
	const isDecreaseDisabled = disabled || quantity <= minQuantity;

	return (
		<View
			style={[
				styles.container,
				isCompactScreen && styles.containerCompact,
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
					isCompactScreen && styles.buttonCompact,
					isRegularScreen && styles.buttonRegular,
					isLargeScreen && styles.buttonLarge,
					buttonStyle,
				]}
			/>
			<Text
				variant={valueVariant}
				style={[
					isCompactScreen && styles.valueCompact,
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
					isCompactScreen && styles.buttonCompact,
					isRegularScreen && styles.buttonRegular,
					isLargeScreen && styles.buttonLarge,
					buttonStyle,
				]}
			/>
		</View>
	);
};