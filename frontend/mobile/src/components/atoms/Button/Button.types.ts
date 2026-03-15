import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = {
	title: string;
	onPress?: () => void;
	variant?: ButtonVariant;
	disabled?: boolean;
	loading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	testID?: string;
	accessibilityLabel?: string;
	containerStyle?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
};
