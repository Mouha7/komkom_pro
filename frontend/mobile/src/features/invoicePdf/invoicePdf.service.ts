import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { InvoiceDataMock } from '../../mocks/orders';
import { buildInvoiceHtml } from './invoicePdf.template';

const sanitizePdfFileName = (invoiceNumber: string): string =>
	invoiceNumber.replace(/[\\/:*?"<>|]/g, '-').trim() || 'facture';

const buildPdfFileName = (invoiceNumber: string): string =>
	`${sanitizePdfFileName(invoiceNumber)}.pdf`;

const ensureNamedPdfUri = async (
	temporaryUri: string,
	invoiceNumber: string,
): Promise<string> => {
	const cacheDirectory = FileSystem.Paths.cache?.uri;
	if (!cacheDirectory) {
		return temporaryUri;
	}

	const namedUri = `${cacheDirectory}${buildPdfFileName(invoiceNumber)}`;
	const existingFile = new FileSystem.File(namedUri);
	if (existingFile.exists) {
		existingFile.delete();
	}

	const sourceFile = new FileSystem.File(temporaryUri);
	sourceFile.copy(existingFile);
	return existingFile.uri;
};

/**
 * Génère un fichier PDF temporaire depuis les données de la facture.
 * Retourne l'URI du fichier dans le répertoire cache de l'app.
 */
export const generateInvoicePdf = async (data: InvoiceDataMock): Promise<string> => {
	const html = buildInvoiceHtml(data);
	const { uri } = await Print.printToFileAsync({ html });
	return ensureNamedPdfUri(uri, data.invoiceNumber);
};

export type ShareInvoiceOptions = {
	dialogTitle?: string;
};

/**
 * Génère le PDF puis ouvre la feuille de partage système.
 * L'utilisateur peut choisir l'app cible (Fichiers, AirDrop, Mail, etc.).
 * Fonctionne pour "Enregistrer" et "Partager" — la distinction est faite par dialogTitle.
 */
export const shareInvoiceViaSharingSheet = async (
	data: InvoiceDataMock,
	options?: ShareInvoiceOptions,
): Promise<void> => {
	const isAvailable = await Sharing.isAvailableAsync();
	if (!isAvailable) {
		throw new Error(
			'Le partage de fichiers n\'est pas disponible sur cet appareil.',
		);
	}
	const uri = await generateInvoicePdf(data);
	await Sharing.shareAsync(uri, {
		mimeType: 'application/pdf',
		UTI: '.pdf',
		dialogTitle: options?.dialogTitle,
	});
};
