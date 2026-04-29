import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
	ConfirmDialog,
	Button,
	EmployeeListItem,
	EmployeeManagementAppBar,
	EmptyState,
	ErrorState,
	InviteEmployeeModal,
	SkeletonListItem,
	Text,
	Icon,
} from "../../components";
import { useEmployees } from "../../hooks/useEmployees";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import type {
	EmployeeModel,
	InviteEmployeePayload,
} from "../../mocks/employees";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { lightColors, withOpacity } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

type EmployeeManagementScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"EmployeeManagement"
>;

export const EmployeeManagementScreen: React.FC<
	EmployeeManagementScreenProps
> = ({ navigation }) => {
	const insets = useSafeAreaInsets();
	const { showToast } = useToast();
	const { user } = useAuth();
	const { profile, isLoading: isProfileLoading } = useProfile(user?.id);
	const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
	const [employeeToRevoke, setEmployeeToRevoke] =
		useState<EmployeeModel | null>(null);
	const [employeeToChangeRole, setEmployeeToChangeRole] =
		useState<EmployeeModel | null>(null);

	const {
		employees,
		filteredEmployees,
		searchQuery,
		isLoading,
		errorMessage,
		reload,
		setSearchQuery,
		canInviteEmployees,
		canChangeRole,
		canRevoke,
		inviteEmployee,
		changeEmployeeRole,
		revokeEmployee,
	} = useEmployees({
		storeId: profile?.id,
		ownerUserId: profile?.userId,
	});

	const employeesCountLabel = useMemo(() => {
		return `${String(filteredEmployees.length)} collaborateur${filteredEmployees.length > 1 ? "s" : ""}`;
	}, [filteredEmployees.length]);
	const stickyBarBottomPadding = Math.max(insets.bottom, spacing.s2);

	const handleInviteEmployee = async (
		payload: InviteEmployeePayload,
	): Promise<void> => {
		try {
			await inviteEmployee(payload);
			showToast({
				tone: "success",
				title: "Invitation envoyee",
				message: `Invitation envoyee a ${payload.fullName}.`,
			});
		} catch (error) {
			showToast({
				tone: "danger",
				title: "Invitation impossible",
				message:
					error instanceof Error
						? error.message
						: "Vous n avez pas les droits necessaires.",
			});
			throw error;
		}
	};

	const handleConfirmRoleChange = async (): Promise<void> => {
		if (!employeeToChangeRole) {
			return;
		}

		if (!canChangeRole(employeeToChangeRole)) {
			setEmployeeToChangeRole(null);
			showToast({
				tone: "info",
				title: "Action non autorisee",
				message: "Seul le proprietaire peut changer les roles.",
			});
			return;
		}

		const nextRole =
			employeeToChangeRole.role === "manager" ? "seller" : "manager";
		try {
			await changeEmployeeRole(employeeToChangeRole.id, nextRole);
			setEmployeeToChangeRole(null);
			showToast({
				tone: "success",
				title: "Role mis a jour",
				message: "Le role de cet employe a ete modifie.",
			});
		} catch (error) {
			setEmployeeToChangeRole(null);
			showToast({
				tone: "danger",
				title: "Mise a jour impossible",
				message:
					error instanceof Error
						? error.message
						: "Vous n avez pas les droits necessaires.",
			});
		}
	};

	const handleConfirmRevoke = async (): Promise<void> => {
		if (!employeeToRevoke) {
			return;
		}

		if (!canRevoke(employeeToRevoke)) {
			setEmployeeToRevoke(null);
			showToast({
				tone: "info",
				title: "Action non autorisee",
				message: "Vous ne pouvez pas revoquer cet employe.",
			});
			return;
		}

		try {
			await revokeEmployee(employeeToRevoke.id);
			showToast({
				tone: "success",
				title: "Acces revoque",
				message: `${employeeToRevoke.fullName} a ete retire de l equipe.`,
			});
			setEmployeeToRevoke(null);
		} catch (error) {
			setEmployeeToRevoke(null);
			showToast({
				tone: "danger",
				title: "Revocation impossible",
				message:
					error instanceof Error
						? error.message
						: "Vous n avez pas les droits necessaires.",
			});
		}
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
			<EmployeeManagementAppBar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onPressBack={() => navigation.goBack()}
			/>

			<View style={styles.content}>
				{isProfileLoading || isLoading ? (
					<View style={styles.stackGap}>
						<SkeletonListItem
							showAvatar
							lineWidths={[0.8, 0.6, 0.55]}
						/>
						<SkeletonListItem
							showAvatar
							lineWidths={[0.92, 0.7, 0.5]}
						/>
						<SkeletonListItem
							showAvatar
							lineWidths={[0.76, 0.52, 0.42]}
						/>
					</View>
				) : errorMessage ? (
					<ErrorState
						title="Equipe indisponible"
						description={errorMessage}
						actionLabel="Reessayer"
						onActionPress={() => {
							void reload();
						}}
					/>
				) : employees.length === 0 ? (
					<EmptyState
						title="Aucun employe"
						description="Invitez vos premiers collaborateurs pour gerer le magasin."
						actionLabel={canInviteEmployees ? "Inviter un employe" : undefined}
						onActionPress={
							canInviteEmployees
								? () => setIsInviteModalVisible(true)
								: undefined
						}
					/>
				) : filteredEmployees.length === 0 ? (
					<EmptyState
						title="Aucun resultat"
						description="Aucun collaborateur ne correspond a votre recherche."
						actionLabel="Effacer la recherche"
						onActionPress={() => setSearchQuery("")}
					/>
				) : (
					<FlatList
						data={filteredEmployees}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.listContent}
						showsVerticalScrollIndicator={false}
						ListHeaderComponent={
							<View style={styles.headerRow}>
								<Text
									variant="h3"
									style={styles.sectionTitle}
									textColorOverride={lightColors.text.primary}
								>
									Equipe
								</Text>
								<Text
									variant="small"
									style={styles.headerLabel}
									textColorOverride={
										lightColors.text.secondary
									}
								>
									{employeesCountLabel}
								</Text>
							</View>
						}
						renderItem={({ item }) => (
							<EmployeeListItem
								employee={item}
								canToggleRole={canChangeRole(item)}
								canRevoke={canRevoke(item)}
								onPressToggleRole={setEmployeeToChangeRole}
								onPressRevoke={setEmployeeToRevoke}
							/>
						)}
						ItemSeparatorComponent={() => (
							<View style={styles.itemSeparator} />
						)}
					/>
				)}
			</View>

			{canInviteEmployees ? (
				<View
					style={[
						styles.stickyActionWrap,
						{ paddingBottom: stickyBarBottomPadding },
					]}
				>
					<Button
						title="Inviter un employé"
						onPress={() => setIsInviteModalVisible(true)}
						containerStyle={styles.stickyActionButton}
						textStyle={styles.actionText}
						leftIcon={
							<Icon
								name="userPlus"
								size={18}
								strokeWidth={2}
								color={lightColors.neutral100}
							/>
						}
					/>
				</View>
			) : null}

			<InviteEmployeeModal
				visible={isInviteModalVisible}
				onClose={() => setIsInviteModalVisible(false)}
				onApply={handleInviteEmployee}
			/>

			<ConfirmDialog
				visible={Boolean(employeeToChangeRole)}
				title="Changer le rôle"
				description={
					employeeToChangeRole
						? `Basculer le rôle de ${employeeToChangeRole.fullName} ?`
						: ""
				}
				confirmLabel="Confirmer"
				onCancel={() => setEmployeeToChangeRole(null)}
				onConfirm={() => {
					void handleConfirmRoleChange();
				}}
			/>

			<ConfirmDialog
				visible={Boolean(employeeToRevoke)}
				title="Révoquer l’accès"
				description={
					employeeToRevoke
						? `Retirer ${employeeToRevoke.fullName} de l’équipe ?`
						: ""
				}
				confirmLabel="Révoquer l’accès"
				tone="danger"
				onCancel={() => setEmployeeToRevoke(null)}
				onConfirm={() => {
					void handleConfirmRevoke();
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s3,
	},
	actionText: {
		fontWeight: "700",
	},
	stackGap: {
		rowGap: spacing.s2,
	},
	listContent: {
		paddingBottom: spacing.s2,
	},
	headerRow: {
		paddingBottom: spacing.s2,
		rowGap: spacing.s0,
	},
	sectionTitle: {
		fontWeight: "700",
	},
	headerLabel: {
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: 0.8,
	},
	itemSeparator: {
		height: spacing.s2,
	},
	stickyActionWrap: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s3,
		backgroundColor: lightColors.neutral100,
		borderTopWidth: 1,
		borderTopColor: lightColors.border.default,
	},
	stickyActionButton: {
		minHeight: 48,
		borderRadius: 14,
		shadowColor: "#000000",
		shadowOpacity: 0.08,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
});

export default EmployeeManagementScreen;
