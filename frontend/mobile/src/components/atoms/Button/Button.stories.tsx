import React from "react";
import { View } from "react-native";

import { spacing } from "../../../styles/spacing";
import { Button } from "./Button";

const meta = {
	title: "Atoms/Button",
	component: Button,
};

export default meta;

export const Primary = {
	render: () => <Button title="Primary Button" onPress={() => undefined} />,
};

export const Secondary = {
	render: () => (
		<Button
			title="Secondary"
			variant="secondary"
			onPress={() => undefined}
		/>
	),
};

export const Ghost = {
	render: () => (
		<Button title="Ghost" variant="ghost" onPress={() => undefined} />
	),
};

export const Disabled = {
	render: () => (
		<Button title="Disabled" disabled onPress={() => undefined} />
	),
};

export const WithIcon = {
	render: () => (
		<View style={{ rowGap: spacing.s2 }}>
			<Button
				title="Avec icone"
				leftIcon={<View />}
				onPress={() => undefined}
			/>
		</View>
	),
};
