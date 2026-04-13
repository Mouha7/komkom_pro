import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import type { EmployeeModel } from '../../../mocks/employees';
import { styles } from './EmployeeListItem.styles';
import type { EmployeeListItemProps } from './EmployeeListItem.types';

const getInitials = (fullName: string): string => {
	return fullName
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((namePart) => namePart.charAt(0).toUpperCase())
		.join('');
};

const getRoleLabel = (employee: EmployeeModel): string => {
	return employee.role === 'manager' ? 'Manager' : 'Vendeur';
};

const getStatusLabel = (employee: EmployeeModel): string => {
	return employee.status === 'active' ? 'Actif' : 'Invitation en attente';
};

export const EmployeeListItem: React.FC<EmployeeListItemProps> = ({
	employee,
	canToggleRole = true,
	canRevoke = true,
	onPressToggleRole,
	onPressRevoke,
}) => {
	const hasAvatar = Boolean(employee.avatarUrl && employee.avatarUrl.trim().length > 0);
	const showActions = canToggleRole || canRevoke;

	return (
		<View style={styles.container}>
			<View style={styles.topRow}>
				<View style={styles.avatar}>
					{hasAvatar ? (
						<Image
							source={{ uri: employee.avatarUrl }}
							style={styles.avatarImage}
							resizeMode='cover'
						/>
					) : (
						<Text variant='body' style={styles.avatarText} textColorOverride={lightColors.primaryDark}>
							{getInitials(employee.fullName)}
						</Text>
					)}
				</View>

				<View style={styles.infoWrap}>
					<Text variant='body' style={styles.name} textColorOverride={lightColors.text.primary}>
						{employee.fullName}
					</Text>
					<Text variant='small' style={styles.phone} textColorOverride={lightColors.text.secondary}>
						{employee.phone}
					</Text>
					<Text variant='small' style={styles.email} textColorOverride={lightColors.text.secondary}>
						{employee.email}
					</Text>
				</View>
			</View>

			<View style={styles.badgesWrap}>
				<View
					style={[
						styles.badge,
						employee.role === 'manager'
							? styles.badgeRoleManager
							: styles.badgeRoleSeller,
					]}
				>
					<Text
						variant='small'
                        style={styles.badgeText}
						textColorOverride={
							employee.role === 'manager'
								? lightColors.info
								: lightColors.text.secondary
						}
					>
						{getRoleLabel(employee)}
					</Text>
				</View>
				<View
					style={[
						styles.badge,
						employee.status === 'active'
							? styles.badgeStatusActive
							: styles.badgeStatusPending,
					]}
				>
					<Text
						variant='small'
                        style={styles.badgeText}
						textColorOverride={
							employee.status === 'active'
								? lightColors.success
								: lightColors.warning
						}
					>
						{getStatusLabel(employee)}
					</Text>
				</View>
			</View>

			{showActions ? (
				<View style={styles.actionsRow}>
					{canToggleRole ? (
						<Pressable
							onPress={() => onPressToggleRole(employee)}
							style={styles.actionButton}
							accessibilityRole='button'
							accessibilityLabel={`Changer le role de ${employee.fullName}`}
						>
							<Icon name='shield' size={16} color={lightColors.text.primary as string} />
							<Text variant='small' style={styles.actionText} textColorOverride={lightColors.text.primary}>
								Changer role
							</Text>
						</Pressable>
					) : null}

					{canRevoke ? (
						<Pressable
							onPress={() => onPressRevoke(employee)}
							style={[styles.actionButton, styles.actionButtonDanger]}
							accessibilityRole='button'
							accessibilityLabel={`Revoquer l acces de ${employee.fullName}`}
						>
							<Icon name='userX' size={16} color={lightColors.danger as string} />
							<Text variant='small' style={styles.actionText} textColorOverride={lightColors.danger}>
								Revoquer
							</Text>
						</Pressable>
					) : null}
				</View>
			) : null}
		</View>
	);
};
