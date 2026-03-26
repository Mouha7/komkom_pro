import type { RefObject } from 'react';
import type {
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
} from 'react-native';

export interface ScrollToTopButtonProps {
	visible: boolean;
	onPress: () => void;
	accessibilityLabel?: string;
	testID?: string;
}

export interface UseScrollToTopButtonOptions {
	visibilityThreshold?: number;
	onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
	initialVisible?: boolean;
}

export interface UseScrollToTopButtonResult {
	scrollViewRef: RefObject<ScrollView>;
	isScrollTopVisible: boolean;
	handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
	handleScrollToTop: () => void;
	resetScrollTopVisibility: () => void;
}
