import type { StyleProp, ViewStyle } from 'react-native';

export type OrderFilterType = 'all' | 'in_progress' | 'delivered' | 'cancelled';

export interface OrderFilterOption {
	id: OrderFilterType;
	label: string;
	icon?: string;
}

export type OrderFiltersProps = {
	activeFilter: OrderFilterType;
	filters: OrderFilterOption[];
	onFilterChange: (filter: OrderFilterType) => void;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};

export type OrderFilterChipProps = {
	id: OrderFilterType;
	label: string;
	isActive: boolean;
	onPress: () => void;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
