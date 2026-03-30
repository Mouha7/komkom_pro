import React from 'react';
import { View } from 'react-native';

import { Icon } from '../../atoms';
import { styles } from './OrderConfirmation.styles';
import type { OrderConfirmationHeaderIconProps } from './OrderConfirmation.types';

export const OrderConfirmationHeaderIcon: React.FC<OrderConfirmationHeaderIconProps> = ({
	containerStyle,
}) => {
	return (
		<View style={[styles.headerIconContainer, containerStyle]}>
			<View style={styles.headerIconInner}>
				<View style={styles.headerIconContent}>
					<Icon name="check" size={32} color="#FFFFFF" />
				</View>
			</View>
		</View>
	);
};
