import React from 'react';
import { View } from 'react-native';

import { Button, Icon } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './SupportActionBar.styles';
import type { SupportActionBarProps } from './SupportActionBar.types';

export const SupportActionBar: React.FC<SupportActionBarProps> = ({
	onPressCall,
	onPressChat,
	callLabel = 'Appeler',
	chatLabel = 'Chat',
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.separator} />
			<View style={styles.actionsRow}>
				<Button
					title={callLabel}
					variant='secondary'
					onPress={onPressCall}
					containerStyle={styles.callButton}
					textStyle={styles.callText}
					leftIcon={<Icon name='phone' size={18} color={lightColors.text.primary} />}
				/>
				<Button
					title={chatLabel}
					variant='primary'
					onPress={onPressChat}
					containerStyle={styles.chatButton}
					textStyle={styles.chatText}
					leftIcon={<Icon name='messageCircle' size={18} color={lightColors.text.onPrimary} />}
				/>
			</View>
		</View>
	);
};