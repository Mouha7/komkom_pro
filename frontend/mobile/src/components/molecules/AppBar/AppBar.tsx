import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconOnlyButton, Text } from '../../atoms';
import { spacing } from '../../../styles/spacing';
import { styles, APP_BAR_BUTTON_SIZE } from './AppBar.styles';
import type { AppBarAction, AppBarProps } from './AppBar.types';

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
					<View style={{ width: APP_BAR_BUTTON_SIZE, height: APP_BAR_BUTTON_SIZE }}>
						{leftAction}
					</View>
				) : leftIconName && onPressLeft ? (
					<IconOnlyButton
						iconName={leftIconName}
						onPress={onPressLeft}
						size={APP_BAR_BUTTON_SIZE}
						borderRadius={APP_BAR_BUTTON_SIZE / 2}
						iconSize={24}
						accessibilityLabel={leftAccessibilityLabel}
					/>
				) : (
					<View style={{ width: APP_BAR_BUTTON_SIZE, height: APP_BAR_BUTTON_SIZE }} />
				)}

				<View style={styles.titleWrap}>
					<Text
						variant='h1'
						style={styles.title}
						maxLines={1}
						align={titleAlign === 'left' ? 'left' : 'center'}
					>
						{title}
					</Text>
				</View>

				{rightActionSlot ? (
					<View style={{ width: APP_BAR_BUTTON_SIZE, height: APP_BAR_BUTTON_SIZE, alignItems: 'center', justifyContent: 'center' }}>
						{rightActionSlot}
					</View>
				) : rightActions && rightActions.length > 0 ? (
					<View style={{ flexDirection: 'row', alignItems: 'center', columnGap: spacing.s1 }}>
						{rightActions.map((action: AppBarAction) => (
							<IconOnlyButton
								key={action.id}
								iconName={action.iconName}
								onPress={action.onPress}
								disabled={action.disabled}
								size={APP_BAR_BUTTON_SIZE}
								borderRadius={APP_BAR_BUTTON_SIZE / 2}
								iconSize={24}
								accessibilityLabel={action.accessibilityLabel}
								testID={action.testID}
							/>
						))}
					</View>
				) : (
					<View style={{ width: APP_BAR_BUTTON_SIZE, height: APP_BAR_BUTTON_SIZE }} />
				)}
			</View>
		</View>
	);
};
