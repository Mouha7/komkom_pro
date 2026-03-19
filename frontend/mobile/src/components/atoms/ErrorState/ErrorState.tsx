import React from 'react';
import { View } from 'react-native';

import { Button } from '../Button';
import { Text } from '../Text';
import { styles } from './ErrorState.styles';
import type { ErrorStateProps } from './ErrorState.types';

const defaultIcon = (
	<Text variant="h1" color="danger">
		X
	</Text>
);

export const ErrorState: React.FC<ErrorStateProps> = ({
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
			<Text variant="h2" color="danger" style={styles.title}>
				{title}
			</Text>
			<Text variant="bodyLarge" color="danger" style={styles.description}>
				{description}
			</Text>
			{actionLabel ? (
				<Button
					title={actionLabel}
					onPress={onActionPress}
					containerStyle={styles.action}
					textStyle={styles.actionText}
				/>
			) : null}
		</View>
	);
};
