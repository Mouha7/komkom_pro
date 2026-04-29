import React from 'react';
import { ScrollView, View } from 'react-native';

import { EmptyState, ErrorState, Icon, Text } from '../../atoms';
import { NotificationCard } from '../../molecules';
import type { NotificationModel } from '../../../mocks/notifications';
import { styles } from './NotificationsList.styles';
import type { NotificationsListProps } from './NotificationsList.types';

export const NotificationsList: React.FC<NotificationsListProps> = ({
	notifications,
	isLoading = false,
	errorMessage,
	onRetry,
	onPressNotification,
	onPressAction,
	processingNotificationId,
	testID,
}) => {
	if (errorMessage) {
		return (
			<View style={styles.stateContainer} testID={testID}>
				<ErrorState
					title='Notifications indisponibles'
					description={errorMessage}
					actionLabel={onRetry ? 'Reessayer' : undefined}
					onActionPress={onRetry}
				/>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.loadingContainer} testID={testID}>
				<Text variant='bodyLarge' color='secondary'>
					Chargement des notifications...
				</Text>
			</View>
		);
	}

	if (notifications.length === 0) {
		return (
			<View style={styles.stateContainer} testID={testID}>
				<EmptyState
					title='Aucune notification'
					description='Les nouvelles alertes et evenements importants apparaitront ici.'
					actionLabel={onRetry ? 'Actualiser' : undefined}
					onActionPress={onRetry}
					icon={<Icon name='bell' size={42} color='#6B7280' />}
				/>
			</View>
		);
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			showsVerticalScrollIndicator={false}
			testID={testID}
		>
			<View style={styles.listWrap}>
				{notifications.map((notification: NotificationModel) => (
					<NotificationCard
						key={notification.id}
						notification={notification}
						onPress={onPressNotification}
						onActionPress={onPressAction}
						disabled={processingNotificationId === notification.id}
					/>
				))}
			</View>
		</ScrollView>
	);
};