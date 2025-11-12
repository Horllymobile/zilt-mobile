import { EmailInput } from "@/components/EmailInput";
import { PasswordInput } from "@/components/PasswordInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useRegisterMutation } from "@/shared/services/auth/authApi";
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
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// 🧠 Define schema
const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const { width } = Dimensions.get("window");
  const { session } = useAuthStore();
  const registerMutation = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema as any),
    mode: "onChange",
  });

  if (session) {
    return <Redirect href={"/main/(dashboard)"} />;
  }

  const onSubmit = (data: SignUpFormData) => {
    registerMutation.mutate(
      {
        email: data.email.toLowerCase(),
        password: data.password,
      },
      { onSuccess: () => reset() }
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
            style={{ width: 150, height: 150, marginBottom: 20 }}
            resizeMode="contain"
          />

          {/* 📧 Email */}
          <View style={{ width: width - 40 }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <EmailInput
                  label="Email"
                  placeholder="Enter your email"
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

          {/* 🔑 Password */}
          <View style={{ width: width - 40 }}>
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
          </View>

          {/* 🔒 Confirm Password */}
          <View style={{ width: width - 40 }}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  password={value}
                  setPassword={onChange}
                  width={width}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text
                style={{
                  color: THEME.colors.error,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* 🚀 Submit */}
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
            isLoading={registerMutation.isPending}
            label="Sign Up"
            width={width}
            disabled={registerMutation.isPending || !isValid}
            onPress={handleSubmit(onSubmit)}
          />

          {/* 🔁 Already have account */}
          <TouchableHighlight
            style={{ marginTop: 10 }}
            onPress={() => router.navigate("/(auth)/login")}
            disabled={registerMutation.isPending}
          >
            <Text
              style={{
                fontSize: 14,
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
