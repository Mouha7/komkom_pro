import React from 'react';
import { Image, View } from 'react-native';

import { Icon, IconOnlyButton, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import type { OrderTrackingDriverCardProps } from './OrderTrackingDriverCard.types';
import { styles } from './OrderTrackingDriverCard.styles';

export const OrderTrackingDriverCard: React.FC<OrderTrackingDriverCardProps> = ({
	driverName,
	vehicleLabel,
	avatarUrl,
	onPressCall,
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.profileWrap}>
				{avatarUrl ? (
					<Image source={{ uri: avatarUrl }} style={styles.avatar} />
				) : (
					<View style={[styles.avatar, styles.avatarFallback]}>
						<Icon name='user' size={18} color={lightColors.text.secondary} />
					</View>
				)}
				<View style={styles.labelWrap}>
					<Text variant='body' style={{ fontWeight: '700' }}>
						{driverName}
					</Text>
					<Text variant='small' color='secondary'>
						{vehicleLabel}
					</Text>
				</View>
			</View>
			<IconOnlyButton
				iconName='phone'
				onPress={onPressCall}
				size={36}
				borderRadius={18}
				iconSize={16}
				iconColor={lightColors.primaryDark}
				containerStyle={styles.callButton}
				accessibilityLabel='Appeler le livreur'
			/>
		</View>
	);
};
