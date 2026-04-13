import type { EmployeeModel } from '../../../mocks/employees';

export type EmployeeListItemProps = {
	employee: EmployeeModel;
	canToggleRole?: boolean;
	canRevoke?: boolean;
	onPressToggleRole: (employee: EmployeeModel) => void;
	onPressRevoke: (employee: EmployeeModel) => void;
};
