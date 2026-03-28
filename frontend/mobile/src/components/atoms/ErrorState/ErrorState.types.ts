import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ErrorStateProps = {
	title: string;
	description: string;
	actionLabel?: string;
	onActionPress?: () => void;
	icon?: ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
