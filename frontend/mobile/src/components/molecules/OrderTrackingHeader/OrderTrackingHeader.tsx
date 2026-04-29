import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import type { OrderTrackingHeaderProps } from './OrderTrackingHeader.types';
import { styles } from './OrderTrackingHeader.styles';

export const OrderTrackingHeader: React.FC<OrderTrackingHeaderProps> = ({
	orderReference,
	statusLabel,
	createdAtLabel,
	etaLabel,
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.headerRow}>
				<View>
					<Text variant='h1' style={{ fontWeight: '700' }}>
						#{orderReference}
					</Text>
					<Text variant='body' color='secondary' style={styles.dateLabel}>
						{createdAtLabel}
					</Text>
				</View>
				<View style={styles.statusWrap}>
					<View style={styles.statusDot} />
					<Text variant='small' style={styles.statusLabel} textColorOverride={lightColors.info}>
						{statusLabel}
					</Text>
				</View>
			</View>

			<View style={styles.estimatedCard}>
				<View style={styles.estimatedRow}>
					<View style={styles.estimatedIconWrap}>
						<Icon name='clock' size={20} color={lightColors.primary} />
					</View>
					<View style={styles.estimatedBlock}>
						<Text variant='small' style={styles.estimatedCaption}>
							Livraison estimee
						</Text>
						<Text variant='h3' style={styles.estimatedValue}>
							{etaLabel}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};
