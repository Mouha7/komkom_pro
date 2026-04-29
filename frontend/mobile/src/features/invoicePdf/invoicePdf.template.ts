import type { InvoiceDataMock } from "../../mocks/orders";
import { formatPrice } from "../../utils/formatPrice";
import { estimateInvoicePageCount } from "./invoicePdf.pagination";

const esc = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const WATERMARK_BY_STATUS: Record<
	InvoiceDataMock["paymentStatus"],
	{ label: string; color: string }
> = {
	paid: { label: "PAYÉE", color: "rgba(22,163,74,0.12)" },
	pending: { label: "EN ATTENTE", color: "rgba(245,158,11,0.14)" },
	cancelled: { label: "ANNULÉE", color: "rgba(220,38,38,0.12)" },
};

const buildItemRows = (
	items: InvoiceDataMock["items"],
	currency: string,
): string =>
	items
		.map(
			(item) => `
      <tr>
        <td>
          <strong>${esc(item.name)}</strong>
        </td>
        <td class="text-center">${String(item.quantity)}</td>
        <td class="text-right">${formatPrice(item.unitPrice, currency)}</td>
        <td class="text-right">${formatPrice(item.lineTotal, currency)}</td>
      </tr>`,
		)
		.join("");

export const buildInvoiceHtml = (data: InvoiceDataMock): string => {
	const { label: watermarkLabel, color: watermarkColor } =
		WATERMARK_BY_STATUS[data.paymentStatus];
	const itemRows = buildItemRows(data.items, data.currency);
  const pageCount = estimateInvoicePageCount(data);

	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    :root {
      --primary: #ed762f;
      --foreground: #0f1724;
      --muted-foreground: #374151;
      --border: #d1d5db;
      --background: #f3f4f6;
      --card: #ffffff;
      --radius-xl: 99px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: var(--foreground);
      -webkit-font-smoothing: antialiased;
    }
    .pdf-page {
      background-color: #fff; width: 100%; min-height: 485px;
      padding: 24px 20px 64px; position: relative; overflow: hidden;
    }
    .watermark {
      position: absolute; top: 45%; left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 42px; font-weight: 800;
      color: ${watermarkColor};
      border: 4px solid ${watermarkColor};
      border-radius: 8px; padding: 8px 20px;
      pointer-events: none; z-index: 0;
      text-transform: uppercase; letter-spacing: 4px;
    }
    .pdf-content-wrapper { position: relative; z-index: 1; }
    .pdf-header {
      display: flex; justify-content: space-between; align-items: flex-end;
      border-bottom: 2px solid var(--primary); padding-bottom: 12px; margin-bottom: 16px;
    }
    .pdf-logo { font-size: 18px; font-weight: 800; color: var(--primary); line-height: 1; }
    .pdf-doc-title { font-size: 16px; font-weight: 700; color: var(--foreground); letter-spacing: 1px; }
    .pdf-meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 9px; color: var(--muted-foreground); }
    .pdf-meta-col { display: flex; flex-direction: column; gap: 4px; }
    .pdf-addresses { display: flex; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .pdf-address-col { flex: 1; font-size: 9px; line-height: 1.4; color: var(--foreground); }
    .pdf-address-title { font-weight: 600; color: var(--muted-foreground); margin-bottom: 4px; text-transform: uppercase; font-size: 8px; }
    .pdf-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9px; }
    .pdf-table th {
      background-color: var(--background); text-align: left; padding: 6px 8px;
      font-weight: 600; color: var(--muted-foreground); border-bottom: 1px solid var(--border);
      text-transform: uppercase; font-size: 8px;
    }
    .pdf-table td {
      padding: 8px; border-bottom: 1px solid var(--border);
      color: var(--foreground); vertical-align: top; line-height: 1.4;
    }
    .text-right { text-align: right !important; }
    .text-center { text-align: center !important; }
    .pdf-totals-container { display: flex; justify-content: flex-end; }
    .pdf-totals { width: 60%; }
    .pdf-total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 9px; color: var(--muted-foreground); }
    .pdf-total-row.grand-total {
      font-weight: 700; color: var(--foreground); font-size: 11px;
      border-top: 1px solid var(--foreground); padding-top: 6px; margin-top: 4px;
    }
    .pdf-terms { margin-top: 32px; font-size: 7px; color: var(--muted-foreground); line-height: 1.4; }
    .pdf-footer {
      position: absolute; bottom: 20px; left: 20px; right: 20px;
      text-align: center; font-size: 8px; color: var(--muted-foreground);
      border-top: 1px solid var(--border); padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="pdf-page">
    <div class="watermark">${watermarkLabel}</div>
    <div class="pdf-content-wrapper">
      <div class="pdf-header">
        <div class="pdf-logo">KomKom</div>
        <div class="pdf-doc-title">FACTURE</div>
      </div>
      <div class="pdf-meta">
        <div class="pdf-meta-col">
          <div><strong>N&deg; Facture :</strong> ${esc(data.invoiceNumber)}</div>
          <div><strong>Date d&apos;&eacute;mission :</strong> ${esc(data.issuedAt)}</div>
        </div>
        <div class="pdf-meta-col text-right">
          <div><strong>R&eacute;f. Commande :</strong> ${esc(data.orderReference)}</div>
          <div><strong>&Eacute;ch&eacute;ance :</strong> ${esc(data.issuedAt)}</div>
        </div>
      </div>
      <div class="pdf-addresses">
        <div class="pdf-address-col">
          <div class="pdf-address-title">&#201;metteur</div>
          <strong>${esc(data.issuer.name)}</strong><br />
          ${esc(data.issuer.address)}<br />
          ${esc(data.issuer.email)} &mdash; ${esc(data.issuer.phone)}
        </div>
        <div class="pdf-address-col text-right">
          <div class="pdf-address-title">Client</div>
          <strong>${esc(data.client.name)}</strong><br />
          ${esc(data.client.address)}<br />
          ${esc(data.client.phone)}
        </div>
      </div>
      <table class="pdf-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-center">Qt&eacute;</th>
            <th class="text-right">Prix U.</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
      <div class="pdf-totals-container">
        <div class="pdf-totals">
          <div class="pdf-total-row">
            <span>Sous-total HT</span>
            <span>${formatPrice(data.subtotal, data.currency)}</span>
          </div>
          <div class="pdf-total-row">
            <span>Frais de livraison</span>
            <span>${formatPrice(data.deliveryFee, data.currency)}</span>
          </div>
          <div class="pdf-total-row">
            <span>TVA (${String(data.taxRate)}%)</span>
            <span>${formatPrice(data.taxAmount, data.currency)}</span>
          </div>
          <div class="pdf-total-row grand-total">
            <span>Total TTC</span>
            <span>${formatPrice(data.total, data.currency)}</span>
          </div>
        </div>
      </div>
      <div class="pdf-terms">
        <strong>Conditions de paiement :</strong><br />
        Le paiement est d&ucirc; &agrave; r&eacute;ception de la facture.
        Aucun escompte pour paiement anticip&eacute;. En cas de retard de paiement,
        une p&eacute;nalit&eacute; de 3 fois le taux d&apos;int&eacute;r&ecirc;t l&eacute;gal sera appliqu&eacute;e.
      </div>
    </div>
    <div class="pdf-footer">
      KomKom Pro Marketplace &mdash; Document g&eacute;n&eacute;r&eacute; &eacute;lectroniquement<br />
      Page 1 sur ${String(pageCount)}
    </div>
  </div>
</body>
</html>`;
};
