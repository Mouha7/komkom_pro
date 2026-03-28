import type { Animated } from 'react-native';

export type SplashScreenProps = {
	onLoginPress?: () => void;
	onSignupPress?: () => void;
	onDevBypassPress?: () => void;
};

export interface SplashAnimationState {
	contentOpacity: Animated.AnimatedInterpolation<number>;
	contentTranslateY: Animated.AnimatedInterpolation<number>;
	gradientOpacity: Animated.AnimatedInterpolation<number>;
	imageParallaxX: Animated.AnimatedInterpolation<number>;
	imageScale: Animated.AnimatedInterpolation<number>;
	imageTranslateY: Animated.AnimatedInterpolation<number>;
	isCtaDisabled: boolean;
	loaderOpacity: Animated.AnimatedInterpolation<number>;
	loaderScale: Animated.AnimatedInterpolation<number>;
	spinRotate: Animated.AnimatedInterpolation<string | number>;
}
