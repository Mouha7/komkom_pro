import type { ReactNode } from 'react';

export type ExpandableSectionProps = {
	title: string;
	children: ReactNode;
	defaultExpanded?: boolean;
	testID?: string;
};
