import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppBar, NotificationsList, Text } from '../../components';
import { useNotifications } from '../../hooks/useNotifications';
import { useToast } from '../../hooks/useToast';
import type { NotificationModel } from '../../mocks/notifications';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors, withOpacity } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type NotificationsScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'Notifications'
>;

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
	navigation,
}) => {
	const {
		notifications,
		unreadCount,
		isLoading,
		errorMessage,
		reload,
		markAsRead,
		markAllAsRead,
	} = useNotifications();
	const { showToast } = useToast();
	const [processingNotificationId, setProcessingNotificationId] = useState<
		string | null
	>(null);
	const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

	const handleMarkAllAsRead = async (): Promise<void> => {
		if (unreadCount === 0 || isMarkingAllRead) {
			return;
		}

		setIsMarkingAllRead(true);
		try {
			await markAllAsRead();
			showToast({
				tone: 'success',
				title: 'Notifications mises a jour',
				message: 'Toutes les notifications ont ete marquees comme lues.',
			});
		} catch {
			showToast({
				tone: 'danger',
				title: 'Action impossible',
				message: 'Impossible de marquer toutes les notifications comme lues.',
			});
		} finally {
			setIsMarkingAllRead(false);
		}
	};

	const handleNotificationPress = async (
		notification: NotificationModel,
	): Promise<void> => {
		if (notification.isRead || processingNotificationId) {
			return;
		}

		setProcessingNotificationId(notification.id);
		try {
			await markAsRead(notification.id);
		} catch {
			showToast({
				tone: 'danger',
				title: 'Notification indisponible',
				message: 'Impossible de mettre a jour cette notification.',
			});
		} finally {
			setProcessingNotificationId(null);
		}
	};

	const handleNotificationAction = async (
		notification: NotificationModel,
	): Promise<void> => {
		setProcessingNotificationId(notification.id);

		try {
			if (!notification.isRead) {
				await markAsRead(notification.id);
			}

			switch (notification.destination?.kind) {
				case 'order-detail':
					navigation.navigate('OrderDetail', {
						orderId: notification.destination.orderId,
					});
					break;
				case 'catalog':
					navigation.navigate('MainTabs', {
						screen: 'Catalog',
						params: {
							categoryId: notification.destination.categoryId,
							categoryLabel: notification.destination.categoryLabel,
						},
					});
					break;
				case 'checkout':
					navigation.navigate('Checkout');
					break;
				case 'invoice':
					navigation.navigate('OrderDetail', {
						orderId: notification.destination.orderId,
					});
					showToast({
						tone: 'info',
						title: 'Facture bientot disponible',
						message: 'Le telechargement de facture sera connecte dans une prochaine iteration.',
					});
					break;
				case 'toast':
					showToast({
						tone: notification.destination.tone ?? 'info',
						title: notification.destination.title,
						message: notification.destination.message,
					});
					break;
				default:
					showToast({
						tone: 'info',
						title: notification.title,
						message: notification.message,
					});
			}
		} catch {
			showToast({
				tone: 'danger',
				title: 'Action indisponible',
				message: 'Impossible de traiter cette notification pour le moment.',
			});
		} finally {
			setProcessingNotificationId(null);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
			<AppBar
				title='Notifications'
				leftIconName='arrowLeft'
				onPressLeft={() => navigation.goBack()}
				rightActionSlot={
					<Pressable
						onPress={() => {
							void handleMarkAllAsRead();
						}}
						disabled={unreadCount === 0 || isMarkingAllRead}
						style={({ pressed }) => [
							styles.markAllButton,
							(unreadCount === 0 || isMarkingAllRead) && styles.markAllButtonDisabled,
							pressed && styles.markAllButtonPressed,
						]}
						accessibilityRole='button'
						accessibilityLabel='Tout lire'
					>
						<Text variant='small' style={styles.markAllText} textColorOverride={lightColors.primary}>
							Tout lire
						</Text>
					</Pressable>
				}
			/>

			<View style={styles.content}>
				<NotificationsList
					notifications={notifications}
					isLoading={isLoading}
					errorMessage={errorMessage}
					onRetry={() => {
						void reload();
					}}
					onPressNotification={(notification) => {
						void handleNotificationPress(notification);
					}}
					onPressAction={(notification) => {
						void handleNotificationAction(notification);
					}}
					processingNotificationId={processingNotificationId}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	content: {
		flex: 1,
	},
	markAllButton: {
		paddingHorizontal: spacing.s1,
		paddingVertical: spacing.s1,
		borderRadius: 8,
	},
	markAllButtonDisabled: {
		opacity: 0.45,
	},
	markAllButtonPressed: {
		backgroundColor: withOpacity(lightColors.primary as string, 0.08),
	},
	markAllText: {
		fontWeight: '700',
	},
});

export default NotificationsScreen;