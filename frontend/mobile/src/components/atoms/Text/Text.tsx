import React from 'react';
import { Text as RNText } from 'react-native';

import { typography } from '../../../styles/typography';
import { styles } from './Text.styles';
import type { TextProps } from './Text.types';

export const Text: React.FC<TextProps> = ({
	children,
	variant = 'body',
	color = 'primary',
	align = 'left',
	style,
	maxLines,
	textColorOverride,
	...rest
}) => {
	const colorStyle = textColorOverride ? { color: textColorOverride } : styles[color];

	return (
		<RNText
			style={[typography[variant], colorStyle, { textAlign: align }, style]}
			numberOfLines={maxLines}
			{...rest}
		>
			{children}
		</RNText>
	);
};
