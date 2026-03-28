import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

import type {
	UseScrollToTopButtonOptions,
	UseScrollToTopButtonResult,
} from './ScrollToTopButton.types';

const DEFAULT_VISIBILITY_THRESHOLD = 260;

export const useScrollToTopButton = (
	options?: UseScrollToTopButtonOptions,
): UseScrollToTopButtonResult => {
	const {
		visibilityThreshold = DEFAULT_VISIBILITY_THRESHOLD,
		onScroll,
		initialVisible = false,
	} = options ?? {};

	const scrollViewRef = useRef<ScrollView>(null);
	const [isScrollTopVisible, setIsScrollTopVisible] = useState(initialVisible);

	const handleScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>): void => {
			const currentOffsetY = event.nativeEvent.contentOffset.y;
			const shouldShowScrollTop = currentOffsetY >= visibilityThreshold;

			setIsScrollTopVisible((current) =>
				current === shouldShowScrollTop ? current : shouldShowScrollTop,
			);

			onScroll?.(event);
		},
		[onScroll, visibilityThreshold],
	);

	const handleScrollToTop = useCallback((): void => {
		scrollViewRef.current?.scrollTo({ y: 0, animated: true });
	}, []);

	const resetScrollTopVisibility = useCallback((): void => {
		setIsScrollTopVisible(false);
	}, []);

	return {
		scrollViewRef: scrollViewRef as RefObject<ScrollView>,
		isScrollTopVisible,
		handleScroll,
		handleScrollToTop,
		resetScrollTopVisibility,
	};
};
