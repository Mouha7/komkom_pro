import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../../atoms';

export type BottomBarAction = {
	id: string;
	label: string;
	iconName: CommonIconName;
	onPress: () => void;
	disabled?: boolean;
	badge?: number;
	testID?: string;
	accessibilityLabel?: string;
};

export type BottomBarProps = {
	actions: BottomBarAction[];
	activeActionId?: string;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
