import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './ProfileSettingsCard.styles';
import type { ProfileSettingsCardProps } from './ProfileSettingsCard.types';

export const ProfileSettingsCard: React.FC<ProfileSettingsCardProps> = ({
	items,
	onItemPress,
}) => {
	return (
		<View style={styles.sectionContainer}>
			<Text
				variant='h3'
				style={styles.title}
				textColorOverride={lightColors.text.primary}
			>
				Paramètres
			</Text>

			<View style={styles.card}>
				{items.map((item, index) => (
					<View key={item.id}>
						<Pressable
							onPress={
								onItemPress
									? () => onItemPress(item.id)
									: undefined
							}
							style={styles.itemRow}
							disabled={!onItemPress}
							accessibilityRole='button'
							accessibilityLabel={item.title}
						>
							<View style={styles.itemIconWrap}>
								<Icon
									name={item.iconName}
									size={18}
									color={lightColors.primary}
								/>
							</View>
							<Text
								variant='body'
								style={styles.itemTitle}
								textColorOverride={lightColors.text.primary}
							>
								{item.title}
							</Text>
							<Icon
								name='arrowRight'
								size={18}
								color={lightColors.text.secondary as string}
							/>
						</Pressable>
						{index < items.length - 1 ? <View style={styles.divider} /> : null}
					</View>
				))}
			</View>
		</View>
	);
};
