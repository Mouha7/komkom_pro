import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { Icon } from '../Icon';
import { styles } from './IconOnlyButton.styles';
import type { IconOnlyButtonProps } from './IconOnlyButton.types';

export const IconOnlyButton: React.FC<IconOnlyButtonProps> = ({
	iconName,
	onPress,
	size = 44,
	borderRadius = 22,
	iconSize = 22,
	iconColor = '#111827',
	disabled = false,
	testID,
	accessibilityLabel,
	containerStyle,
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.8}
			style={[
				styles.buttonBase,
				{ width: size, height: size, borderRadius },
				disabled ? styles.disabled : null,
				containerStyle,
			]}
			testID={testID}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel ?? iconName}
		>
			<BlurView intensity={20} tint="light" style={[styles.blurLayer, { borderRadius }]} />
			<View style={[styles.whiteOverlay, { borderRadius }]} />
			<Icon name={iconName} size={iconSize} color={iconColor} accessibilityLabel={undefined} />
		</TouchableOpacity>
	);
};
