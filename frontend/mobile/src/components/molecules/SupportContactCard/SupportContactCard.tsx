import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './SupportContactCard.styles';
import type { SupportContactCardProps } from './SupportContactCard.types';

export const SupportContactCard: React.FC<SupportContactCardProps> = ({
	label,
	value,
	iconName,
	onPress,
	containerStyle,
}) => {
	const Container = onPress ? Pressable : View;

	return (
		<Container
			onPress={onPress}
			style={[styles.card, containerStyle]}
			accessibilityRole={onPress ? 'button' : undefined}
			accessibilityLabel={onPress ? label + ' ' + value : undefined}
		>
			<View style={styles.iconWrap}>
				<Icon name={iconName} size={18} color={lightColors.primary} />
			</View>
			<View>
				<Text variant='small' style={styles.label}>
					{label}
				</Text>
				<Text variant='body' style={styles.value}>
					{value}
				</Text>
			</View>
		</Container>
	);
};