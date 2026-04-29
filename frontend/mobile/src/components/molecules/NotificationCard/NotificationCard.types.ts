import type { NotificationModel } from '../../../mocks/notifications';

export type NotificationCardProps = {
	notification: NotificationModel;
	onPress?: (notification: NotificationModel) => void;
	onActionPress?: (notification: NotificationModel) => void;
	disabled?: boolean;
	testID?: string;
};