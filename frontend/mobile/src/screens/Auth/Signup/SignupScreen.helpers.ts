import * as Location from "expo-location";

import { COMMON_PASSWORD_PATTERNS } from "./SignupScreen.constants";
import type { PasswordStrength } from "./SignupScreen.types";

export const formatGeocodedAddress = (
	address: Location.LocationGeocodedAddress | undefined,
): string => {
	if (!address) {
		return "";
	}

	const line = [address.name, address.streetNumber, address.street]
		.filter(Boolean)
		.join(" ")
		.trim();
	const locality = [address.district, address.city, address.region]
		.filter(Boolean)
		.join(", ")
		.trim();

	return [line, locality, address.country].filter(Boolean).join(" - ");
};

export const evaluatePasswordStrength = (password: string): PasswordStrength => {
	const trimmedPassword = password.trim();
	const normalizedPassword = trimmedPassword.toLowerCase();

	const minLength = password.length >= 8;
	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSymbol = /[^A-Za-z0-9\s]/.test(password);
	const noLeadingOrTrailingSpaces = password === trimmedPassword;
	const notCommon =
		trimmedPassword.length > 0 &&
		!COMMON_PASSWORD_PATTERNS.some((pattern) => pattern.test(normalizedPassword));

	const varietyCount = [hasLowercase, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;
	const hasSequence = /0123|1234|2345|3456|4567|5678|6789|7890|abcd|qwerty|azerty/i.test(
		normalizedPassword,
	);
	const hasTripleRepeat = /(.)\1{2,}/.test(password);

	let score = 0;
	if (minLength) {
		score += 1;
	}
	if (password.length >= 12) {
		score += 1;
	}
	if (varietyCount >= 2) {
		score += 1;
	}
	if (varietyCount >= 3) {
		score += 1;
	}
	if (varietyCount === 4) {
		score += 1;
	}
	if (noLeadingOrTrailingSpaces) {
		score += 1;
	}
	if (notCommon) {
		score += 1;
	}
	if (hasSequence) {
		score -= 1;
	}
	if (hasTripleRepeat) {
		score -= 1;
	}

	const clampedScore = Math.max(0, Math.min(7, score));
	const level =
		clampedScore <= 2 ? "weak" : clampedScore <= 4 ? "medium" : "strong";
	const isAcceptable =
		minLength && varietyCount >= 2 && noLeadingOrTrailingSpaces && notCommon;

	return {
		minLength,
		hasLowercase,
		hasUppercase,
		hasNumber,
		hasSymbol,
		noLeadingOrTrailingSpaces,
		notCommon,
		score: clampedScore,
		level,
		isAcceptable,
	};
};

export const formatSenegalLocalNumber = (digits: string): string => {
	if (digits.length <= 2) {
		return digits;
	}

	if (digits.length <= 5) {
		return `${digits.slice(0, 2)} ${digits.slice(2)}`;
	}

	if (digits.length <= 7) {
		return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
	}

	return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
};
