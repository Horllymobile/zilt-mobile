import { EmailInput } from "@/components/EmailInput";
import { PasswordInput } from "@/components/PasswordInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useRegisterMutation } from "@/shared/services/auth/authApi";
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

export default function SignUp() {
  const { width } = Dimensions.get("window");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const { session } = useAuthStore();

  const { setAuthData, session } = useAuthStore();

  if (session) {
    return <Redirect href={"/main/(dashboard)"} />;
    // router.push("/main/(dashboard)/");
  }

  const registerMutation = useRegisterMutation();

  const handleSubmit = async () => {
    // console.log(email, password);

    registerMutation.mutate(
      {
        email: email.toLowerCase(),
        password,
      },
      {
        onSuccess: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
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
        style={{ width: 250, height: 250, marginBottom: 20 }}
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
        isLoading={registerMutation.isPending}
        label="Sign Up"
        width={width}
        disabled={registerMutation.isPending || !isValid}
        onPress={() => {
          handleSubmit();
        }}
      />

      <TouchableHighlight
        style={{
          marginTop: 10,
        }}
        onPress={() => {
          router.navigate("/(auth)/login");
        }}
        disabled={registerMutation.isPending}
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
          Already have an account? Login
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
