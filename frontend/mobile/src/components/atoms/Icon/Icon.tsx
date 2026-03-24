import React from 'react';
import {
	CircleAlert,
	Check,
	House,
	Info,
	Hammer,
	Minus,
	Package,
	Plus,
	Search,
	Settings,
	ShoppingCart,
	type LucideIcon,
	User,
	X,
	WifiOff,
	ArrowLeft,
	Trash2,
	Lock,
	Eye,
	EyeOff,
	Shield,
	ShieldCheck,
	Building2,
	Phone,
	Mail,
	MapPin,
	ChevronUp,
} from 'lucide-react-native';

import type { CommonIconName, IconProps } from './Icon.types';

const ICON_MAP: Record<CommonIconName, LucideIcon> = {
	home: House,
	cart: ShoppingCart,
	package: Package,
	user: User,
	settings: Settings,
	search: Search,
	plus: Plus,
	minus: Minus,
	close: X,
	check: Check,
	alert: CircleAlert,
	info: Info,
	wifiOff: WifiOff,
	arrowLeft: ArrowLeft,
	trash: Trash2,
	hammer: Hammer,
	lock: Lock,
	eye: Eye,
	eyeOff: EyeOff,
	shield: Shield,
	shieldCheck: ShieldCheck,
	building2: Building2,
	phone: Phone,
	mail: Mail,
	mapPin: MapPin,
	chevronUp: ChevronUp,
};

export const Icon: React.FC<IconProps> = ({
	name,
	size = 20,
	color = 'currentColor',
	strokeWidth = 2,
	testID,
	accessibilityLabel,
}) => {
	const SvgIcon = ICON_MAP[name];

	return (
		<SvgIcon
			size={size}
			color={color}
			strokeWidth={strokeWidth}
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			accessible={Boolean(accessibilityLabel)}
		/>
	);
};
