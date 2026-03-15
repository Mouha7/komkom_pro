export type HexColor = string;
export type RgbaColor = string;
export type ColorValue = HexColor | RgbaColor | 'transparent';

export type ColorTokenName =
	| 'primary'
	| 'primaryDark'
	| 'primaryLight'
	| 'neutral900'
	| 'neutral700'
	| 'neutral300'
	| 'neutral100'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info';

export type ColorTokens = Readonly<Record<ColorTokenName, HexColor>>;

export const colorTokens: ColorTokens = {
	primary: '#ED762F',
	primaryDark: '#C55A1F',
	primaryLight: '#F7E6D9',
	neutral900: '#0F1724',
	neutral700: '#374151',
	neutral300: '#D1D5DB',
	neutral100: '#F3F4F6',
	success: '#16A34A',
	danger: '#DC2626',
	warning: '#F59E0B',
	info: '#0EA5E9',
};

export type ThemeColors = Readonly<{
	primary: HexColor;
	primaryDark: HexColor;
	primaryLight: HexColor;
	neutral900: HexColor;
	neutral700: HexColor;
	neutral300: HexColor;
	neutral100: HexColor;
	success: HexColor;
	danger: HexColor;
	warning: HexColor;
	info: HexColor;
	transparent: 'transparent';
	background: Readonly<{
		default: ColorValue;
		subtle: ColorValue;
		inverse: ColorValue;
	}>;
	surface: Readonly<{
		default: ColorValue;
		raised: ColorValue;
		interactive: ColorValue;
	}>;
	text: Readonly<{
		primary: ColorValue;
		secondary: ColorValue;
		inverse: ColorValue;
		onPrimary: ColorValue;
		success: ColorValue;
		danger: ColorValue;
		warning: ColorValue;
		info: ColorValue;
	}>;
	border: Readonly<{
		default: ColorValue;
		subtle: ColorValue;
		strong: ColorValue;
		focus: ColorValue;
	}>;
}>;

const clampOpacity = (opacity: number): number => {
	if (Number.isNaN(opacity)) {
		return 1;
	}
	return Math.min(1, Math.max(0, opacity));
};

const normalizeHex = (hex: string): string => {
	const trimmed = hex.trim().replace(/^#/, '');
	if (trimmed.length === 3) {
		return trimmed
			.split('')
			.map((char) => char + char)
			.join('');
	}
	return trimmed;
};

export const withOpacity = (hex: HexColor, opacity: number): RgbaColor => {
	const normalized = normalizeHex(hex);
	if (!/^[\da-fA-F]{6}$/.test(normalized)) {
		throw new Error('withOpacity expects a 3 or 6 digit hex color.');
	}

	const alpha = clampOpacity(opacity);
	const r = parseInt(normalized.slice(0, 2), 16);
	const g = parseInt(normalized.slice(2, 4), 16);
	const b = parseInt(normalized.slice(4, 6), 16);

	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

export const lightColors: ThemeColors = {
	...colorTokens,
	transparent: 'transparent',
	background: {
		default: colorTokens.neutral100,
		subtle: withOpacity(colorTokens.neutral700, 0.06),
		inverse: colorTokens.neutral900,
	},
	surface: {
		default: '#FFFFFF',
		raised: withOpacity(colorTokens.neutral100, 0.92),
		interactive: colorTokens.primaryLight,
	},
	text: {
		primary: colorTokens.neutral900,
		secondary: colorTokens.neutral700,
		inverse: colorTokens.neutral100,
		onPrimary: '#FFFFFF',
		success: colorTokens.success,
		danger: colorTokens.danger,
		warning: colorTokens.warning,
		info: colorTokens.info,
	},
	border: {
		default: colorTokens.neutral300,
		subtle: withOpacity(colorTokens.neutral700, 0.18),
		strong: colorTokens.neutral700,
		focus: withOpacity(colorTokens.primary, 0.55),
	},
};

export const darkColors: ThemeColors = {
	...colorTokens,
	transparent: 'transparent',
	background: {
		default: colorTokens.neutral900,
		subtle: withOpacity(colorTokens.neutral100, 0.08),
		inverse: colorTokens.neutral100,
	},
	surface: {
		default: withOpacity(colorTokens.neutral900, 0.88),
		raised: withOpacity(colorTokens.neutral700, 0.35),
		interactive: withOpacity(colorTokens.primary, 0.2),
	},
	text: {
		primary: colorTokens.neutral100,
		secondary: withOpacity(colorTokens.neutral100, 0.78),
		inverse: colorTokens.neutral900,
		onPrimary: '#FFFFFF',
		success: colorTokens.success,
		danger: colorTokens.danger,
		warning: colorTokens.warning,
		info: colorTokens.info,
	},
	border: {
		default: withOpacity(colorTokens.neutral100, 0.24),
		subtle: withOpacity(colorTokens.neutral100, 0.12),
		strong: withOpacity(colorTokens.neutral100, 0.4),
		focus: withOpacity(colorTokens.primary, 0.7),
	},
};
