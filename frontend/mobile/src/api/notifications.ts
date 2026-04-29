import type { NotificationModel } from '../mocks/notifications';
import { getDevApiV1 } from './devApi';
import { getJson } from './httpClient';

let cachedNotifications: NotificationModel[] = [];

const updateCachedNotifications = (notifications: NotificationModel[]): NotificationModel[] => {
	cachedNotifications = notifications;
	return cachedNotifications;
};

export const listNotifications = async (): Promise<NotificationModel[]> => {
	try {
		const v1 = await getDevApiV1();
		return updateCachedNotifications(v1.notifications as NotificationModel[]);
	} catch {
		if (cachedNotifications.length > 0) {
			return cachedNotifications;
		}
		throw new Error('Notifications unavailable');
	}
};

export const markNotificationAsRead = async (
	notificationId: string,
): Promise<NotificationModel> => {
	try {
		const updatedNotification = await getJson<NotificationModel>(
			`/api/v1/notifications/${notificationId}/read`,
		);

		updateCachedNotifications(
			cachedNotifications.map((notification) =>
				notification.id === notificationId ? updatedNotification : notification,
			),
		);

		return updatedNotification;
	} catch {
		const cachedNotification = cachedNotifications.find(
			(notification) => notification.id === notificationId,
		);
		if (cachedNotification) {
			const fallbackNotification = {
				...cachedNotification,
				isRead: true,
			};
			updateCachedNotifications(
				cachedNotifications.map((notification) =>
					notification.id === notificationId
						? fallbackNotification
						: notification,
				),
			);
			return fallbackNotification;
		}

		throw new Error('Notification unavailable');
	}
};

export const markAllNotificationsAsRead = async (): Promise<NotificationModel[]> => {
	try {
		const updatedNotifications = await getJson<NotificationModel[]>(
			'/api/v1/notifications/mark-all-read',
		);
		return updateCachedNotifications(updatedNotifications);
	} catch {
		if (cachedNotifications.length > 0) {
			return updateCachedNotifications(
				cachedNotifications.map((notification) => ({
					...notification,
					isRead: true,
				})),
			);
		}
		throw new Error('Notifications unavailable');
	}
};