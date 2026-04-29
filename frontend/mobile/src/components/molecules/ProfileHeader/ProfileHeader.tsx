import React from 'react';
import { Image, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './ProfileHeader.styles';
import type { ProfileHeaderProps } from './ProfileHeader.types';

const getInitials = (value: string): string => {
	const words = value
		.trim()
		.split(/\s+/)
		.filter(Boolean);

	if (words.length === 0) {
		return 'KK';
	}

	return words
		.slice(0, 2)
		.map((word) => word.charAt(0).toUpperCase())
		.join('');
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	storeName,
	ownerName,
	avatarUrl,
	isVerified = false,
}) => {
	const initials = getInitials(ownerName || storeName);

	return (
		<View style={styles.container}>
			{avatarUrl ? (
				<Image
					source={{ uri: avatarUrl }}
					style={styles.avatarImage}
					resizeMode='cover'
				/>
			) : (
				<View style={styles.avatarFallback}>
					<Text
						variant='h2'
						textColorOverride={lightColors.primaryDark}
					>
						{initials}
					</Text>
				</View>
			)}

			<Text
				variant='h2'
				textColorOverride={lightColors.text.primary}
				style={styles.storeName}
			>
				{storeName}
			</Text>
			<Text
				variant='body'
				textColorOverride={lightColors.text.secondary}
				style={styles.ownerName}
			>
				Proprietaire : {ownerName}
			</Text>

			{isVerified ? (
				<View style={styles.badge}>
					<Icon
						name='shieldCheck'
						size={14}
						color={lightColors.success}
					/>
					<Text
						variant='small'
						textColorOverride={lightColors.success}
					>
						Compte verifie
					</Text>
				</View>
			) : null}
		</View>
	);
};
