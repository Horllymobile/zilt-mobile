import { EmailInput } from "@/components/EmailInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { useForgotPasswordMutation } from "@/shared/services/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
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

// 🧠 Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { width } = Dimensions.get("window");
  const { session } = useAuthStore();
  const forgotPasswordMutation = useForgotPasswordMutation();

  // 🎯 useForm setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema as any),
    mode: "onChange",
  });

  if (session) {
    return <Redirect href={"/main/(dashboard)"} />;
  }

  // 🚀 Submit handler
  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(
      {
        email: data.email.toLowerCase(),
        redirect: "ziltchat://reset-password",
      },
      {
        onSuccess: (data) => {
          reset();
          Alert.alert(data.message);
        },
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
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
            style={{ width: 250, height: 250 }}
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

          {/* 🚀 Submit Button */}
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
            onPress={handleSubmit(onSubmit)}
          />

          {/* 🔁 Login redirect */}
          <TouchableHighlight
            style={{ marginTop: 10 }}
            onPress={() => router.navigate("/(auth)/login")}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
