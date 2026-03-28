import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	disabled = false,
	loading = false,
	iconOnly = false,
	leftIcon,
	rightIcon,
	testID,
	accessibilityLabel,
	containerStyle,
	textStyle,
}) => {
	const effectiveDisabled = disabled || loading;
	const shouldRenderLabel = Boolean(title) && !iconOnly;

	const labelStyleByVariant =
		variant === 'primary'
			? styles.labelPrimary
			: variant === 'secondary'
				? styles.labelSecondary
				: styles.labelGhost;

	return (
		<TouchableOpacity
			style={[styles.base, styles[variant], effectiveDisabled && styles.disabled, containerStyle]}
			onPress={onPress}
			disabled={effectiveDisabled}
			activeOpacity={0.8}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel ?? title ?? 'button'}
			testID={testID}
		>
			{loading ? (
				<ActivityIndicator size="small" color={variant === 'primary' ? '#FFFFFF' : '#ED762F'} />
			) : (
				<>
					{leftIcon ? <View>{leftIcon}</View> : null}
					{shouldRenderLabel ? (
						<Text style={[styles.labelBase, labelStyleByVariant, textStyle]}>{title}</Text>
					) : null}
					{rightIcon ? <View>{rightIcon}</View> : null}
				</>
			)}
		</TouchableOpacity>
	);
};
