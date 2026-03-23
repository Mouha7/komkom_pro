export type CommonIconName =
	| 'home'
	| 'cart'
	| 'package'
	| 'user'
	| 'settings'
	| 'search'
	| 'plus'
	| 'minus'
	| 'close'
	| 'check'
	| 'alert'
	| 'info'
    | 'wifiOff'
    | 'arrowLeft'
    | 'trash'
    | 'hammer'
    ;

export type IconProps = {
	name: CommonIconName;
	size?: number;
	color?: string;
	strokeWidth?: number;
	testID?: string;
	accessibilityLabel?: string;
};
