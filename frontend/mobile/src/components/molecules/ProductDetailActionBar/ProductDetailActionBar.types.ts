export type ProductDetailActionBarProps = {
	quantity: number;
	onDecrease: () => void;
	onIncrease: () => void;
	onAddToCart: () => void;
	addToCartLabel?: string;
	disabled?: boolean;
	testID?: string;
};
