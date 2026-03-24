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
	| 'lock'
	| 'eye'
	| 'eyeOff'
	| 'shield'
	| 'shieldCheck'
	| 'building2'
	| 'phone'
	| 'mail'
	| 'mapPin'
	| 'chevronUp';

export type IconProps = {
	name: CommonIconName;
	size?: number;
	color?: string;
	strokeWidth?: number;
	testID?: string;
	accessibilityLabel?: string;
};
