import type { ReactNode } from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

export type InputProps = TextInputProps & {
	label?: string;
	errorMessage?: string;
	leftElement?: ReactNode;
	rightElement?: ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<TextStyle>;
	testID?: string;
};
