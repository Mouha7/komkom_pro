import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationToast } from '../components';
import { lightColors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import type { NotificationTone } from '../components';

export type ToastPayload = {
	tone?: NotificationTone;
	title: string;
	message: string;
	durationMs?: number;
	autoDismiss?: boolean;
	actionLabel?: string;
	onActionPress?: () => void;
	actionLabelA11y?: string;
	closeLabel?: string;
};

export type ToastContextValue = {
	showToast: (payload: ToastPayload) => void;
	hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

type ToastProviderProps = {
	children: React.ReactNode;
};

type ActiveToast = ToastPayload & {
	id: number;
	tone: NotificationTone;
	autoDismiss: boolean;
	durationMs: number;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
	const insets = useSafeAreaInsets();
	const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);

	const hideToast = useCallback((): void => {
		setActiveToast(null);
	}, []);

	const showToast = useCallback((payload: ToastPayload): void => {
		setActiveToast({
			id: Date.now(),
			tone: payload.tone ?? 'info',
			title: payload.title,
			message: payload.message,
			durationMs: payload.durationMs ?? 2500,
			autoDismiss: payload.autoDismiss ?? true,
			actionLabel: payload.actionLabel,
			actionLabelA11y: payload.actionLabelA11y,
			onActionPress: payload.onActionPress,
			closeLabel: payload.closeLabel,
		});
	}, []);

	useEffect(() => {
		if (!activeToast || !activeToast.autoDismiss) {
			return undefined;
		}

		const timer = setTimeout(() => {
			hideToast();
		}, activeToast.durationMs);

		return () => clearTimeout(timer);
	}, [activeToast, hideToast]);

	const value = useMemo<ToastContextValue>(
		() => ({
			showToast,
			hideToast,
		}),
		[hideToast, showToast],
	);

	return (
		<ToastContext.Provider value={value}>
			<View style={styles.root}>
				{children}
				{activeToast ? (
					<View
						style={[styles.toastOverlay, { top: insets.top + spacing.s2 }]}
						pointerEvents='box-none'
					>
						<NotificationToast
							tone={activeToast.tone}
							title={activeToast.title}
							message={activeToast.message}
							actionLabel={activeToast.actionLabel}
							actionLabelA11y={activeToast.actionLabelA11y}
							onActionPress={
								activeToast.onActionPress
									? () => {
										activeToast.onActionPress?.();
										hideToast();
									}
									: undefined
							}
							onClose={hideToast}
							closeLabel={activeToast.closeLabel}
							containerStyle={styles.toast}
						/>
					</View>
				) : null}
			</View>
		</ToastContext.Provider>
	);
};

export { ToastContext };

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	toastOverlay: {
		position: 'absolute',
		left: spacing.s3,
		right: spacing.s3,
		zIndex: 100,
		elevation: 100,
	},
	toast: {
		marginHorizontal: 0,
	},
});
