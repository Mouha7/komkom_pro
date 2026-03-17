import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../Text';
import { styles } from './NotificationToast.styles';
import type { NotificationToastProps, NotificationTone } from './NotificationToast.types';

const toneToAccentStyle = {
	success: styles.toneSuccess,
	warning: styles.toneWarning,
	danger: styles.toneDanger,
	info: styles.toneInfo,
} as const;

const toneToIconWrapStyle = {
	success: styles.iconSuccess,
	warning: styles.iconWarning,
	danger: styles.iconDanger,
	info: styles.iconInfo,
} as const;

const toneToIconText: Record<NotificationTone, string> = {
	success: 'O',
	warning: '!',
	danger: 'X',
	info: 'i',
};

const toneToTextColor: Record<NotificationTone, 'success' | 'warning' | 'danger' | 'info'> = {
	success: 'success',
	warning: 'warning',
	danger: 'danger',
	info: 'info',
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
	tone = 'info',
	title,
	message,
	onClose,
	closeLabel = 'X',
	containerStyle,
	testID,
}) => {
	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<View style={[styles.accent, toneToAccentStyle[tone]]} />
			<View style={[styles.iconWrap, toneToIconWrapStyle[tone]]}>
				<Text variant="small" style={styles.iconText} color={toneToTextColor[tone]}>
					{toneToIconText[tone]}
				</Text>
			</View>
			<View style={styles.content}>
				<View style={styles.titleRow}>
					<Text variant="h2">{title}</Text>
					{onClose ? (
						<Pressable
							onPress={onClose}
							style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
							accessibilityRole="button"
							accessibilityLabel="Fermer la notification"
						>
							<Text variant="h3" color="secondary">
								{closeLabel}
							</Text>
						</Pressable>
					) : null}
				</View>
				<Text variant="bodyLarge" color="secondary">
					{message}
				</Text>
			</View>
		</View>
	);
};
