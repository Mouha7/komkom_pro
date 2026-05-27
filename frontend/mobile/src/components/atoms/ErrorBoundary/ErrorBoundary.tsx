import React from 'react';
import { View } from 'react-native';

import { Button } from '../Button';
import { Text } from '../Text';
import { lightColors } from '../../../styles/colors';
import { styles } from './ErrorBoundary.styles';
import type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary.types';

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, info: { componentStack?: string }): void {
		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.error('[ErrorBoundary]', error, info?.componentStack);
		}
		this.props.onError?.(error, info);
	}

	private handleReset = (): void => {
		this.setState({ error: null });
	};

	render(): React.ReactNode {
		const { error } = this.state;
		if (!error) {
			return this.props.children;
		}

		const title = this.props.fallbackTitle ?? 'Une erreur est survenue';
		const message =
			this.props.fallbackMessage ??
			'Cette section n\'a pas pu se charger. Vous pouvez réessayer ou revenir en arrière.';
		const resetLabel = this.props.resetLabel ?? 'Réessayer';

		return (
			<View style={styles.container}>
				<Text variant='h2' style={styles.title} textColorOverride={lightColors.text.primary}>
					{title}
				</Text>
				<Text
					variant='body'
					style={styles.message}
					textColorOverride={lightColors.text.secondary}
				>
					{message}
				</Text>
				{__DEV__ ? (
					<Text
						variant='small'
						style={styles.detail}
						textColorOverride={lightColors.danger}
					>
						{error.message}
					</Text>
				) : null}
				<Button
					title={resetLabel}
					variant='primary'
					onPress={this.handleReset}
					containerStyle={styles.button}
				/>
			</View>
		);
	}
}
