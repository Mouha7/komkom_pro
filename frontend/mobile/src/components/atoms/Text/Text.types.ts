import type { ReactNode } from 'react';
import type { ColorValue, StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

import type { TypographyVariantName } from '../../../styles/typography';

export type TextTone = 'primary' | 'secondary' | 'inverse' | 'success' | 'danger' | 'warning' | 'info';

export type TextProps = RNTextProps & {
	children: ReactNode;
	variant?: TypographyVariantName;
	color?: TextTone;
	align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
	style?: StyleProp<TextStyle>;
	maxLines?: number;
	textColorOverride?: ColorValue;
};
