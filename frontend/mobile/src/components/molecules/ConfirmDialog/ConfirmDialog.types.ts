import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ConfirmDialogTone = 'primary' | 'danger';

export type ConfirmDialogProps = {
	visible: boolean;
	title: string;
	description: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
	tone?: ConfirmDialogTone;
	icon?: ReactNode;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
};
