import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/AppNavigator";
import { LegalDocumentScreen } from "./LegalDocumentScreen";
import { TERMS_OF_USE_CONTENT } from "./LegalDocuments.content";

type TermsOfUseScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"TermsOfUse"
>;

export const TermsOfUseScreen: React.FC<TermsOfUseScreenProps> = ({
	navigation,
}) => {
	return (
		<LegalDocumentScreen
			document={TERMS_OF_USE_CONTENT}
			onBack={() => navigation.goBack()}
		/>
	);
};

export default TermsOfUseScreen;
