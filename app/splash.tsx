import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Platform, Text, TouchableHighlight } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Splash() {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;
    router.replace("/main/(dashboard)");
  }, [session]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: THEME.colors.background,
      }}
    >
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 250, height: 250, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "normal",
          fontFamily: Platform.select({
            android: "itim",
            ios: "itim",
          }),
          color: THEME.colors.text,
        }}
      >
        Chat, Meet and Discover
      </Text>

      <TouchableHighlight
        style={{
          backgroundColor: THEME.colors.surface,
          width: 309,
          height: 58,
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          borderRadius: 100,
        }}
        onPress={() => {
          // Handle sign-in action
          router.navigate("/(auth)/login");
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "normal",
            fontFamily: Platform.select({
              android: "itim",
              ios: "itim",
            }),
            color: THEME.colors.text,
          }}
        >
          Sign In
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
