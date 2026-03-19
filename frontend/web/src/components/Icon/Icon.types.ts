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
    | 'wifiOff';

export type IconProps = {
	name: CommonIconName;
	size?: number;
	color?: string;
	strokeWidth?: number;
	className?: string;
	ariaLabel?: string;
};
