import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { getWindowSizeClass } from '../styles/responsive';

export const useResponsive = () => {
	const { width, height, fontScale, scale } = useWindowDimensions();

	return useMemo(() => {
		const windowClass = getWindowSizeClass(width);
		const isCompact = windowClass === 'compact';
		const isMedium = windowClass === 'medium';
		const isExpanded = windowClass === 'expanded';

		return {
			width,
			height,
			fontScale,
			scale,
			windowClass,
			isCompact,
			isMedium,
			isExpanded,
			isCompactPhone: width < 360,
		};
	}, [fontScale, height, scale, width]);
};
