import React from 'react';
import { View } from 'react-native';

import { StatusBadge, Text } from '../../atoms';
import { OrderCardAction } from './OrderCardAction';
import { OrderItemsSummary } from './OrderItemsSummary';
import { styles } from './OrderCard.styles';
import type { OrderCardProps } from './OrderCard.types';

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
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

	return (
		<View style={[styles.card, containerStyle]} testID={testID}>
			{/* Header: Reference + Date + Status Badge */}
			<View style={styles.cardHeader}>
				<View style={styles.cardHeaderLeft}>
					<Text style={styles.cardReference}>{reference}</Text>
					<Text style={styles.cardDate}>{date}</Text>
				</View>
				<StatusBadge orderStatus={status} compact />
			</View>

			<View style={styles.cardDivider} />

			{/* Body: Items Summary + Total */}
			<View style={styles.cardBody}>
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
