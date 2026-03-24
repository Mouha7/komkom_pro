import React from 'react';
import { View, type ImageSourcePropType } from 'react-native';
import { SplashCtaPanel } from './Splash/SplashCtaPanel';
import { SplashHero } from './Splash/SplashHero';
import { styles } from './Splash/SplashScreen.styles';
import type { SplashScreenProps } from './Splash/SplashScreen.types';
import { useSplashAnimations } from './Splash/useSplashAnimations';

const warehouseImage = require('../../../assets/warehouse_shelves.png') as ImageSourcePropType;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onLoginPress, onSignupPress }) => {
	const {
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
	} = useSplashAnimations();

	return (
		<View style={styles.root}>
			<SplashHero
				contentOpacity={contentOpacity}
				gradientOpacity={gradientOpacity}
				imageParallaxX={imageParallaxX}
				imageScale={imageScale}
				imageSource={warehouseImage}
				imageTranslateY={imageTranslateY}
				loaderOpacity={loaderOpacity}
				loaderScale={loaderScale}
				spinRotate={spinRotate}
			/>

			<SplashCtaPanel
				contentOpacity={contentOpacity}
				contentTranslateY={contentTranslateY}
				isCtaDisabled={isCtaDisabled}
				onLoginPress={onLoginPress}
				onSignupPress={onSignupPress}
			/>
		</View>
	);
};

export default SplashScreen;
