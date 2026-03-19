import React from 'react';
import { View } from 'react-native';

import { Button } from '../Button';
import { Text } from '../Text';
import { styles } from './EmptyState.styles';
import type { EmptyStateProps } from './EmptyState.types';

const defaultIcon = (
	<Text variant="h1" color="secondary">
		[]
	</Text>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
	title,
	description,
	actionLabel,
	onActionPress,
	icon,
	containerStyle,
	testID,
}) => {
	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<View style={styles.iconWrap}>{icon ?? defaultIcon}</View>
			<Text variant="h2" style={styles.title}>
				{title}
			</Text>
			<Text variant="bodyLarge" color="secondary" style={styles.description}>
				{description}
			</Text>
			{actionLabel ? (
				<Button
					title={actionLabel}
					onPress={onActionPress}
					containerStyle={styles.action}
				/>
			) : null}
		</View>
	);
};
