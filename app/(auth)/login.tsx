import { EmailInput } from "@/components/EmailInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useLoginOTPMutation } from "@/shared/services/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Email is invalid"),
  // password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { width } = Dimensions.get("window");
  const { session } = useAuthStore();
  // const loginMutation = useLoginMutation();
  const loginOTPMutation = useLoginOTPMutation();

  // ⚙️ Setup react-hook-form with zodResolver
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
    mode: "onChange", // validate in real time
  });

  if (session) {
    return <Redirect href={"/main/(dashboard)"} />;
  }

  const onSubmit = (data: LoginFormData) => {
    loginOTPMutation.mutate(
      {
        email: data.email.toLowerCase(),
      },
      {
        onSuccess: () => {
          router.navigate({
            pathname: "/(auth)/verify",
            params: {
              email: data.email,
            },
          });
        },
      }
    );
  };

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
            style={{ width: 150, height: 150, marginBottom: 10 }}
            resizeMode="contain"
          />

          {/* 📧 Email Field */}
          <View style={{ width: width - 40 }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <EmailInput
                  label="Email"
                  placeholder="Enter your email address"
                  email={value}
                  setEmail={(em) => onChange(em.toLowerCase())}
                  width={width}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && (
              <Text
                style={{
                  color: THEME.colors.error,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* 🔒 Password Field */}
          {/* <View style={{ width: width - 40 }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  password={value}
                  setPassword={onChange}
                  width={width}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.password && (
              <Text
                style={{
                  color: THEME.colors.error,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.password.message}
              </Text>
            )}
          </View> */}

          {/* 🚀 Login Button */}
          <WideButton
            style={{
              marginTop: 10,
              backgroundColor: isValid
                ? THEME.colors.surface
                : THEME.colors.backdrop,
              width: width - 40,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
            isLoading={loginOTPMutation.isPending}
            label="Login / Sign Up"
            width={width}
            disabled={loginOTPMutation.isPending || !isValid}
            onPress={handleSubmit(onSubmit)}
          />

          {/* 🔑 Forgot Password */}
          {/* <TouchableHighlight
            style={{ marginTop: 5 }}
            onPress={() => router.navigate("/(auth)/forget-password")}
            disabled={loginMutation.isPending}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Platform.select({ android: "itim", ios: "itim" }),
                color: THEME.colors.text,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableHighlight> */}

          {/* 🧾 Signup Link */}
          {/* <TouchableHighlight
            style={{ marginTop: 5 }}
            disabled={loginOTPMutation.isPending}
            onPress={() => router.navigate("/(auth)/signup")}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Platform.select({ android: "itim", ios: "itim" }),
                color: THEME.colors.text,
              }}
            >
              Don't have an account? Sign Up
            </Text>
          </TouchableHighlight> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
