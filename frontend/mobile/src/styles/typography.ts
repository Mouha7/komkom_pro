import type { TextStyle } from 'react-native';

export const fontSizes = {
	h1: 24,
	h2: 18,
	h3: 16,
	bodyLarge: 16,
	body: 14,
	small: 12,
	button: 14,
	overline: 12,
} as const;

export const lineHeights = {
	h1: 30,
	h2: 24,
	h3: 22,
	bodyLarge: 24,
	body: 20,
	small: 16,
	button: 20,
	overline: 16,
} as const;

export const fontWeights = {
	regular: '400',
	medium: '500',
	semibold: '600',
	bold: '700',
} as const;

export type FontWeightToken = typeof fontWeights[keyof typeof fontWeights];
export type TypographyVariantName = keyof typeof fontSizes;

type TypographyVariant = Readonly<
	Pick<
		TextStyle,
		'fontFamily' | 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing' | 'textTransform'
	>
>;

const interFamily = 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';

export const typography: Readonly<Record<TypographyVariantName, TypographyVariant>> = {
	h1: {
		fontFamily: interFamily,
		fontSize: fontSizes.h1,
		lineHeight: lineHeights.h1,
		fontWeight: fontWeights.bold,
	},
	h2: {
		fontFamily: interFamily,
		fontSize: fontSizes.h2,
		lineHeight: lineHeights.h2,
		fontWeight: fontWeights.semibold,
	},
	h3: {
		fontFamily: interFamily,
		fontSize: fontSizes.h3,
		lineHeight: lineHeights.h3,
		fontWeight: fontWeights.semibold,
	},
	bodyLarge: {
		fontFamily: interFamily,
		fontSize: fontSizes.bodyLarge,
		lineHeight: lineHeights.bodyLarge,
		fontWeight: fontWeights.regular,
	},
	body: {
		fontFamily: interFamily,
		fontSize: fontSizes.body,
		lineHeight: lineHeights.body,
		fontWeight: fontWeights.regular,
	},
	small: {
		fontFamily: interFamily,
		fontSize: fontSizes.small,
		lineHeight: lineHeights.small,
		fontWeight: fontWeights.regular,
	},
	button: {
		fontFamily: interFamily,
		fontSize: fontSizes.button,
		lineHeight: lineHeights.button,
		fontWeight: fontWeights.semibold,
	},
	overline: {
		fontFamily: interFamily,
		fontSize: fontSizes.overline,
		lineHeight: lineHeights.overline,
		fontWeight: fontWeights.medium,
		letterSpacing: 0.8,
		textTransform: 'uppercase',
	},
};
