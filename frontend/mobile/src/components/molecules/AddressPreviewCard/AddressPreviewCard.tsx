import React from 'react';
import { Linking, Platform, View } from 'react-native';

import { Button, Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './AddressPreviewCard.styles';
import type { AddressPreviewCardProps } from './AddressPreviewCard.types';

const formatCoordinate = (value: number): string => {
	if (!Number.isFinite(value)) {
		return '—';
	}
	return value.toFixed(5);
};

const buildMapsUrl = (latitude: number, longitude: number, label: string): string => {
	const encoded = encodeURIComponent(label || 'Position');
	if (Platform.OS === 'ios') {
		return `https://maps.apple.com/?ll=${latitude},${longitude}&q=${encoded}`;
	}
	return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encoded})`;
};

export const AddressPreviewCard: React.FC<AddressPreviewCardProps> = ({
	address,
	latitude,
	longitude,
	height = 160,
	showOpenInMapsButton = true,
	containerStyle,
}) => {
	const handleOpenInMaps = async (): Promise<void> => {
		const url = buildMapsUrl(latitude, longitude, address);
		const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
		try {
			const supported = await Linking.canOpenURL(url);
			await Linking.openURL(supported ? url : fallbackUrl);
		} catch {
			void Linking.openURL(fallbackUrl);
		}
	};

	return (
		<View style={[styles.container, { minHeight: height }, containerStyle]}>
			<View style={styles.pinWrap}>
				<Icon name='mapPin' size={26} color={lightColors.primary} />
			</View>

			<Text
				variant='body'
				style={styles.addressText}
				textColorOverride={lightColors.text.primary}
			>
				{address || 'Adresse non renseignée'}
			</Text>

			<Text
				variant='small'
				style={styles.coordsText}
				textColorOverride={lightColors.text.secondary}
			>
				{`Lat ${formatCoordinate(latitude)} · Lon ${formatCoordinate(longitude)}`}
			</Text>

			{showOpenInMapsButton ? (
				<Button
					title='Ouvrir dans Maps'
					variant='secondary'
					onPress={handleOpenInMaps}
					containerStyle={styles.openMapsButton}
					leftIcon={<Icon name='mapPin' size={16} color={lightColors.primary} />}
				/>
			) : null}
		</View>
	);
};
