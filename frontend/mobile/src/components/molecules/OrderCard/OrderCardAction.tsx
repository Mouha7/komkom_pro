import React from 'react';

import { Button } from '../../atoms';
import { styles } from './OrderCard.styles';

interface OrderCardActionProps {
	label: string;
	variant?: 'primary' | 'secondary';
	onPress?: () => void;
	disabled?: boolean;
	containerStyle?: any;
}

export const OrderCardAction: React.FC<OrderCardActionProps> = ({
	label,
	variant = 'secondary',
	onPress,
	disabled = false,
	containerStyle,
}) => {
	return (
		<Button
			title={label}
			onPress={onPress}
			variant={variant}
			disabled={disabled}
            textStyle={styles.actionButtonText}
			containerStyle={[styles.actionButton, containerStyle]}
		/>
	);
};
