import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../Icon';

export type IconOnlyButtonProps = {
	iconName: CommonIconName;
	onPress?: () => void;
	size?: number;
	borderRadius?: number;
	iconSize?: number;
	iconColor?: string;
	disabled?: boolean;
	testID?: string;
	accessibilityLabel?: string;
	containerStyle?: StyleProp<ViewStyle>;
};
