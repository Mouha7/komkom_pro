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
	| 'arrowRight'
	| 'trash'
	| 'hammer'
	| 'lock'
	| 'eye'
	| 'eyeOff'
	| 'shield'
	| 'shieldCheck'
	| 'building2'
	| 'droplet'
	| 'zap'
	| 'phone'
	| 'mail'
	| 'mapPin'
	| 'chevronUp'
	| 'chevronDown'
	| 'bell'
	| 'grid'
	| 'list'
	| 'sliderFilter'
	| 'share'
	| 'heart'
	| 'truck'
	;

export type IconProps = {
	name: CommonIconName;
	size?: number;
	color?: string;
	strokeWidth?: number;
	testID?: string;
	accessibilityLabel?: string;
};
