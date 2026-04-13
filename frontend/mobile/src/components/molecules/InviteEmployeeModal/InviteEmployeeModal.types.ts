import type { InviteEmployeePayload } from '../../../mocks/employees';

export type InviteEmployeeModalProps = {
	visible: boolean;
	onClose: () => void;
	onApply: (payload: InviteEmployeePayload) => Promise<void>;
};
