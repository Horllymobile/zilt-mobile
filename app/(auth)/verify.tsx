import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useGetProfileQuery } from "@/shared/services/auth/authApi";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Verify() {
  const { width } = Dimensions.get("window");
  const { setAuthData } = useAuthStore();
  const getProfileQuery = useGetProfileQuery(false);

  const params = useLocalSearchParams();

  console.log(params);

  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log(url);
      const { queryParams } = Linking.parse(url);
      const access_token = queryParams?.access_token;

      if (!access_token) {
        Alert.alert("Error", "No access token found.");
        // setLoading(false);
        return;
      }

      // Restore the session in the app
      //   const { error } = await supabase.auth.setSession({ access_token });

      //   if (error) {
      //     Alert.alert("Error", error.message);
      //   }

      //   setLoading(false);
    };

    // Listen for deep link events
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened via a link
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log(initialUrl);
      if (initialUrl) handleDeepLink({ url: initialUrl });
    })();

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // helps adjust view properly
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 40,
            gap: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 150, height: 150, marginBottom: 20 }}
            resizeMode="contain"
          />

          {/* 🚀 Submit */}
          <WideButton
            style={{
              marginTop: 10,
              backgroundColor: THEME.colors.surface,
              width: width - 40,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
            label="Login"
            width={width}
            disabled={true}
            onPress={() => {
              router.navigate("/(auth)/login");
            }}
            isLoading={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
