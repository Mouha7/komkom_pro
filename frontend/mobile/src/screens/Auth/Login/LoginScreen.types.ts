import type { RefObject } from 'react';
import type { TextInput } from 'react-native';

export interface LoginInputRefs {
	emailInputRef: RefObject<TextInput | null>;
	passwordInputRef: RefObject<TextInput | null>;
}
