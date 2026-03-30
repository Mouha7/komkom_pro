import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../atoms';
import type { CommonIconName } from '../../atoms/Icon';
import { OrderCardAction } from './OrderCardAction';
import { OrderItemsSummary } from './OrderItemsSummary';
import { styles } from './OrderCard.styles';
import type { OrderCardProps } from './OrderCard.types';

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
};

const getStatusMeta = (
	status: string,
): { label: string; iconName: CommonIconName; iconColor: string; pillStyle: object } => {
	switch (status) {
		case 'pending':
			return {
				label: 'En preparation',
				iconName: 'clock',
				iconColor: '#D97706',
				pillStyle: styles.statusPillWarning,
			};
		case 'confirmed':
			return {
				label: 'Confirmee',
				iconName: 'check',
				iconColor: '#0369A1',
				pillStyle: styles.statusPillInfo,
			};
		case 'delivered':
			return {
				label: 'Livree',
				iconName: 'check',
				iconColor: '#15803D',
				pillStyle: styles.statusPillSuccess,
			};
		case 'cancelled':
			return {
				label: 'Annulee',
				iconName: 'close',
				iconColor: '#B91C1C',
				pillStyle: styles.statusPillDanger,
			};
		default:
			return {
				label: 'Inconnu',
				iconName: 'info',
				iconColor: '#374151',
				pillStyle: styles.statusPillNeutral,
			};
	}
};

const getOrderActions = (
	status: string,
	onViewDetails?: () => void,
	onFollowOrder?: () => void,
	onRecommend?: () => void,
) => {
	if (status === 'pending') {
		return [
			{ label: 'Voir détails', variant: 'secondary' as const, onPress: onViewDetails },
			{ label: 'Suivre', variant: 'primary' as const, onPress: onFollowOrder },
		];
	} else if (status === 'delivered') {
		return [
			{ label: 'Voir détails', variant: 'secondary' as const, onPress: onViewDetails },
			{ label: 'Recommander', variant: 'primary' as const, onPress: onRecommend },
		];
	} else if (status === 'cancelled') {
		return [
			{ label: 'Voir détails', variant: 'secondary' as const, onPress: onViewDetails },
		];
	}
	return [{ label: 'Voir détails', variant: 'secondary' as const, onPress: onViewDetails }];
};

export const OrderCard: React.FC<OrderCardProps> = ({
	orderId,
	reference,
	date,
	status,
	items,
	itemsCount,
	total,
	currency = 'FCFA',
	onViewDetails,
	onFollowOrder,
	onRecommend,
	containerStyle,
	testID,
}) => {
	const itemsSummary = items.map((item) => `${item.name} x${item.quantity}`).join(', ');
	const actions = getOrderActions(status, onViewDetails, onFollowOrder, onRecommend);
	const statusMeta = getStatusMeta(status);

	return (
		<View style={[styles.card, containerStyle]} testID={testID}>
			{/* Header: Reference + Date + Status */}
			<View style={styles.cardHeader}>
				<View style={styles.cardHeaderLeft}>
					<Text style={styles.cardReference}>{reference}</Text>
					<Text style={styles.cardDate}>{date}</Text>
				</View>
				<View style={[styles.statusPill, statusMeta.pillStyle]}>
					<Icon name={statusMeta.iconName} size={14} color={statusMeta.iconColor} />
					<Text style={[styles.statusPillLabel, { color: statusMeta.iconColor }]}>
						{statusMeta.label}
					</Text>
				</View>
			</View>

			<View style={styles.cardDivider} />

			{/* Body: Items Summary + Total */}
			<View>
				<OrderItemsSummary summary={itemsSummary} />
				<View style={styles.cardTotalRow}>
					<Text style={styles.cardTotalLabel}>{itemsCount} article(s)</Text>
					<Text style={styles.cardTotalValue}>{formatPrice(total, currency)}</Text>
				</View>
			</View>

			<View style={styles.cardDivider} />

			{/* Footer: Action Buttons */}
			<View style={styles.cardFooter}>
				{actions.map((action, index) => (
					<View key={index} style={{ flex: 1 }}>
						<OrderCardAction
							label={action.label}
							variant={action.variant}
							onPress={action.onPress}
						/>
					</View>
				))}
			</View>
		</View>
	);
};
