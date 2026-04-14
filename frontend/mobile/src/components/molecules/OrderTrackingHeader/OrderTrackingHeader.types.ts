import type { StyleProp, ViewStyle } from 'react-native';

export type OrderTrackingHeaderProps = {
	orderReference: string;
	statusLabel: string;
	createdAtLabel: string;
	etaLabel: string;
	containerStyle?: StyleProp<ViewStyle>;
};
