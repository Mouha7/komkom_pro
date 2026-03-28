export type ProductDetailAppBarProps = {
	onPressBack: () => void;
	onPressShare?: () => void;
	onPressFavorite?: () => void;
	isFavorite?: boolean;
	testID?: string;
};
