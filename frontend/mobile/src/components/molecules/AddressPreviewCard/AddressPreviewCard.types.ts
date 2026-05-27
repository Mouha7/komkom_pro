import type { StyleProp, ViewStyle } from 'react-native';

export type AddressPreviewCardProps = {
	address: string;
	latitude: number;
	longitude: number;
	height?: number;
	showOpenInMapsButton?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
};
