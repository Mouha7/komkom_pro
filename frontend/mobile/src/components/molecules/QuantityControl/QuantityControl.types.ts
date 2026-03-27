import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { TextProps } from '../../atoms';

export type QuantityControlProps = {
	quantity: number;
	onDecrease: () => void;
	onIncrease: () => void;
	disabled?: boolean;
	minQuantity?: number;
	decreaseAccessibilityLabel?: string;
	increaseAccessibilityLabel?: string;
	containerStyle?: StyleProp<ViewStyle>;
	buttonStyle?: StyleProp<ViewStyle>;
	valueStyle?: StyleProp<TextStyle>;
	valueVariant?: TextProps['variant'];
	testID?: string;
};