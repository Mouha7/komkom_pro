import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../../atoms';

export type AppBarAction = {
	id: string;
	iconName: CommonIconName;
	onPress: () => void;
	accessibilityLabel: string;
	disabled?: boolean;
	testID?: string;
};

export type AppBarProps = {
	title: string;
	leftAction?: ReactNode;
	leftIconName?: CommonIconName;
	onPressLeft?: () => void;
	leftAccessibilityLabel?: string;
	rightActions?: AppBarAction[];
	rightActionSlot?: ReactNode;
	titleAlign?: 'left' | 'center';
	containerStyle?: StyleProp<ViewStyle>;
	contentStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
