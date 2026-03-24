import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/AppNavigator";
import { LegalDocumentScreen } from "./LegalDocumentScreen";
import { PRIVACY_POLICY_CONTENT } from "./LegalDocuments.content";

type PrivacyPolicyScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"PrivacyPolicy"
>;

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
	navigation,
}) => {
	return (
		<LegalDocumentScreen
			document={PRIVACY_POLICY_CONTENT}
			onBack={() => navigation.goBack()}
		/>
	);
};

export default PrivacyPolicyScreen;
