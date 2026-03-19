import type { StyleProp, ViewStyle } from 'react-native';

export type NotificationTone = 'success' | 'warning' | 'danger' | 'info';

export type NotificationToastProps = {
	tone?: NotificationTone;
	title: string;
	message: string;
	onClose?: () => void;
	closeLabel?: string;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
