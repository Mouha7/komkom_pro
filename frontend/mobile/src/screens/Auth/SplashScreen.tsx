import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Animated,
	Dimensions,
	Easing,
	Image,
	StyleSheet,
	View,
	type ImageSourcePropType,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Button, Icon, Text } from '../../components';
import { lightColors, withOpacity } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type SplashScreenProps = {
	onLoginPress?: () => void;
	onSignupPress?: () => void;
};

const warehouseImage = require('../../../assets/warehouse_shelves.png') as ImageSourcePropType;

const AnimatedImage = Animated.createAnimatedComponent(Image);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onLoginPress, onSignupPress }) => {
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

	return (
		<View style={styles.root}>
			<AnimatedImage
				source={warehouseImage}
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
						<Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
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

			<Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}>
				<View style={styles.brandRow}>
					<View style={styles.brandIconBox}>
						<Icon name="hammer" size={20} color={lightColors.text.onPrimary} strokeWidth={2.2} />
					</View>
					<Text variant="h1" textColorOverride={lightColors.primary}>
						KomKom
					</Text>
				</View>

				<Text variant="h1" align="center" style={styles.title} textColorOverride={lightColors.text.primary}>
					L'approvisionnement B2B simplifie
				</Text>

				<Text variant="bodyLarge" align="center" style={styles.subtitle} textColorOverride={lightColors.text.secondary}>
					Commandez vos materiaux au meilleur prix et gerez les stocks de votre quincaillerie en un clic.
				</Text>

				<Button
					title="Se connecter"
					onPress={onLoginPress}
					disabled={isCtaDisabled}
					containerStyle={styles.primaryButton}
					accessibilityLabel="Se connecter"
					textStyle={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}
				/>

				<Button
					title="Creer un compte"
					onPress={onSignupPress}
					variant="secondary"
					disabled={isCtaDisabled}
					containerStyle={styles.secondaryButton}
					accessibilityLabel="Creer un compte"
					textStyle={{ color: '#0F1724', fontWeight: '700', fontSize: 15 }}
				/>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	backgroundImage: {
		...StyleSheet.absoluteFillObject,
		width: '110%',
		height: '100%',
	},
	loaderContainer: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: spacing.s2,
	},
	loaderIconWrap: {
		width: 92,
		height: 92,
		borderRadius: 46,
		backgroundColor: withOpacity('#0F1724', 0.34),
		borderWidth: 1,
		borderColor: withOpacity('#FFFFFF', 0.),
		alignItems: 'center',
		justifyContent: 'center',
	},
	gradientLayer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '80%',
	},
	content: {
		position: 'absolute',
		left: spacing.s4,
		right: spacing.s4,
		bottom: spacing.s11,
		alignItems: 'center',
	},
	availabilityBadge: {
		position: 'absolute',
		top: spacing.s8,
		right: spacing.s4,
		zIndex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		backgroundColor: withOpacity('#FFFFFF', 0.94),
		borderRadius: 18,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
	},
	availabilityDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: lightColors.success,
	},
	brandRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
		marginBottom: spacing.s2,
	},
	brandIconBox: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: lightColors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		maxWidth: 312,
	},
	subtitle: {
		maxWidth: 320,
		marginTop: spacing.s2,
	},
	primaryButton: {
		alignSelf: 'stretch',
		marginTop: spacing.s4,
		borderRadius: 8,
		minHeight: 50,
	},
	secondaryButton: {
		alignSelf: 'stretch',
		marginTop: spacing.s2,
		borderRadius: 8,
		minHeight: 50,
	},
});

export default SplashScreen;
