export const spacing = {
	s0: 4,
	s1: 8,
	s2: 12,
	s3: 16,
	s4: 24,
	s5: 32,
	s6: 40,
} as const;

export type SpacingKey = keyof typeof spacing;

export const s = (key: SpacingKey): number => spacing[key];

export const pxToRem = (px: number, base: number = 16): string => {
	if (base <= 0) {
		throw new Error('pxToRem base must be greater than 0.');
	}

	const rem = px / base;
	const rounded = Math.round(rem * 10000) / 10000;
	return String(rounded) + 'rem';
};
