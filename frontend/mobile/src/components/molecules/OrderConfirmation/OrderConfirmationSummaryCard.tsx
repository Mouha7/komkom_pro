import React from 'react';
import { View } from 'react-native';

import { Icon, StatusChip, Text } from '../../atoms';
import { styles } from './OrderConfirmation.styles';
import type { OrderConfirmationSummaryCardProps } from './OrderConfirmation.types';

const getStatusLabel = (status: string): string => {
	const statusMap: Record<string, string> = {
		secured: 'Traitement sécurisé',
		pending: 'En attente',
		completed: 'Complètée',
	};
	return statusMap[status] || status;
};

export const OrderConfirmationSummaryCard: React.FC<OrderConfirmationSummaryCardProps> = ({
	orderId,
	status,
	items,
	totalAmount,
	containerStyle,
}) => {
	const statusLabel = getStatusLabel(status);

	return (
		<View style={[styles.summaryCard, containerStyle]}>
			{/* Header with Order ID and Status */}
			<View style={styles.summaryHeader}>
				<View style={styles.summaryHeaderRow}>
					<Text style={styles.summaryLabel}>Numéro de commande</Text>
					<Text style={styles.summaryValue}>{orderId}</Text>
				</View>
				<View style={styles.summaryHeaderRow}>
					<Text style={styles.summaryLabel}>Statut</Text>
					<View style={styles.tokenBadge}>
						<View style={styles.tokenBadgeIcon}>
							<Icon name="shieldCheck" size={14} color="#C55A1F" />
						</View>
						<Text style={styles.tokenBadgeText}>{statusLabel}</Text>
					</View>
				</View>
			</View>

			{/* Details */}
			<View style={styles.summaryDetails}>
				{items.map((item, index) => (
					<View key={index} style={styles.detailRow}>
						<View style={styles.detailCol}>
							<Text style={styles.summaryLabel}>{item.label}</Text>
							<Text style={styles.detailText}>{item.value}</Text>
							{item.subvalue ? (
								<Text style={styles.detailSubtext}>{item.subvalue}</Text>
							) : null}
						</View>
					</View>
				))}
			</View>

			{/* Total */}
			<View style={styles.totalRow}>
				<Text style={styles.totalLabel}>Total payé</Text>
				<Text style={styles.totalValue}>{totalAmount}</Text>
			</View>
		</View>
	);
};
