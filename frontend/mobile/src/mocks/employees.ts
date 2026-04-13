export type EmployeeRole = 'manager' | 'seller';
export type EmployeeStatus = 'active' | 'pending';

export interface EmployeeModel {
	id: string;
	userId?: string;
	isOwner?: boolean;
	storeId: string;
	fullName: string;
	email: string;
	phone: string;
	role: EmployeeRole;
	status: EmployeeStatus;
	avatarUrl?: string;
	createdAt: string;
}

export interface InviteEmployeePayload {
	fullName: string;
	email: string;
	phone: string;
	role: EmployeeRole;
}

export interface UpdateEmployeeRolePayload {
	role: EmployeeRole;
}

export const EMPLOYEES: EmployeeModel[] = [
	{
		id: 'emp-1',
		userId: 'dev-user',
		isOwner: true,
		storeId: 'store-profile-dev-user',
		fullName: 'Amadou Sow',
		email: 'amadou.sow@komkom.local',
		phone: '+221 77 234 56 78',
		role: 'manager',
		status: 'active',
		avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FAfrican%2F2',
		createdAt: '2026-01-15T10:00:00.000Z',
	},
	{
		id: 'emp-2',
		storeId: 'store-profile-dev-user',
		fullName: 'Fatou Ndoye',
		email: 'fatou.ndoye@komkom.local',
		phone: '+221 78 311 42 12',
		role: 'seller',
		status: 'active',
		avatarUrl: 'https://i.pravatar.cc/128?img=32',
		createdAt: '2026-02-04T12:30:00.000Z',
	},
	{
		id: 'emp-3',
		storeId: 'store-profile-dev-user',
		fullName: 'Moussa Faye',
		email: 'moussa.faye@komkom.local',
		phone: '+221 76 111 90 70',
		role: 'seller',
		status: 'pending',
		createdAt: '2026-03-01T09:20:00.000Z',
	},
];
