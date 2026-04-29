import { useCallback, useEffect, useMemo, useState } from 'react';

import {
	inviteEmployee as inviteEmployeeApi,
	listEmployees,
	revokeEmployeeAccess,
	updateEmployeeRole as updateEmployeeRoleApi,
} from '../api/employees';
import { useAuth } from './useAuth';
import type {
	EmployeeModel,
	EmployeeRole,
	InviteEmployeePayload,
} from '../mocks/employees';

type ActorStoreRole = 'owner' | 'manager' | 'seller' | 'unknown';

type UseEmployeesParams = {
	storeId: string | undefined;
	ownerUserId: string | undefined;
};

type UseEmployeesResult = {
	employees: EmployeeModel[];
	filteredEmployees: EmployeeModel[];
	searchQuery: string;
	isLoading: boolean;
	errorMessage: string | null;
	reload: () => Promise<void>;
	setSearchQuery: (nextValue: string) => void;
	currentUserStoreRole: ActorStoreRole;
	canInviteEmployees: boolean;
	canChangeRole: (employee: EmployeeModel) => boolean;
	canRevoke: (employee: EmployeeModel) => boolean;
	inviteEmployee: (payload: InviteEmployeePayload) => Promise<EmployeeModel>;
	changeEmployeeRole: (
		employeeId: string,
		role: EmployeeRole,
	) => Promise<EmployeeModel>;
	revokeEmployee: (employeeId: string) => Promise<void>;
};

const PERMISSION_MESSAGES = {
	inviteDenied: 'Seul le proprietaire peut inviter des employes.',
	roleChangeDenied: 'Seul le proprietaire peut changer les roles.',
	revokeDenied: 'Vous ne pouvez pas revoquer cet employe.',
};

export const useEmployees = ({
	storeId,
	ownerUserId,
}: UseEmployeesParams): UseEmployeesResult => {
	const { user } = useAuth();
	const [employees, setEmployees] = useState<EmployeeModel[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const currentUserId = user?.id;

	const currentUserStoreRole = useMemo<ActorStoreRole>(() => {
		if (!currentUserId) {
			return 'unknown';
		}

		if (ownerUserId === currentUserId) {
			return 'owner';
		}

		const currentEmployee = employees.find(
			(employee) => employee.userId === currentUserId,
		);

		if (!currentEmployee) {
			return 'unknown';
		}

		return currentEmployee.role;
	}, [currentUserId, employees, ownerUserId]);

	const canInviteEmployees = currentUserStoreRole === 'owner';

	const canChangeRole = useCallback(
		(employee: EmployeeModel): boolean => {
			if (currentUserStoreRole !== 'owner') {
				return false;
			}

			if (employee.isOwner) {
				return false;
			}

			if (employee.userId && employee.userId === currentUserId) {
				return false;
			}

			return true;
		},
		[currentUserId, currentUserStoreRole],
	);

	const canRevoke = useCallback(
		(employee: EmployeeModel): boolean => {
			if (!currentUserId) {
				return false;
			}

			if (employee.isOwner) {
				return false;
			}

			if (employee.userId && employee.userId === currentUserId) {
				return false;
			}

			if (currentUserStoreRole === 'owner') {
				return true;
			}

			if (currentUserStoreRole === 'manager') {
				return employee.role === 'seller';
			}

			return false;
		},
		[currentUserId, currentUserStoreRole],
	);

	const reload = useCallback(async (): Promise<void> => {
		if (!storeId) {
			setEmployees([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setErrorMessage(null);

		try {
			const nextEmployees = await listEmployees(storeId);
			setEmployees(nextEmployees);
		} catch (error) {
			const baseMessage = 'Impossible de charger les employes.';
			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
		} finally {
			setIsLoading(false);
		}
	}, [storeId]);

	const inviteEmployee = useCallback(
		async (payload: InviteEmployeePayload): Promise<EmployeeModel> => {
			if (!storeId) {
				throw new Error('Store unavailable.');
			}

			if (!canInviteEmployees) {
				throw new Error(PERMISSION_MESSAGES.inviteDenied);
			}

			const created = await inviteEmployeeApi(storeId, payload, currentUserId);
			setEmployees((current) => [created, ...current]);
			setErrorMessage(null);
			return created;
		},
		[canInviteEmployees, currentUserId, storeId],
	);

	const changeEmployeeRole = useCallback(
		async (employeeId: string, role: EmployeeRole): Promise<EmployeeModel> => {
			if (!storeId) {
				throw new Error('Store unavailable.');
			}

			const targetEmployee = employees.find((employee) => employee.id === employeeId);
			if (!targetEmployee || !canChangeRole(targetEmployee)) {
				throw new Error(PERMISSION_MESSAGES.roleChangeDenied);
			}

			const updated = await updateEmployeeRoleApi(
				storeId,
				employeeId,
				{
					role,
				},
				currentUserId,
			);
			setEmployees((current) =>
				current.map((employee) =>
					employee.id === employeeId ? updated : employee,
				),
			);
			setErrorMessage(null);
			return updated;
		},
		[canChangeRole, currentUserId, employees, storeId],
	);

	const revokeEmployee = useCallback(
		async (employeeId: string): Promise<void> => {
			if (!storeId) {
				throw new Error('Store unavailable.');
			}

			const targetEmployee = employees.find((employee) => employee.id === employeeId);
			if (!targetEmployee || !canRevoke(targetEmployee)) {
				throw new Error(PERMISSION_MESSAGES.revokeDenied);
			}

			await revokeEmployeeAccess(storeId, employeeId, currentUserId);
			setEmployees((current) =>
				current.filter((employee) => employee.id !== employeeId),
			);
			setErrorMessage(null);
		},
		[canRevoke, currentUserId, employees, storeId],
	);

	const filteredEmployees = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();
		if (!normalizedQuery) {
			return employees;
		}

		return employees.filter((employee) => {
			const haystack = [
				employee.fullName,
				employee.email,
				employee.phone,
				employee.role,
				employee.status,
			]
				.join(' ')
				.toLowerCase();

			return haystack.includes(normalizedQuery);
		});
	}, [employees, searchQuery]);

	useEffect(() => {
		void reload();
	}, [reload]);

	return {
		employees,
		filteredEmployees,
		searchQuery,
		isLoading,
		errorMessage,
		reload,
		setSearchQuery,
		currentUserStoreRole,
		canInviteEmployees,
		canChangeRole,
		canRevoke,
		inviteEmployee,
		changeEmployeeRole,
		revokeEmployee,
	};
};
