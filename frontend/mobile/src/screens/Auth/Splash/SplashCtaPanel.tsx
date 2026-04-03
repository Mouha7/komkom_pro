import React from 'react';
import { Animated, View } from 'react-native';

import { Button, Icon, Text } from '../../../components';
import { useResponsive } from '../../../hooks/useResponsive';
import { lightColors } from '../../../styles/colors';
import { clamp } from '../../../styles/responsive';
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
	const { width, isExpanded } = useResponsive();
	const titleMaxWidth = isExpanded ? clamp(width * 0.42, 320, 520) : clamp(width * 0.84, 280, 360);
	const subtitleMaxWidth = isExpanded ? clamp(width * 0.46, 340, 560) : clamp(width * 0.86, 300, 390);

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

			<Text variant="h1" align="center" style={[styles.title, { maxWidth: titleMaxWidth }]} textColorOverride={lightColors.text.primary}>
				L'approvisionnement B2B simplifie
			</Text>

			<Text variant="bodyLarge" align="center" style={[styles.subtitle, { maxWidth: subtitleMaxWidth }]} textColorOverride={lightColors.text.secondary}>
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
