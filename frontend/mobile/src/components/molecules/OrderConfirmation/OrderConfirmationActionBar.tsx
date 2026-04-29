import React from 'react';
import { View } from 'react-native';

import { Button, Icon } from '../../atoms';
import { styles } from './OrderConfirmation.styles';
import type { OrderConfirmationActionBarProps } from './OrderConfirmation.types';

export const OrderConfirmationActionBar: React.FC<OrderConfirmationActionBarProps> = ({
	onFollowOrder,
	onReturnHome,
	containerStyle,
}) => {
	return (
		<View style={[styles.actionGroup, containerStyle]}>
			<Button
				title="Suivre ma commande"
				onPress={onFollowOrder}
				variant="primary"
				containerStyle={styles.actionButton}
				leftIcon={
					<View style={styles.actionButtonIcon}>
						<Icon name="map" size={20} color="#FFFFFF" />
					</View>
				}
			/>
			<Button
				title="Retour à l'accueil"
				onPress={onReturnHome}
				variant="secondary"
				containerStyle={styles.actionButton}
			/>
		</View>
	);
};
