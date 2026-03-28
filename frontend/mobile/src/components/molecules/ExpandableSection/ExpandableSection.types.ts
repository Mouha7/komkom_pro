import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ExpandableSectionProps = {
	title: string;
	children: ReactNode;
	defaultExpanded?: boolean;
	testID?: string;
	containerStyle?: StyleProp<ViewStyle>;
	headerStyle?: StyleProp<ViewStyle>;
	bodyStyle?: StyleProp<ViewStyle>;
	titleStyle?: StyleProp<TextStyle>;
};
