import type { CommonIconName } from '../../atoms';

export type ProfileSettingItem = {
	id: string;
	iconName: CommonIconName;
	title: string;
};

export type ProfileSettingsCardProps = {
	items: ProfileSettingItem[];
	onItemPress?: (itemId: string) => void;
};
