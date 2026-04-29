import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import type { OrderTrackingAddressCardProps } from './OrderTrackingAddressCard.types';
import { styles } from './OrderTrackingAddressCard.styles';

export const OrderTrackingAddressCard: React.FC<OrderTrackingAddressCardProps> = ({
	title,
	address,
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.row}>
				<View style={styles.iconWrap}>
					<Icon name='mapPin' size={20} color={lightColors.text.primary} />
				</View>
				<View style={styles.textWrap}>
					<Text variant='body' style={{ fontWeight: '600' }}>
						{title}
					</Text>
					<Text variant='body' color='secondary'>
						{address}
					</Text>
				</View>
			</View>
		</View>
	);
};
