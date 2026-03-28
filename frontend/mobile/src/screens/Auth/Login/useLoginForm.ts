import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

export const useLoginForm = () => {
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);
	const emailInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const togglePasswordVisibility = () => {
		setIsPasswordHidden((current) => !current);
	};

	return {
		isPasswordHidden,
		emailInputRef,
		passwordInputRef,
		togglePasswordVisibility,
	};
};
