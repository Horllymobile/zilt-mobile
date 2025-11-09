import { EmailInput } from "@/components/EmailInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useForgotPasswordMutation } from "@/shared/services/auth/authApi";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableHighlight,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
  const { width } = Dimensions.get("window");

  const [email, setEmail] = useState("");

  const { setAuthData, session } = useAuthStore();

  if (session) {
    return <Redirect href={"/main/(dashboard)"} />;
    // router.push("/main/(dashboard)/");
  }

  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = async () => {
    forgotPasswordMutation.mutate({
      email: email.toLowerCase(),
    });
  };

  const isValid = email !== "";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // justifyContent: "space-evenly",
        justifyContent: "center",
        gap: 20,
        alignItems: "center",
        backgroundColor: THEME.colors.background,
      }}
    >
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ width: 250, height: 250, marginBottom: 20 }}
        resizeMode="contain"
      />

      <EmailInput email={email} setEmail={setEmail} width={width} />

      <WideButton
        style={{
          marginTop: 10,
          backgroundColor: isValid
            ? THEME.colors.surface
            : THEME.colors.backdrop,
          width: width - 40,
          height: 50,
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          borderRadius: 20,
        }}
        isLoading={forgotPasswordMutation.isPending}
        label="Submit"
        width={width}
        disabled={forgotPasswordMutation.isPending || !isValid}
        onPress={() => {
          // handleSubmit();
        }}
      />

      {/* <TouchableHighlight
        style={{
          marginTop: 10,
          backgroundColor: THEME.colors.surface,
          width: width - 40,
          height: 50,
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          borderRadius: 20,
        }}
        disabled={forgotPasswordMutation.isPending}
        onPress={() => {
          handleSubmit();
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
          {forgotPasswordMutation.isPending ? (
            <ActivityIndicator size={"small"} color={THEME.colors.text} />
          ) : (
            "Submit"
          )}
        </Text>
      </TouchableHighlight> */}

      <TouchableHighlight
        className="mt-5"
        style={{
          marginTop: 5,
        }}
        onPress={() => {
          router.navigate("/(auth)/login");
        }}
        disabled={forgotPasswordMutation.isPending}
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
          Login
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
