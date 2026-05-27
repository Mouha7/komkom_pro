export const formatAmount = (amount: number): string => {
	try {
		return new Intl.NumberFormat('fr-FR').format(amount);
	} catch {
		try {
			return amount.toLocaleString('fr-FR');
		} catch {
			return String(amount);
		}
	}
};

export const formatPrice = (amount: number, currency: string = 'FCFA'): string => {
	return `${formatAmount(amount)} ${currency}`;
};
