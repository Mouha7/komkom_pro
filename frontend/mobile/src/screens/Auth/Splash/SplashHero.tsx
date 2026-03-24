import React from 'react';
import { Animated, Image, View, type ImageSourcePropType } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Icon, Text } from '../../../components';
import { lightColors, withOpacity } from '../../../styles/colors';
import { styles } from './SplashScreen.styles';

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface SplashHeroProps {
	contentOpacity: Animated.AnimatedInterpolation<number>;
	gradientOpacity: Animated.AnimatedInterpolation<number>;
	imageParallaxX: Animated.AnimatedInterpolation<number>;
	imageScale: Animated.AnimatedInterpolation<number>;
	imageSource: ImageSourcePropType;
	imageTranslateY: Animated.AnimatedInterpolation<number>;
	loaderOpacity: Animated.AnimatedInterpolation<number>;
	loaderScale: Animated.AnimatedInterpolation<number>;
	spinRotate: Animated.AnimatedInterpolation<string | number>;
}

export const SplashHero: React.FC<SplashHeroProps> = ({
	contentOpacity,
	gradientOpacity,
	imageParallaxX,
	imageScale,
	imageSource,
	imageTranslateY,
	loaderOpacity,
	loaderScale,
	spinRotate,
}) => {
	return (
		<>
			<AnimatedImage
				source={imageSource}
				resizeMode="cover"
				style={[
					styles.backgroundImage,
					{
						transform: [
							{ translateY: imageTranslateY },
							{ translateX: imageParallaxX },
							{ scale: imageScale },
						],
					},
				]}
			/>

			<Animated.View pointerEvents="none" style={[styles.loaderContainer, { opacity: loaderOpacity }]}>
				<Animated.View style={{ transform: [{ scale: loaderScale }] }}>
					<View style={styles.loaderIconWrap}>
						<Animated.View style={[styles.loaderIconSpin, { transform: [{ translateX: 1 }, { rotate: spinRotate }] }]}>
							<Icon name="hammer" size={34} color={lightColors.text.onPrimary} strokeWidth={2.25} />
						</Animated.View>
					</View>
					<Text variant="small" align="center" textColorOverride={withOpacity(lightColors.text.onPrimary, 0.9)}>
						Chargement en cours...
					</Text>
				</Animated.View>
			</Animated.View>

			<Animated.View pointerEvents="none" style={[styles.gradientLayer, { opacity: gradientOpacity }]}>
				<Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<Defs>
						<LinearGradient id="splashBottomGradient" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
							<Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
							<Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
						</LinearGradient>
					</Defs>
					<Rect x="0" y="0" width="100" height="40" fill="url(#splashBottomGradient)" />
				</Svg>
			</Animated.View>

			<Animated.View style={[styles.availabilityBadge, { opacity: contentOpacity }]}>
				<View style={styles.availabilityDot} />
				<Text variant="body" textColorOverride={lightColors.text.primary}>
					Disponible au Senegal
				</Text>
			</Animated.View>
		</>
	);
};
