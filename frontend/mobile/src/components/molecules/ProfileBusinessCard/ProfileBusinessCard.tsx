import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './ProfileBusinessCard.styles';
import type { ProfileBusinessCardProps } from './ProfileBusinessCard.types';

export const ProfileBusinessCard: React.FC<ProfileBusinessCardProps> = ({
	storeName,
	companyRegistration,
	whatsAppNumber,
	onPressEdit,
}) => {
	return (
		<View style={styles.sectionContainer}>
			<View style={styles.headerRow}>
				<Text
					variant='h3'
					style={styles.title}
					textColorOverride={lightColors.text.primary}
				>
					Informations de l'entreprise
				</Text>

				<Pressable
					onPress={onPressEdit}
					style={styles.editButton}
					accessibilityRole='button'
					accessibilityLabel='Modifier les informations de l entreprise'
				>
					<Icon
						name='settings'
						size={14}
						color={lightColors.primary}
					/>
					<Text
						variant='small'
						textColorOverride={lightColors.primary}
					>
						Modifier
					</Text>
				</Pressable>
			</View>

			<View style={styles.card}>
				<View style={styles.row}>
					<Icon
						name='building2'
						size={20}
						color={lightColors.text.secondary as string}
					/>
					<View style={styles.textWrap}>
						<Text variant='small' textColorOverride={lightColors.text.secondary}>
							Raison sociale
						</Text>
						<Text variant='body' textColorOverride={lightColors.text.primary}>
							{storeName}
						</Text>
					</View>
				</View>

				<View style={styles.divider} />

				<View style={styles.row}>
					<Icon
						name='fileText'
						size={20}
						color={lightColors.text.secondary as string}
					/>
					<View style={styles.textWrap}>
						<Text variant='small' textColorOverride={lightColors.text.secondary}>
							NINEA / RC
						</Text>
						<Text variant='body' textColorOverride={lightColors.text.primary}>
							{companyRegistration}
						</Text>
					</View>
				</View>

				<View style={styles.divider} />

				<View style={styles.row}>
					<Icon
						name='phone'
						size={20}
						color={lightColors.text.secondary as string}
					/>
					<View style={styles.textWrap}>
						<Text variant='small' textColorOverride={lightColors.text.secondary}>
							Numero WhatsApp
						</Text>
						<Text variant='body' textColorOverride={lightColors.text.primary}>
							{whatsAppNumber}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};
