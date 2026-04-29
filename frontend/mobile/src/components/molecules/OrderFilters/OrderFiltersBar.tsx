import React from 'react';
import { ScrollView, View } from 'react-native';

import { OrderFilterChip } from './OrderFilterChip';
import { styles } from './OrderFilters.styles';
import type { OrderFiltersProps } from './OrderFilters.types';

export const OrderFiltersBar: React.FC<OrderFiltersProps> = ({
	activeFilter,
	filters,
	onFilterChange,
	containerStyle,
	testID,
}) => {
	return (
		<View style={[styles.barContainer, containerStyle]} testID={testID}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
				scrollEventThrottle={16}
			>
				{filters.map((filter) => (
					<OrderFilterChip
						key={filter.id}
						id={filter.id}
						label={filter.label}
						isActive={activeFilter === filter.id}
						onPress={() => onFilterChange(filter.id)}
					/>
				))}
			</ScrollView>
		</View>
	);
};
