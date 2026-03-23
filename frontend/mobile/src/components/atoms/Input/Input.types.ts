import type { ReactNode } from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import type { TypographyVariantName } from '../../../styles/typography';

export type InputProps = TextInputProps & {
	label?: string;
	labelVariant?: TypographyVariantName;
	labelStyle?: StyleProp<TextStyle>;
	errorMessage?: string;
	leftElement?: ReactNode;
	rightElement?: ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<TextStyle>;
	testID?: string;
};
