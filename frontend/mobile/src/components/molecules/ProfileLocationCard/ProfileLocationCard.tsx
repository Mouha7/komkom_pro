import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Button, Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './ProfileLocationCard.styles';
import type { ProfileLocationCardProps } from './ProfileLocationCard.types';

const formatLastUpdated = (isoDate: string): string => {
	const updatedAt = new Date(isoDate).getTime();
	if (Number.isNaN(updatedAt)) {
		return 'Derniere mise a jour recente';
	}

	const diffMs = Date.now() - updatedAt;
	const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

	if (diffDays < 1) {
		return 'Derniere mise a jour : aujourd hui';
	}

	if (diffDays < 30) {
		return `Derniere mise a jour : il y a ${String(diffDays)} jour${diffDays > 1 ? 's' : ''}`;
	}

	const months = Math.max(1, Math.floor(diffDays / 30));
	return `Derniere mise a jour : il y a ${String(months)} mois`;
};

export const ProfileLocationCard: React.FC<ProfileLocationCardProps> = ({
	address,
	latitude,
	longitude,
	lastUpdatedAt,
	onPressUpdateLocation,
	isUpdatingLocation = false,
}) => {
	return (
		<View style={styles.sectionContainer}>
			<Text
				variant='h3'
				style={styles.title}
				textColorOverride={lightColors.text.primary}
			>
				Localisation GPS de livraison
			</Text>

			<View style={styles.card}>
				<MapView
					style={styles.map}
					pointerEvents='none'
					region={{
						latitude,
						longitude,
						latitudeDelta: 0.012,
						longitudeDelta: 0.012,
					}}
					scrollEnabled={false}
					zoomEnabled={false}
					rotateEnabled={false}
					pitchEnabled={false}
				>
					<Marker coordinate={{ latitude, longitude }}>
						<Icon
							name='mapPin'
							size={26}
							color={lightColors.primary}
						/>
					</Marker>
				</MapView>

				<View style={styles.content}>
					<View style={styles.addressWrap}>
						<Text variant='body' textColorOverride={lightColors.text.primary}>
							{address}
						</Text>
						<Text variant='small' textColorOverride={lightColors.text.secondary}>
							{formatLastUpdated(lastUpdatedAt)}
						</Text>
					</View>

					<Button
						title='Mettre a jour ma position'
						variant='secondary'
						onPress={onPressUpdateLocation}
						loading={isUpdatingLocation}
						leftIcon={
							<Icon
								name='mapPin'
								size={18}
								color={lightColors.primary}
							/>
						}
						containerStyle={styles.updateButton}
					/>
				</View>
			</View>
		</View>
	);
};
