import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../../atoms';

export type SupportContactCardProps = {
	label: string;
	value: string;
	iconName: CommonIconName;
	onPress?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
};