import React, { createContext, useCallback, useMemo, useState } from 'react';

export type AppRole = 'admin' | 'buyer' | 'employee';

type AuthUser = {
	id: string;
	email: string;
};

type SignInPayload = {
	email: string;
	role?: AppRole;
};

export type AuthContextValue = {
	isReady: boolean;
	isAuthenticated: boolean;
	token: string | null;
	roles: AppRole[];
	user: AuthUser | null;
	signIn: (payload: SignInPayload) => Promise<void>;
	signOut: () => Promise<void>;
	restoreSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
	children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isReady, setIsReady] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const [roles, setRoles] = useState<AppRole[]>([]);
	const [user, setUser] = useState<AuthUser | null>(null);

	const restoreSession = useCallback(async (): Promise<void> => {
		// TODO: restore persisted session when backend auth is integrated.
		setIsReady(true);
	}, []);

	const signIn = useCallback(async ({ email, role = 'buyer' }: SignInPayload): Promise<void> => {
		setToken('dev-token');
		setRoles([role]);
		setUser({ id: 'dev-user', email });
	}, []);

	const signOut = useCallback(async (): Promise<void> => {
		setToken(null);
		setRoles([]);
		setUser(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			isReady,
			isAuthenticated: token !== null,
			token,
			roles,
			user,
			signIn,
			signOut,
			restoreSession,
		}),
		[isReady, roles, signIn, signOut, token, user, restoreSession],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };

