import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../../atoms';

export type SupportContextCardProps = {
	title: string;
	subtitle: string;
	iconName?: CommonIconName;
	containerStyle?: StyleProp<ViewStyle>;
};