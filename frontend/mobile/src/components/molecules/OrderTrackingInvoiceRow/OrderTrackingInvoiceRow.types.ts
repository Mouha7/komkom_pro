import type { StyleProp, ViewStyle } from 'react-native';

export type OrderTrackingInvoiceRowProps = {
	label: string;
	onPress: () => void;
	containerStyle?: StyleProp<ViewStyle>;
};
