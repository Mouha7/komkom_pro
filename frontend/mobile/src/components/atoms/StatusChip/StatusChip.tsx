import React from 'react';
import { View } from 'react-native';

import { Text } from '../Text';
import { styles } from './StatusChip.styles';
import type {
	OrderStatus,
	StatusBadgeProps,
	StatusChipProps,
	StatusTone,
	StockStatus,
} from './StatusChip.types';

const toneToStyle = {
	success: [styles.toneSuccess, styles.textSuccess],
	danger: [styles.toneDanger, styles.textDanger],
	warning: [styles.toneWarning, styles.textWarning],
	info: [styles.toneInfo, styles.textInfo],
	neutral: [styles.toneNeutral, styles.textNeutral],
} as const;

export const StatusChip: React.FC<StatusChipProps> = ({
	label,
	tone = 'neutral',
	compact = false,
	containerStyle,
	testID,
}) => {
	const [containerToneStyle, textToneStyle] = toneToStyle[tone];

	return (
		<View
			style={[styles.base, containerToneStyle, compact && styles.compact, containerStyle]}
			accessibilityRole="text"
			testID={testID}
		>
			<Text variant="small" style={[styles.label, textToneStyle]}>
				{label}
			</Text>
		</View>
	);
};

const stockToLabelTone = (status: StockStatus): { label: string; tone: StatusTone } => {
	switch (status) {
		case 'in_stock':
			return { label: 'En stock', tone: 'success' };
		case 'low_stock':
			return { label: 'Stock faible', tone: 'warning' };
		case 'out_of_stock':
			return { label: 'Rupture', tone: 'danger' };
		default:
			return { label: 'Inconnu', tone: 'neutral' };
	}
};

const orderToLabelTone = (status: OrderStatus): { label: string; tone: StatusTone } => {
	switch (status) {
		case 'draft':
			return { label: 'Brouillon', tone: 'neutral' };
		case 'pending':
			return { label: 'En cours', tone: 'warning' };
		case 'confirmed':
			return { label: 'Confirmee', tone: 'info' };
		case 'delivered':
			return { label: 'Livree', tone: 'success' };
		case 'cancelled':
			return { label: 'Annulee', tone: 'danger' };
		default:
			return { label: 'Inconnu', tone: 'neutral' };
	}
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
	stockStatus,
	orderStatus,
	compact = false,
	testID,
}) => {
	const resolved = stockStatus
		? stockToLabelTone(stockStatus)
		: orderStatus
			? orderToLabelTone(orderStatus)
			: { label: 'Inconnu', tone: 'neutral' as const };

	return (
		<StatusChip
			label={resolved.label}
			tone={resolved.tone}
			compact={compact}
			testID={testID}
		/>
	);
};
