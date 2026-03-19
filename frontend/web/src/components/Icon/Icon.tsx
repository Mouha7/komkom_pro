import {
	CircleAlert,
	Check,
	House,
	Info,
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
} from 'lucide-react';

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
};

export const Icon = ({
	name,
	size = 20,
	color = 'currentColor',
	strokeWidth = 2,
	className,
	ariaLabel,
}: IconProps) => {
	const SvgIcon = ICON_MAP[name];

	return (
		<SvgIcon
			size={size}
			color={color}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden={ariaLabel ? undefined : true}
			aria-label={ariaLabel}
		/>
	);
};
