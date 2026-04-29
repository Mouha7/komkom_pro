import type { StyleProp, ViewStyle } from 'react-native';

export type OrderTrackingDriverCardProps = {
	driverName: string;
	vehicleLabel: string;
	avatarUrl?: string;
	onPressCall?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
};
