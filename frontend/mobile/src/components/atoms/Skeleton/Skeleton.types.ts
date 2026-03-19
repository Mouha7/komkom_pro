import type { StyleProp, ViewStyle } from 'react-native';

export type SkeletonListItemProps = {
	lineWidths?: number[];
	showAvatar?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
