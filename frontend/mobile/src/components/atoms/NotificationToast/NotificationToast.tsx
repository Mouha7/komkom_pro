import React from 'react';
import { Pressable, View } from 'react-native';

import { colorTokens } from '../../../styles/colors';
import { Icon } from '../Icon';
import { Text } from '../Text';
import type { CommonIconName } from '../Icon';
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

const toneToIconName: Record<NotificationTone, CommonIconName> = {
	success: 'check',
	warning: 'alert',
	danger: 'close',
	info: 'info',
};

const toneToIconColor: Record<NotificationTone, string> = {
	success: colorTokens.success,
	warning: colorTokens.warning,
	danger: colorTokens.danger,
	info: colorTokens.info,
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
	tone = 'info',
	title,
	message,
	onClose,
	closeLabel = 'Fermer la notification',
	actionLabel,
	onActionPress,
	actionLabelA11y,
	containerStyle,
	testID,
}) => {
	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<View style={[styles.accent, toneToAccentStyle[tone]]} />
			<View style={[styles.iconWrap, toneToIconWrapStyle[tone]]}>
				<Icon name={toneToIconName[tone]} size={14} color={toneToIconColor[tone]} />
			</View>
			<View style={styles.content}>
				<View style={styles.titleRow}>
					<Text variant="h2" style={styles.title}>
						{title}
					</Text>
					{actionLabel && onActionPress ? (
						<Pressable
							onPress={onActionPress}
							style={({ pressed }) => [styles.actionButton, pressed && styles.closeButtonPressed]}
							accessibilityRole="button"
							accessibilityLabel={actionLabelA11y ?? actionLabel}
						>
							<Text variant="h2" textColorOverride={colorTokens.primary}>
								{actionLabel}
							</Text>
						</Pressable>
					) : onClose ? (
						<Pressable
							onPress={onClose}
							style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
							accessibilityRole="button"
							accessibilityLabel={closeLabel}
						>
							<Icon name="close" size={16} color={colorTokens.neutral700} />
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
