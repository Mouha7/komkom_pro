import { appConfig } from '../config';
import type {
	EmployeeModel,
	InviteEmployeePayload,
	UpdateEmployeeRolePayload,
} from '../mocks/employees';
import mockServiceApi from '../mocks/mockService';
import { buildApiUrl, getJson, HttpError, NetworkError } from './httpClient';

const isMockMode = (): boolean => {
	const base = appConfig.apiBaseUrl;
	return base.includes('localhost') || base.includes('127.0.0.1');
};

export const listEmployees = async (storeId: string): Promise<EmployeeModel[]> => {
	if (isMockMode()) {
		return mockServiceApi.getEmployees(storeId);
	}

	return getJson<EmployeeModel[]>(`/api/v1/stores/${storeId}/employees`);
};

export const inviteEmployee = async (
	storeId: string,
	payload: InviteEmployeePayload,
	currentUserId?: string,
): Promise<EmployeeModel> => {
	if (isMockMode()) {
		return mockServiceApi.inviteEmployee(storeId, payload, currentUserId);
	}

	const requestUrl = buildApiUrl(`/api/v1/stores/${storeId}/employees`);
	let response: Response;

	try {
		response = await fetch(requestUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(payload),
		});
	} catch {
		throw new NetworkError(requestUrl, `Network request failed for ${requestUrl}`);
	}

	if (!response.ok) {
		throw new HttpError(response.status, `Request failed with status ${response.status} for ${requestUrl}`);
	}

	return (await response.json()) as EmployeeModel;
};

export const updateEmployeeRole = async (
	storeId: string,
	employeeId: string,
	payload: UpdateEmployeeRolePayload,
	currentUserId?: string,
): Promise<EmployeeModel> => {
	if (isMockMode()) {
		const employee = await mockServiceApi.updateEmployeeRole(
			storeId,
			employeeId,
			payload,
			currentUserId,
		);
		if (!employee) {
			throw new HttpError(404, `Employee not found: ${employeeId}`);
		}
		return employee;
	}

	const requestUrl = buildApiUrl(`/api/v1/stores/${storeId}/employees/${employeeId}/role`);
	let response: Response;

	try {
		response = await fetch(requestUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(payload),
		});
	} catch {
		throw new NetworkError(requestUrl, `Network request failed for ${requestUrl}`);
	}

	if (!response.ok) {
		throw new HttpError(response.status, `Request failed with status ${response.status} for ${requestUrl}`);
	}

	return (await response.json()) as EmployeeModel;
};

export const revokeEmployeeAccess = async (
	storeId: string,
	employeeId: string,
	currentUserId?: string,
): Promise<void> => {
	if (isMockMode()) {
		const revoked = await mockServiceApi.revokeEmployeeAccess(
			storeId,
			employeeId,
			currentUserId,
		);
		if (!revoked) {
			throw new HttpError(404, `Employee not found: ${employeeId}`);
		}
		return;
	}

	const requestUrl = buildApiUrl(`/api/v1/stores/${storeId}/employees/${employeeId}`);
	let response: Response;

	try {
		response = await fetch(requestUrl, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
			},
		});
	} catch {
		throw new NetworkError(requestUrl, `Network request failed for ${requestUrl}`);
	}

	if (!response.ok) {
		throw new HttpError(response.status, `Request failed with status ${response.status} for ${requestUrl}`);
	}
};
