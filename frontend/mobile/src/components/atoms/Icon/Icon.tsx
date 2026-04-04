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
	Droplet,
	Zap,
	Phone,
	Mail,
	MapPin,
	ChevronUp,
	Bell,
	SlidersHorizontal,
	LayoutGrid,
	LayoutList,
	ChevronDown,
	Heart,
	Share2,
	Truck,
	ArrowRight,
	Map,
	Clock3,
	Smartphone,
	Headphones,
	FileText,
	Download,
	Printer
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
	arrowRight: ArrowRight,
	trash: Trash2,
	hammer: Hammer,
	lock: Lock,
	eye: Eye,
	eyeOff: EyeOff,
	shield: Shield,
	shieldCheck: ShieldCheck,
	building2: Building2,
	droplet: Droplet,
	zap: Zap,
	phone: Phone,
	mail: Mail,
	mapPin: MapPin,
	chevronUp: ChevronUp,
	chevronDown: ChevronDown,
	bell: Bell,
	grid: LayoutGrid,
	list: LayoutList,
	sliderFilter: SlidersHorizontal,
	share: Share2,
	heart: Heart,
	truck: Truck,
	map: Map,
	clock: Clock3,
	smartphone: Smartphone,
	headphones: Headphones,
	fileText: FileText,
	download: Download,
	printer: Printer,
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
