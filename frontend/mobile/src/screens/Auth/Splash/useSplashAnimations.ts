import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

import type { SplashAnimationState } from './SplashScreen.types';

export const useSplashAnimations = (): SplashAnimationState => {
	const { height: screenHeight } = Dimensions.get('window');

	const spinValue = useRef(new Animated.Value(0)).current;
	const progress = useRef(new Animated.Value(0)).current;
	const [isInteractive, setIsInteractive] = useState(false);

	useEffect(() => {
		const spinAnimation = Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 900,
				easing: Easing.linear,
				useNativeDriver: true,
				isInteraction: false,
			}),
		);

		spinAnimation.start();

		const timeline = Animated.sequence([
			Animated.delay(1500),
			Animated.timing(progress, {
				toValue: 1,
				duration: 1250,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
		]);

		timeline.start(({ finished }) => {
			if (finished) {
				setIsInteractive(true);
			}
		});

		return () => {
			spinAnimation.stop();
			progress.stopAnimation();
			spinValue.stopAnimation();
		};
	}, [progress, spinValue]);

	const spinRotate = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	const imageTranslateY = progress.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -screenHeight * 0.45],
	});

	const imageScale = progress.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0.93],
	});

	const imageParallaxX = progress.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -20],
	});

	const loaderOpacity = progress.interpolate({
		inputRange: [0, 0.45, 0.7, 1],
		outputRange: [1, 1, 0, 0],
	});

	const loaderScale = progress.interpolate({
		inputRange: [0, 0.55, 1],
		outputRange: [1, 1.08, 0.9],
	});

	const gradientOpacity = progress.interpolate({
		inputRange: [0, 0.85, 0.95, 1],
		outputRange: [0, 0, 0.55, 1],
	});

	const contentOpacity = progress.interpolate({
		inputRange: [0, 0.56, 0.78, 1],
		outputRange: [0, 0, 0.72, 1],
	});

	const contentTranslateY = progress.interpolate({
		inputRange: [0, 1],
		outputRange: [56, 0],
	});

	const isCtaDisabled = useMemo(() => !isInteractive, [isInteractive]);

	return {
		contentOpacity,
		contentTranslateY,
		gradientOpacity,
		imageParallaxX,
		imageScale,
		imageTranslateY,
		isCtaDisabled,
		loaderOpacity,
		loaderScale,
		spinRotate,
	};
};
