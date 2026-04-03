import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBar, Button, Icon, Text } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { useResponsive } from "../../hooks/useResponsive";
import { lightColors } from "../../styles/colors";
import { clamp } from "../../styles/responsive";
import { spacing } from "../../styles/spacing";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../../navigation/BottomTabNavigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, "Profile">;
type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
	const { signOut, user } = useAuth();
	const { width, isMedium, isExpanded } = useResponsive();
	const rootNavigation = navigation.getParent<RootStackNavigationProp>();
	const horizontalPadding = isExpanded ? clamp(width * 0.08, spacing.s4, spacing.s8) : isMedium ? spacing.s5 : spacing.s3;

	return (
		<SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
			<AppBar title="Profil" titleAlign="left" />
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[styles.contentContainer, { paddingHorizontal: horizontalPadding }]}
			>
				<View style={styles.card}>
					<Text
						variant="h3"
						textColorOverride={lightColors.text.primary}
					>
						Profil
					</Text>
					<Text
						variant="body"
						textColorOverride={lightColors.text.secondary}
					>
						{user?.email ?? "Compte de demonstration"}
					</Text>

					<Button
						title="Ouvrir UI State Library"
						variant="secondary"
						onPress={() => rootNavigation?.navigate("UIStateLibrary")}
					/>

					<Button
						title="Ouvrir parametres"
						variant="secondary"
						onPress={() => undefined}
					/>
				</View>

				<View style={styles.card}>
					<Pressable
						onPress={() => signOut()}
						accessibilityRole="button"
						style={styles.logoutRow}
					>
						<Icon
							name="arrowLeft"
							size={18}
							color={lightColors.text.secondary}
						/>
						<Text
							variant="body"
							textColorOverride={lightColors.text.secondary}
						>
							Deconnexion
						</Text>
					</Pressable>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s4,
		paddingBottom: spacing.s5,
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		padding: spacing.s4,
		rowGap: spacing.s2,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
		marginBottom: spacing.s4,
	},
	logoutRow: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: spacing.s2,
		paddingVertical: spacing.s1,
	},
});

export default ProfileScreen;
