import { EmailInput } from "@/components/EmailInput";
import { PasswordInput } from "@/components/PasswordInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useLoginMutation } from "@/shared/services/auth/authApi";
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

export default function Login() {
  const { width } = Dimensions.get("window");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setAuthData, session } = useAuthStore();

  if (session) {
    return <Redirect href={"/main/(dashboard)"} />;
    // router.push("/main/(dashboard)/");
  }

  const loginMutation = useLoginMutation();

  const handleSubmit = async () => {
    loginMutation.mutate({
      email: email.toLowerCase(),
      password,
    });
  };

  const isValid = email !== "" && password !== "";

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
        style={{ width: 250, height: 250, marginBottom: 10 }}
        resizeMode="contain"
      />

      <EmailInput email={email} setEmail={setEmail} width={width} />

      <PasswordInput
        password={password}
        setPassword={setPassword}
        width={width}
      />

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
        isLoading={loginMutation.isPending}
        label="Login"
        width={width}
        disabled={loginMutation.isPending || !isValid}
        onPress={() => {
          handleSubmit();
        }}
      />

      <TouchableHighlight
        style={{
          marginTop: 5,
        }}
        onPress={() => {
          router.navigate("/(auth)/forget-password");
        }}
        disabled={loginMutation.isPending}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "normal",
            fontFamily: Platform.select({
              android: "itim",
              ios: "itim",
            }),
            color: THEME.colors.text,
          }}
        >
          Forgot Password?
        </Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={{
          marginTop: 5,
        }}
        disabled={loginMutation.isPending}
        onPress={() => {
          router.navigate("/(auth)/signup");
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "normal",
            fontFamily: Platform.select({
              android: "itim",
              ios: "itim",
            }),
            color: THEME.colors.text,
          }}
        >
          Don't have an account? Sign Up
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
