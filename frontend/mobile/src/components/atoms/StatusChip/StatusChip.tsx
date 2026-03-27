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

const toneToSolidStyle = {
	success: [styles.toneSolidSuccess, styles.textOnSolid],
	danger: [styles.toneSolidDanger, styles.textOnSolid],
	warning: [styles.toneSolidWarning, styles.textOnSolid],
	info: [styles.toneSolidInfo, styles.textOnSolid],
	neutral: [styles.toneSolidNeutral, styles.textOnSolid],
} as const;

export const StatusChip: React.FC<StatusChipProps> = ({
	label,
	tone = 'neutral',
	size = 'md',
	compact = false,
	solid = false,
	borderRadius,
	textTransform,
	containerStyle,
	labelStyle,
	testID,
}) => {
	const [containerToneStyle, textToneStyle] = solid ? toneToSolidStyle[tone] : toneToStyle[tone];
	const sizeStyle = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

	return (
		<View
			style={[
				styles.base,
				sizeStyle,
				containerToneStyle,
				compact && styles.compact,
				borderRadius !== undefined && { borderRadius },
				containerStyle,
			]}
			accessibilityRole="text"
			testID={testID}
		>
			<Text
				variant="small"
				style={[styles.label, textToneStyle, textTransform && { textTransform }, labelStyle]}
			>
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
	size = 'md',
	compact = false,
	solid = false,
	borderRadius,
	textTransform,
	containerStyle,
	labelStyle,
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
			size={size}
			compact={compact}
			solid={solid}
			borderRadius={borderRadius}
			textTransform={textTransform}
			containerStyle={containerStyle}
			labelStyle={labelStyle}
			testID={testID}
		/>
	);
};
