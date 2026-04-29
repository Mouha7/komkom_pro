import React from "react";
import { View } from "react-native";

import { Button, Icon } from "../../atoms";
import type { OrderTrackingActionBarProps } from "./OrderTrackingActionBar.types";
import { styles } from "./OrderTrackingActionBar.styles";
import { lightColors } from "../../../styles/colors";

export const OrderTrackingActionBar: React.FC<OrderTrackingActionBarProps> = ({
	onPressSupport,
	onPressConfirmReception,
	containerStyle,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.separator} />
			<View style={styles.actionsRow}>
				<Button
					title="Support"
					variant="secondary"
					onPress={onPressSupport}
					containerStyle={styles.supportButton}
					textStyle={styles.supportText}
					leftIcon={
						<Icon
							name="headphones"
							size={18}
							color={lightColors.text.primary}
						/>
					}
				/>
				<Button
					title="Confirmer reception"
					variant="primary"
					onPress={onPressConfirmReception}
					containerStyle={styles.confirmButton}
					textStyle={styles.confirmText}
                    leftIcon={
						<Icon
							name="checkCircle"
							size={18}
							color={lightColors.text.onPrimary}
						/>
					}
				/>
			</View>
		</View>
	);
};
