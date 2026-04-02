import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
	listNotifications,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from '../api/notifications';
import type { NotificationModel } from '../mocks/notifications';

type UseNotificationsResult = {
	notifications: NotificationModel[];
	unreadCount: number;
	isLoading: boolean;
	errorMessage: string | null;
	reload: () => Promise<void>;
	markAsRead: (notificationId: string) => Promise<NotificationModel>;
	markAllAsRead: () => Promise<NotificationModel[]>;
};

export const useNotifications = (): UseNotificationsResult => {
	const [notifications, setNotifications] = useState<NotificationModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const reload = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const nextNotifications = await listNotifications();
			setNotifications(nextNotifications);
		} catch (error) {
			const baseMessage = 'Impossible de charger les notifications.';

			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			void reload();
		}, [reload]),
	);

	const markAsRead = useCallback(
		async (notificationId: string): Promise<NotificationModel> => {
			const updatedNotification = await markNotificationAsRead(notificationId);
			setNotifications((currentNotifications) =>
				currentNotifications.map((notification) =>
					notification.id === notificationId ? updatedNotification : notification,
				),
			);
			return updatedNotification;
		},
		[],
	);

	const markAllAsRead = useCallback(async (): Promise<NotificationModel[]> => {
		const updatedNotifications = await markAllNotificationsAsRead();
		setNotifications(updatedNotifications);
		return updatedNotifications;
	}, []);

	const unreadCount = useMemo(
		() => notifications.filter((notification) => !notification.isRead).length,
		[notifications],
	);

	return {
		notifications,
		unreadCount,
		isLoading,
		errorMessage,
		reload,
		markAsRead,
		markAllAsRead,
	};
};