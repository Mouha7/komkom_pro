import React from 'react';
import { View } from 'react-native';

import { Text } from '../../atoms';
import { styles } from './OrderSummaryCard.styles';
import type { OrderSummaryCardProps } from './OrderSummaryCard.types';

const DIVIDER_SEGMENTS = Array.from({ length: 46 }, (_, index) => String(index));

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
	totalItems,
	subtotalText,
	deliveryText,
	totalText,
	subtotalLabel = 'Sous-total',
	deliveryLabel = 'Frais de livraison estimes',
	totalLabel = 'Total estime',
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.totalRow}>
				<Text variant='body' color='secondary'>
					{subtotalLabel} ({String(totalItems)} articles)
				</Text>
				<Text variant='h2' style={styles.priceRow}>
					{subtotalText}
				</Text>
			</View>
			<View style={styles.totalRow}>
				<Text variant='body' color='secondary'>
					{deliveryLabel}
				</Text>
				<Text variant='h2' style={styles.priceRow}>
					{deliveryText}
				</Text>
			</View>
			<View style={styles.divider} pointerEvents='none'>
				{DIVIDER_SEGMENTS.map((segment) => (
					<View key={segment} style={styles.dividerSegment} />
				))}
			</View>
			<View style={styles.totalRow}>
				<Text variant='h1' style={styles.totalLabel}>
					{totalLabel}
				</Text>
				<Text variant='h1' style={styles.totalAmount}>
					{totalText}
				</Text>
			</View>
		</View>
	);
};
