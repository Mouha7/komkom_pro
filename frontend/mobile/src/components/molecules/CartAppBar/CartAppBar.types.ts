import type { CommonIconName } from '../../atoms';

export type CartAppBarProps = {
	title?: string;
	itemCount?: number;
	onPressBack: () => void;
	onPressClear?: () => void;
	isClearDisabled?: boolean;
	hideRightButton?: boolean;
	hideLeftButton?: boolean;
	rightIconName?: CommonIconName;
	onPressRight?: () => void;
	rightButtonAccessibilityLabel?: string;
	testID?: string;
};
