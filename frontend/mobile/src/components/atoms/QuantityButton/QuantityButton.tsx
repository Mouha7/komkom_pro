import React from 'react';
import { Pressable } from 'react-native';

import { Icon } from '../Icon';
import { styles } from './QuantityButton.styles';
import type { QuantityButtonProps } from './QuantityButton.types';

export const QuantityButton: React.FC<QuantityButtonProps> = ({
	icon,
	onPress,
	disabled = false,
	testID,
	accessibilityLabel,
	containerStyle,
	iconColor = '#111827',
	iconSize = 20,
}) => {
	const defaultLabel = icon === 'minus' ? 'Diminuer la quantite' : 'Augmenter la quantite';

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			hitSlop={8}
			style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
				disabled && styles.disabled,
				containerStyle,
			]}
			testID={testID}
			accessibilityRole='button'
			accessibilityLabel={accessibilityLabel ?? defaultLabel}
		>
			<Icon name={icon} size={iconSize} color={iconColor} accessibilityLabel={undefined} />
		</Pressable>
	);
};