import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './SupportFaqItem.styles';
import type { SupportFaqItemProps } from './SupportFaqItem.types';

export const SupportFaqItem: React.FC<SupportFaqItemProps> = ({
	title,
	description,
	iconName,
	isExpanded,
	onPress,
	containerStyle,
}) => {
	return (
		<View style={[styles.card, containerStyle]}>
			<Pressable
				onPress={onPress}
				style={styles.head}
				accessibilityRole='button'
				accessibilityLabel={isExpanded ? 'Replier ' + title : 'Developper ' + title}
			>
				<View style={styles.headLeft}>
					<View style={styles.iconWrap}>
						<Icon name={iconName} size={20} color={lightColors.primary} />
					</View>
					<Text variant='body' style={styles.title}>
						{title}
					</Text>
				</View>
				<Icon
					name={isExpanded ? 'chevronUp' : 'arrowRight'}
					size={20}
					color={lightColors.text.secondary as string}
				/>
			</Pressable>
			{isExpanded ? (
				<View style={styles.body}>
					<Text variant='small' color='secondary' style={styles.description}>
						{description}
					</Text>
				</View>
			) : null}
		</View>
	);
};