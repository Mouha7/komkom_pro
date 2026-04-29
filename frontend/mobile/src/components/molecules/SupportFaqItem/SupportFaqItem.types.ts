import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../../atoms';

export type SupportFaqItemProps = {
	title: string;
	description: string;
	iconName: CommonIconName;
	isExpanded: boolean;
	onPress: () => void;
	containerStyle?: StyleProp<ViewStyle>;
};