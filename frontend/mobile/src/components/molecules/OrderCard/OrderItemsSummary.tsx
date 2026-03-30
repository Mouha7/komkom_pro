import React from 'react';
import { View } from 'react-native';

import { Text } from '../../atoms';
import { styles } from './OrderCard.styles';

interface OrderItemsSummaryProps {
	summary: string;
	containerStyle?: any;
}

export const OrderItemsSummary: React.FC<OrderItemsSummaryProps> = ({
	summary,
	containerStyle,
}) => {
	return (
		<View style={[containerStyle]}>
			<Text
				variant="body"
				color="secondary"
				maxLines={2}
				style={styles.itemsSummaryText}
			>
				{summary}
			</Text>
		</View>
	);
};
