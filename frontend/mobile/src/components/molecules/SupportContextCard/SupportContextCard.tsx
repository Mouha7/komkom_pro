import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './SupportContextCard.styles';
import type { SupportContextCardProps } from './SupportContextCard.types';

export const SupportContextCard: React.FC<SupportContextCardProps> = ({
	title,
	subtitle,
	iconName = 'package',
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.bubble} />
			<View style={styles.contentRow}>
				<View style={styles.iconWrap}>
					<Icon name={iconName} size={24} color={lightColors.text.onPrimary} />
				</View>
				<View style={styles.textWrap}>
					<Text variant='h2' style={styles.title}>
						{title}
					</Text>
					<Text variant='body' style={styles.subtitle}>
						{subtitle}
					</Text>
				</View>
			</View>
		</View>
	);
};