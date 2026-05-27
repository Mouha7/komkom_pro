import React from 'react';
import { View, type ImageSourcePropType, Pressable } from 'react-native';
import { SplashCtaPanel } from './Splash/SplashCtaPanel';
import { SplashHero } from './Splash/SplashHero';
import { styles } from './Splash/SplashScreen.styles';
import type { SplashScreenProps } from './Splash/SplashScreen.types';
import { useSplashAnimations } from './Splash/useSplashAnimations';
import { Text } from '../../components';

const warehouseImage = require('../../../assets/warehouse_shelves.png') as ImageSourcePropType;

const isDemoBypassEnabled =
	__DEV__ || process.env.EXPO_PUBLIC_ENABLE_DEMO_BYPASS === 'true';

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
	onLoginPress, 
	onSignupPress,
	onDevBypassPress,
}) => {
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

			{isDemoBypassEnabled && onDevBypassPress && (
				<Pressable 
					onPress={onDevBypassPress}
					style={{ 
						position: 'absolute', 
						bottom: 16, 
						left: 16,
						paddingHorizontal: 12,
						paddingVertical: 6,
						backgroundColor: 'rgba(0,0,0,0.1)',
						borderRadius: 4,
					}}
					accessibilityLabel="Dev: Bypass to Home"
				>
					<Text variant="small" textColorOverride="rgba(0,0,0,0.5)">
						🔨 Dev Home
					</Text>
				</Pressable>
			)}
		</View>
	);
};

export default SplashScreen;
