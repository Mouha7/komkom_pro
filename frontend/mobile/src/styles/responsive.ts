export const windowBreakpoints = {
	compact: 600,
	medium: 840,
} as const;

export type WindowSizeClass = 'compact' | 'medium' | 'expanded';

export const getWindowSizeClass = (width: number): WindowSizeClass => {
	if (width < windowBreakpoints.compact) {
		return 'compact';
	}

	if (width < windowBreakpoints.medium) {
		return 'medium';
	}

	return 'expanded';
};

export const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};
