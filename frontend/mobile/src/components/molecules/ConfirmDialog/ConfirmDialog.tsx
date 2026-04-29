import React from 'react';
import { Modal, Pressable, View } from 'react-native';

import { colorTokens } from '../../../styles/colors';
import { Button, Icon, Text } from '../../atoms';
import { styles } from './ConfirmDialog.styles';
import type { ConfirmDialogProps } from './ConfirmDialog.types';

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	visible,
	title,
	description,
	confirmLabel,
	cancelLabel = 'Annuler',
	onConfirm,
	onCancel,
	tone = 'primary',
	icon,
	containerStyle,
	testID,
}) => {
	const isDanger = tone === 'danger';

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
			presentationStyle="overFullScreen"
			statusBarTranslucent
			navigationBarTranslucent
			testID={testID}
		>
			<Pressable style={styles.overlay} onPress={onCancel} accessibilityRole="button">
				<Pressable style={[styles.container, containerStyle]} onPress={() => undefined}>
					<View style={styles.header}>
						<View
							style={[styles.iconWrap, isDanger ? styles.iconWrapDanger : styles.iconWrapPrimary]}
						>
							{icon ?? (
								<Icon
									name={isDanger ? 'alert' : 'info'}
									size={24}
									color={isDanger ? colorTokens.danger : colorTokens.info}
								/>
							)}
						</View>
						<Text variant="h1">{title}</Text>
					</View>
					<View style={styles.body}>
						<Text variant="bodyLarge" color="secondary">
							{description}
						</Text>
					</View>
					<View style={styles.actions}>
						<Button
							title={cancelLabel}
							variant="secondary"
							textStyle={styles.cancelLabel}
							onPress={onCancel}
							containerStyle={styles.actionButton}
						/>
						<Button
							title={confirmLabel}
							onPress={onConfirm}
							containerStyle={[
								styles.actionButton,
								isDanger ? styles.confirmDanger : undefined,
							]}
							textStyle={isDanger ? styles.confirmLabelDanger : undefined}
						/>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};
