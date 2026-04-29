import type { StyleProp, ViewStyle } from 'react-native';

export type SupportActionBarProps = {
	onPressCall: () => void;
	onPressChat: () => void;
	callLabel?: string;
	chatLabel?: string;
	containerStyle?: StyleProp<ViewStyle>;
};