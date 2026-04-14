import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './OrderTrackingTimeline.styles';
import type { OrderTrackingTimelineProps } from './OrderTrackingTimeline.types';

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
	steps,
	containerStyle,
	renderStepExtra,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			{steps.map((step, index) => {
				const isLast = index === steps.length - 1;
				const isPending = !step.isDone && !step.isCurrent;
				const dotStyle = step.isDone
					? styles.dotDone
					: step.isCurrent
						? styles.dotCurrent
						: styles.dotPending;
				const connectorStyle = step.isDone
					? styles.connectorDone
					: step.isCurrent
						? styles.connectorCurrent
						: styles.connectorUpcoming;
				const iconColor = step.isDone
					? lightColors.neutral100
					: step.isCurrent
						? lightColors.primary
						: lightColors.text.secondary;

				return (
					<View key={step.id} style={[styles.stepRow, isLast ? styles.stepRowLast : null]}>
						<View style={styles.stepIndicatorColumn}>
							<View style={[styles.dotBase, dotStyle]}>
								{step.isCurrent ? <View style={styles.dotCurrentInner} /> : null}
								{step.isCurrent || isPending ? null : (
									<Icon name={step.iconName ?? 'clock'} size={14} color={iconColor} />
								)}
							</View>
							{isLast ? null : <View style={[styles.connector, connectorStyle]} />}
						</View>

						<View style={styles.stepContent}>
							<Text variant='body' style={[{ fontWeight: '700' }, isPending ? styles.pendingTitle : null]}>
								{step.label}
							</Text>
							<Text variant='small' color='secondary' style={isPending ? styles.pendingTime : null}>
								{step.time}
							</Text>
							{step.description ? (
								<Text variant='small' color='secondary' style={styles.stepDescription}>
									{step.description}
								</Text>
							) : null}
							{renderStepExtra ? renderStepExtra(step) : null}
						</View>
					</View>
				);
			})}
		</View>
	);
};
