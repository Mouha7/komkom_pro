export type CartAppBarProps = {
	title?: string;
	itemCount?: number;
	onPressBack: () => void;
	onPressClear?: () => void;
	isClearDisabled?: boolean;
	hideRightButton?: boolean;
	testID?: string;
};
