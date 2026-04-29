import type { StyleProp, ViewStyle } from 'react-native';

export type OrderTrackingActionBarProps = {
	onPressSupport: () => void;
	onPressConfirmReception: () => void;
	containerStyle?: StyleProp<ViewStyle>;
};
