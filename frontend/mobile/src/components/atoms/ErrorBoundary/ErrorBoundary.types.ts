import type { ReactNode } from 'react';

export type ErrorBoundaryProps = {
	children: ReactNode;
	fallbackTitle?: string;
	fallbackMessage?: string;
	resetLabel?: string;
	onError?: (error: Error, info: { componentStack?: string }) => void;
};

export type ErrorBoundaryState = {
	error: Error | null;
};
