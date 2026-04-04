import { useCallback, useState } from 'react';

import type { InvoiceDataMock } from '../../mocks/orders';
import { useToast } from '../../hooks/useToast';
import { shareInvoiceViaSharingSheet } from './invoicePdf.service';

type PdfActionKey = 'save' | 'share';

export type InvoicePdfActionsResult = {
	activeAction: PdfActionKey | null;
	handleSave: () => void;
	handleShare: () => void;
};

export const useInvoicePdfActions = (
	invoice: InvoiceDataMock,
): InvoicePdfActionsResult => {
	const { showToast } = useToast();
	const [activeAction, setActiveAction] = useState<PdfActionKey | null>(null);

	const runAction = useCallback(
		async (key: PdfActionKey, action: () => Promise<void>): Promise<void> => {
			if (activeAction !== null) {
				return;
			}
			setActiveAction(key);
			try {
				await action();
			} catch (error) {
				const message =
					__DEV__ && error instanceof Error
						? error.message
						: 'Une erreur est survenue. Veuillez reessayer.';
				showToast({ tone: 'danger', title: 'Erreur PDF', message });
			} finally {
				setActiveAction(null);
			}
		},
		[activeAction, showToast],
	);

	const handleSave = useCallback((): void => {
		void runAction('save', () =>
			shareInvoiceViaSharingSheet(invoice, {
				dialogTitle: `Enregistrer ${invoice.invoiceNumber}`,
			}),
		);
	}, [runAction, invoice]);

	const handleShare = useCallback((): void => {
		void runAction('share', () =>
			shareInvoiceViaSharingSheet(invoice, {
				dialogTitle: `Partager ${invoice.invoiceNumber}`,
			}),
		);
	}, [runAction, invoice]);

	return { activeAction, handleSave, handleShare };
};
