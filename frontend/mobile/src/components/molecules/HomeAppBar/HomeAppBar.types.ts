export type HomeAppBarProps = {
	userName: string;
	storeName: string;
	avatarUri?: string;
	notificationCount?: number;
	cartCount?: number;
	onPressProfile?: () => void;
	onPressNotifications?: () => void;
	onPressCart?: () => void;
};
