import React from 'react';
import { Animated, View } from 'react-native';

import { Button, Icon, Text } from '../../../components';
import { lightColors } from '../../../styles/colors';
import { styles } from './SplashScreen.styles';

interface SplashCtaPanelProps {
	contentOpacity: Animated.AnimatedInterpolation<number>;
	contentTranslateY: Animated.AnimatedInterpolation<number>;
	isCtaDisabled: boolean;
	onLoginPress?: () => void;
	onSignupPress?: () => void;
}

export const SplashCtaPanel: React.FC<SplashCtaPanelProps> = ({
	contentOpacity,
	contentTranslateY,
	isCtaDisabled,
	onLoginPress,
	onSignupPress,
}) => {
	return (
		<Animated.View
			style={[
				styles.content,
				{
					opacity: contentOpacity,
					transform: [{ translateY: contentTranslateY }],
				},
			]}
		>
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
				textStyle={styles.primaryButtonText}
			/>

			<Button
				title="Creer un compte"
				onPress={onSignupPress}
				variant="secondary"
				disabled={isCtaDisabled}
				containerStyle={styles.secondaryButton}
				accessibilityLabel="Creer un compte"
				textStyle={styles.secondaryButtonText}
			/>
		</Animated.View>
	);
};
