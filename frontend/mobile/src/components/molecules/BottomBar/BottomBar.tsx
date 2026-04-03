import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '../../atoms';
import { colorTokens } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { styles } from './BottomBar.styles';
import type { BottomBarProps } from './BottomBar.types';

export const BottomBar: React.FC<BottomBarProps> = ({
	actions,
	activeActionId,
	containerStyle,
	testID,
}) => {
	const insets = useSafeAreaInsets();
	const safeBottom = Math.max(insets.bottom, spacing.s1);

	return (
		<View style={[styles.container, { paddingBottom: safeBottom }, containerStyle]} testID={testID}>
			<View style={styles.actionsRow}>
				{actions.map((action) => {
					const isActive = action.id === activeActionId;
					const iconColor = isActive ? colorTokens.primary : colorTokens.neutral700;

					return (
						<Pressable
							key={action.id}
							onPress={action.onPress}
							disabled={action.disabled}
							style={({ pressed }) => [
								styles.actionButton,
								isActive && styles.actionButtonActive,
								pressed && styles.actionButtonPressed,
							]}
							accessibilityRole="button"
							accessibilityLabel={action.accessibilityLabel ?? action.label}
							testID={action.testID}
						>
							<Icon name={action.iconName} size={22} color={iconColor} />
							<Text variant="small" style={{ fontWeight: isActive ? '700' : '400' }} textColorOverride={iconColor} align="center">
								{action.label}
							</Text>
							{action.badge && action.badge > 0 ? (
								<View style={styles.badgeWrap}>
									<Text style={styles.badgeText}>{action.badge > 99 ? '99+' : String(action.badge)}</Text>
								</View>
							) : null}
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};
