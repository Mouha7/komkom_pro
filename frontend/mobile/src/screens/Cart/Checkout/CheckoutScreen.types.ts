import type { CartItemData } from '../../../components';
import type { PickedLocation } from '../../../features/location';

export type CheckoutPaymentMethod = 'cash_on_delivery' | 'bank_transfer';

export interface CheckoutPaymentOption {
	id: CheckoutPaymentMethod;
	title: string;
	description: string;
	iconName: 'truck' | 'building2';
}

export interface CheckoutTotals {
	subtotal: number;
	deliveryFee: number;
	total: number;
	totalItems: number;
}

export interface CheckoutDeliverySectionProps {
	pickedLocation: PickedLocation | null;
	locationTouched: boolean;
	isResolvingLocation: boolean;
	storeOrBuildingName: string;
	onStoreOrBuildingNameChange: (value: string) => void;
	onOpenLocationModal: () => void;
}

export interface CheckoutPaymentSectionProps {
	selectedPaymentMethod: CheckoutPaymentMethod;
	onSelectPaymentMethod: (value: CheckoutPaymentMethod) => void;
}

export interface CheckoutSummarySectionProps {
	totals: CheckoutTotals;
}

export interface CheckoutScreenState {
	storeOrBuildingName: string;
	instructions: string;
	selectedPaymentMethod: CheckoutPaymentMethod;
	isSubmitting: boolean;
	items: CartItemData[];
}
