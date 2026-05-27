export const formatDateSafe = (
	date: Date,
	options: Intl.DateTimeFormatOptions,
	locale: string = 'fr-FR',
): string => {
	try {
		return new Intl.DateTimeFormat(locale, options).format(date);
	} catch {
		try {
			return date.toLocaleString(locale);
		} catch {
			return date.toISOString();
		}
	}
};

export const parseDateSafe = (input: string | number | Date | undefined): Date | null => {
	if (input === undefined || input === null) {
		return null;
	}

	const date = input instanceof Date ? input : new Date(input);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return date;
};
