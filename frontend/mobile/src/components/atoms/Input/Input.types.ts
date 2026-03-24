import type { ReactNode, Ref } from 'react';
import type { StyleProp, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';

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
	inputRef?: Ref<TextInput>;
	testID?: string;
};
