import type { InvoiceDataMock } from '../../mocks/orders';

const FIRST_PAGE_CAPACITY = 11;
const NEXT_PAGE_CAPACITY = 15;
const FIXED_CONTENT_WEIGHT = 5;

const getItemWeight = (item: InvoiceDataMock['items'][number]): number => {
	if (item.name.length > 70) {
		return 2;
	}

	if (item.name.length > 36) {
		return 1.5;
	}

	return 1;
};

export const estimateInvoicePageCount = (invoice: InvoiceDataMock): number => {
	const itemsWeight = invoice.items.reduce(
		(total, item) => total + getItemWeight(item),
		0,
	);
	const totalWeight = FIXED_CONTENT_WEIGHT + itemsWeight;

	if (totalWeight <= FIRST_PAGE_CAPACITY) {
		return 1;
	}

	return 1 + Math.ceil((totalWeight - FIRST_PAGE_CAPACITY) / NEXT_PAGE_CAPACITY);
};