import React, { useState } from "react";
import { View } from "react-native";

import { spacing } from "../../../styles/spacing";
import { Input } from "./Input";

const meta = {
	title: "Atoms/Input",
	component: Input,
};

export default meta;

const StatefulInput = (
	props: Omit<React.ComponentProps<typeof Input>, "value" | "onChangeText">,
) => {
	const [value, setValue] = useState("");
	return <Input {...props} value={value} onChangeText={setValue} />;
};

export const Default = {
	render: () => <StatefulInput placeholder="Texte" />,
};

export const WithLabel = {
	render: () => (
		<StatefulInput
			label="Telephone"
			placeholder="771231212"
			keyboardType="phone-pad"
		/>
	),
};

export const ErrorState = {
	render: () => (
		<StatefulInput
			label="Numero"
			placeholder="771231212"
			errorMessage="Numero de telephone invalide"
		/>
	),
};

export const DisabledState = {
	render: () => (
		<View style={{ rowGap: spacing.s2 }}>
			<StatefulInput
				label="Inactive"
				placeholder="Saisi desactive"
				editable={false}
			/>
		</View>
	),
};
