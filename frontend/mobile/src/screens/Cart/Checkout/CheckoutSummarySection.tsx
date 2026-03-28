import React from 'react';
import { View } from 'react-native';

import { Text } from '../../../components';
import { lightColors } from '../../../styles/colors';
import { formatPrice } from '../../../utils/formatPrice';
import { styles } from './CheckoutScreen.styles';
import type { CheckoutSummarySectionProps } from './CheckoutScreen.types';

export const CheckoutSummarySection: React.FC<CheckoutSummarySectionProps> = ({ totals }) => {
	return (
		<View style={styles.section}>
			<Text
				variant='overline'
				textColorOverride={lightColors.text.secondary}
				style={styles.sectionTitle}
			>
				4. Recapitulatif
			</Text>
			<View style={styles.summaryCard}>
				<View style={styles.summaryRow}>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						Sous-total ({String(totals.totalItems)} articles)
					</Text>
					<Text variant='body' style={styles.summaryValue}>
						{formatPrice(totals.subtotal)}
					</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						Frais de livraison
					</Text>
					<Text variant='body' style={styles.summaryValue}>
						{totals.deliveryFee > 0 ? formatPrice(totals.deliveryFee) : 'A calculer'}
					</Text>
				</View>
				<View style={styles.summaryTotalRow}>
					<Text variant='h2' textColorOverride={lightColors.text.primary}>
						Total a payer
					</Text>
					<Text variant='h2' style={styles.summaryTotalValue}>
						{formatPrice(totals.total)}
					</Text>
				</View>
			</View>
		</View>
	);
};
