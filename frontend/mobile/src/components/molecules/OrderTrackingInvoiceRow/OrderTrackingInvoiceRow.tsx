import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import type { OrderTrackingInvoiceRowProps } from './OrderTrackingInvoiceRow.types';
import { styles } from './OrderTrackingInvoiceRow.styles';

export const OrderTrackingInvoiceRow: React.FC<OrderTrackingInvoiceRowProps> = ({
	label,
	onPress,
	containerStyle,
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.82}
			style={[styles.container, containerStyle]}
			accessibilityRole='button'
			accessibilityLabel='Voir la facture detaillee'
		>
			<View style={styles.row}>
				<Icon name='fileText' size={20} color={lightColors.text.secondary} />
				<View style={styles.labelWrap}>
					<Text variant='body' style={{ fontWeight: '500' }}>
						{label}
					</Text>
				</View>
				<Icon name='arrowRight' size={20} color={lightColors.text.secondary} />
			</View>
		</TouchableOpacity>
	);
};
