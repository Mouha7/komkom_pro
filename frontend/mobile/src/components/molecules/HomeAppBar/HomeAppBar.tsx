import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { styles } from './HomeAppBar.styles';
import type { HomeAppBarProps } from './HomeAppBar.types';

const formatBadgeCount = (count: number): string => {
	if (count > 99) {
		return '99+';
	}

	return String(count);
};

export const HomeAppBar: React.FC<HomeAppBarProps> = ({
	userName,
	storeName,
	avatarUri,
	notificationCount = 0,
	cartCount = 0,
	onPressProfile,
	onPressNotifications,
	onPressCart,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);
	const initials = userName
		.trim()
		.split(/\s+/)
		.map((part) => part.charAt(0).toUpperCase())
		.join('')
		.slice(0, 2);

	return (
		<View style={[styles.container, { paddingTop: safeTop }]}>
			<View style={styles.content}>
				<View style={styles.leftSection}>
					<Pressable
						onPress={onPressProfile}
						style={({ pressed }) => [
							styles.avatarButton,
							pressed && styles.actionButtonPressed,
						]}
						accessibilityRole='button'
						accessibilityLabel='Ouvrir le profil'
					>
						{avatarUri ? (
							<Image
								source={{ uri: avatarUri }}
								style={styles.avatarImage}
								resizeMode='cover'
							/>
						) : (
							<Text
								variant='h2'
								style={styles.avatarFallbackText}
								textColorOverride={lightColors.primaryDark}
							>
								{initials.length > 0 ? initials : 'KK'}
							</Text>
						)}
					</Pressable>

					<View style={styles.identityBlock}>
						<Text
							variant='h2'
							maxLines={1}
							style={styles.userName}
							textColorOverride={lightColors.text.primary}
						>
							Bonjour, {userName}
						</Text>
						<View style={styles.storeRow}>
							<Icon
								name='building2'
								size={14}
								color={lightColors.text.secondary as string}
							/>
							<Text
								variant='bodyLarge'
								maxLines={1}
								style={styles.storeName}
								textColorOverride={lightColors.text.secondary}
							>
								{storeName}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.rightSection}>
					<Pressable
						onPress={onPressNotifications}
						style={({ pressed }) => [
							styles.actionButton,
							pressed && styles.actionButtonPressed,
						]}
						accessibilityRole='button'
						accessibilityLabel='Ouvrir les notifications'
					>
						<Icon name='bell' size={24} color={lightColors.text.primary as string} />
						{notificationCount > 0 ? (
							<View style={styles.badge}>
								<Text variant='small' style={styles.badgeText} textColorOverride='#FFFFFF'>
									{formatBadgeCount(notificationCount)}
								</Text>
							</View>
						) : null}
					</Pressable>

					<Pressable
						onPress={onPressCart}
						style={({ pressed }) => [
							styles.actionButton,
							pressed && styles.actionButtonPressed,
						]}
						accessibilityRole='button'
						accessibilityLabel='Ouvrir le panier'
					>
						<Icon name='cart' size={24} color={lightColors.text.primary as string} />
						{cartCount > 0 ? (
							<View style={styles.badge}>
								<Text variant='small' style={styles.badgeText} textColorOverride='#FFFFFF'>
									{formatBadgeCount(cartCount)}
								</Text>
							</View>
						) : null}
					</Pressable>
				</View>
			</View>
		</View>
	);
};
