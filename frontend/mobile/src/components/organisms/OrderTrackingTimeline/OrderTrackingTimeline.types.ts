import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { CommonIconName } from '../../atoms';

export type OrderTrackingStepItem = {
	id: string;
	label: string;
	time: string;
	description?: string;
	iconName?: CommonIconName;
	isDone?: boolean;
	isCurrent?: boolean;
};

export type OrderTrackingTimelineProps = {
	steps: OrderTrackingStepItem[];
	containerStyle?: StyleProp<ViewStyle>;
	renderStepExtra?: (step: OrderTrackingStepItem) => ReactNode;
};
