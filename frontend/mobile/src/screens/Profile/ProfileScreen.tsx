import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StoreProfile from "../../components/organisms/StoreProfile";
import { lightColors } from "../../styles/colors";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../../navigation/BottomTabNavigator";

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, "Profile">;

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {

	return (
		<SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
			<StoreProfile storeId="preview-store-id" />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
});

export default ProfileScreen;
