import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './NotificationCard.styles';
import type { NotificationCardProps } from './NotificationCard.types';

const toneToIconWrapStyle = {
	success: styles.iconSuccess,
	info: styles.iconInfo,
	warning: styles.iconWarning,
	error: styles.iconError,
} as const;

const toneToIconColor = {
	success: lightColors.success,
	info: lightColors.info,
	warning: lightColors.warning,
	error: lightColors.danger,
} as const;

export const NotificationCard: React.FC<NotificationCardProps> = ({
	notification,
	onPress,
	onActionPress,
	disabled = false,
	testID,
}) => {
	return (
		<View
			style={[
				styles.container,
				!notification.isRead && styles.containerUnread,
			]}
			testID={testID}
		>
			<Pressable
				onPress={onPress ? () => onPress(notification) : undefined}
				disabled={disabled || !onPress}
				style={({ pressed }) => [styles.pressArea, pressed && styles.pressed]}
				accessibilityRole='button'
				accessibilityLabel={notification.title}
			>
				<View
					style={[
						styles.iconWrapper,
						toneToIconWrapStyle[notification.tone],
					]}
				>
					<Icon
						name={notification.iconName}
						size={20}
						color={toneToIconColor[notification.tone] as string}
					/>
				</View>
				<View style={styles.content}>
					<View style={styles.header}>
						<Text variant='body' style={styles.title}>
							{notification.title}
						</Text>
						<View style={styles.timeGroup}>
							<Text variant='small' color='secondary' style={styles.timeLabel}>
								{notification.timeLabel}
							</Text>
							{!notification.isRead ? <View style={styles.unreadDot} /> : null}
						</View>
					</View>
					<Text variant='bodyLarge' color='secondary' style={styles.message}>
						{notification.message}
					</Text>
				</View>
			</Pressable>

			{notification.actionLabel && onActionPress ? (
				<Pressable
					onPress={() => onActionPress(notification)}
					disabled={disabled}
					style={({ pressed }) => [
						styles.actionButton,
						notification.actionTone === 'primary' && styles.actionPrimary,
						notification.actionTone === 'danger' && styles.actionDanger,
						pressed && styles.pressed,
					]}
					accessibilityRole='button'
					accessibilityLabel={notification.actionLabel}
				>
					<Text
						variant='small'
						style={styles.actionText}
						textColorOverride={
							notification.actionTone === 'primary'
								? lightColors.primary
								: notification.actionTone === 'danger'
									? lightColors.danger
									: lightColors.text.primary
						}
					>
						{notification.actionLabel}
					</Text>
				</Pressable>
			) : null}
		</View>
	);
};