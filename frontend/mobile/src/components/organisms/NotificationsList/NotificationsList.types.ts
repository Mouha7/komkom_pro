import type { NotificationModel } from '../../../mocks/notifications';

export type NotificationsListProps = {
	notifications: NotificationModel[];
	isLoading?: boolean;
	errorMessage?: string | null;
	onRetry?: () => void;
	onPressNotification?: (notification: NotificationModel) => void;
	onPressAction?: (notification: NotificationModel) => void;
	processingNotificationId?: string | null;
	testID?: string;
};