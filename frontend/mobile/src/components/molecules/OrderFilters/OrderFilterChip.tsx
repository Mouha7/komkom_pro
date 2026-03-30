import React from 'react';
import { Pressable } from 'react-native';

import { Text } from '../../atoms';
import { styles } from './OrderFilters.styles';
import type { OrderFilterChipProps } from './OrderFilters.types';

export const OrderFilterChip: React.FC<OrderFilterChipProps> = ({
	id,
	label,
	isActive,
	onPress,
	containerStyle,
	testID,
}) => {
	return (
		<Pressable
			style={[
				styles.chipContainer,
				isActive && styles.chipContainerActive,
				containerStyle,
			]}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityState={{ selected: isActive }}
			accessibilityLabel={label}
			testID={testID}
		>
			<Text
				style={[
					styles.chipLabel,
					isActive && styles.chipLabelActive,
				]}
			>
				{label}
			</Text>
		</Pressable>
	);
};
