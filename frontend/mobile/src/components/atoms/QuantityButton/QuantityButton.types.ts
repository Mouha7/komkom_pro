import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../Icon';

type QuantityIconName = Extract<CommonIconName, 'plus' | 'minus'>;

export type QuantityButtonProps = {
	icon: QuantityIconName;
	onPress?: () => void;
	disabled?: boolean;
	testID?: string;
	accessibilityLabel?: string;
	containerStyle?: StyleProp<ViewStyle>;
	iconColor?: string;
	iconSize?: number;
};