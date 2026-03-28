import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '../../atoms';
import { spacing } from '../../../styles/spacing';
import { APP_BAR_ACTION_SIZE, styles } from './AppBar.styles';
import type { AppBarAction, AppBarProps } from './AppBar.types';

const renderActionButton = (action: AppBarAction): React.ReactElement => {
	return (
		<Pressable
			key={action.id}
			onPress={action.onPress}
			disabled={action.disabled}
			style={({ pressed }) => [styles.sideButton, pressed && styles.sideButtonPressed]}
			accessibilityRole="button"
			accessibilityLabel={action.accessibilityLabel}
			testID={action.testID}
		>
			<Icon name={action.iconName} size={24} color="#0F1724" />
		</Pressable>
	);
};

export const AppBar: React.FC<AppBarProps> = ({
	title,
	leftAction,
	leftIconName,
	onPressLeft,
	leftAccessibilityLabel = 'Retour',
	rightActions,
	rightActionSlot,
	titleAlign = 'center',
	containerStyle,
	contentStyle,
	testID,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);

	return (
		<View style={[styles.container, { paddingTop: safeTop }, containerStyle]} testID={testID}>
			<View style={[styles.content, contentStyle]}>
				{leftAction ? (
					<View style={styles.sideSlot}>{leftAction}</View>
				) : leftIconName && onPressLeft ? (
					<Pressable
						onPress={onPressLeft}
						style={({ pressed }) => [styles.sideButton, pressed && styles.sideButtonPressed]}
						accessibilityRole="button"
						accessibilityLabel={leftAccessibilityLabel}
					>
						<Icon name={leftIconName} size={24} color="#0F1724" />
					</Pressable>
				) : (
					<View style={styles.sideSlot} />
				)}

				<View style={styles.titleWrap}>
					<Text variant="h2" style={titleAlign === 'left' ? styles.titleLeft : styles.titleCenter}>
						{title}
					</Text>
				</View>

				{rightActionSlot ? (
					<View style={[styles.rightActions, { minWidth: APP_BAR_ACTION_SIZE }]}>{rightActionSlot}</View>
				) : rightActions && rightActions.length > 0 ? (
					<View style={styles.rightActions}>{rightActions.map(renderActionButton)}</View>
				) : (
					<View style={styles.sideSlot} />
				)}
			</View>
		</View>
	);
};
