import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconOnlyButton } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './ScrollToTopButton.styles';
import type { ScrollToTopButtonProps } from './ScrollToTopButton.types';

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
	visible,
	onPress,
	accessibilityLabel = 'Retour en haut',
	testID,
}) => {
	const insets = useSafeAreaInsets();
	const visibilityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(visibilityAnim, {
			toValue: visible ? 1 : 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [visible, visibilityAnim]);

	return (
		<Animated.View
			pointerEvents={visible ? 'auto' : 'none'}
			style={[
				styles.container,
				{
					bottom: Math.max(insets.bottom + 12, 24),
					opacity: visibilityAnim,
					transform: [
						{
							translateY: visibilityAnim.interpolate({
								inputRange: [0, 1],
								outputRange: [8, 0],
							}),
						},
					],
				},
			]}
		>
			<IconOnlyButton
				iconName='chevronUp'
				onPress={onPress}
				iconColor={lightColors.primary}
				accessibilityLabel={accessibilityLabel}
				testID={testID}
			/>
		</Animated.View>
	);
};
