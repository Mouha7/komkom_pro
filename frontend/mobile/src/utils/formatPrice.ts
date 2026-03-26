export const formatAmount = (amount: number): string => {
	return new Intl.NumberFormat('fr-FR').format(amount);
};

export const formatPrice = (amount: number, currency: string = 'FCFA'): string => {
	return `${formatAmount(amount)} ${currency}`;
};
