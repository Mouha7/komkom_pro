import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './SupportHoursCard.styles';
import type { SupportHoursCardProps } from './SupportHoursCard.types';

export const SupportHoursCard: React.FC<SupportHoursCardProps> = ({
	label,
	description,
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.iconWrap}>
				<Icon name='clock' size={18} color={lightColors.primary} />
			</View>
			<View style={styles.content}>
				<Text variant='body' style={styles.label}>
					{label}
				</Text>
				<Text variant='small' color='secondary' style={styles.description}>
					{description}
				</Text>
			</View>
		</View>
	);
};