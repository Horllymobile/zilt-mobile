import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import {
  useGetProfileQuery,
  useLoginOTPMutation,
  useVerifyOTPMutation,
} from "@/shared/services/auth/authApi";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Verify() {
  const { width } = Dimensions.get("window");
  const { setAuthData } = useAuthStore();
  const getProfileQuery = useGetProfileQuery(false);

  const { email } = useLocalSearchParams();
  const verifyOTPMutation = useVerifyOTPMutation();
  const loginOTPMutation = useLoginOTPMutation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) inputsRef.current[index + 1]?.focus();
    if (!text && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    verifyOTPMutation.mutate({
      token: otpCode,
      email: email as string,
    });
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      loginOTPMutation.mutate(
        {
          email: email as string,
        },
        {
          onSuccess: () => {
            Alert.alert("OTP Resent", "A new OTP has been sent to your email.");
            setTimer(60);
          },
        }
      );

      // Restart countdown
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
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
            style={{ width: 150, height: 150, marginBottom: 20 }}
            resizeMode="contain"
          />

          {/* OTP Inputs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: width - 60,
            }}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputsRef.current[index] = ref) as any}
                value={digit}
                onChangeText={(text) => {
                  if (text.length > 1) {
                    const pasted = text.slice(0, 6).split("");
                    const newOtp = [...otp];
                    for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || "";
                    setOtp(newOtp);
                    const nextIndex = Math.min(pasted.length - 1, 5);
                    inputsRef.current[nextIndex]?.focus();
                    return;
                  }
                  handleChange(text, index);
                }}
                keyboardType="number-pad"
                maxLength={6}
                style={{
                  borderWidth: 1,
                  borderColor: THEME.colors.surface,
                  width: 45,
                  height: 55,
                  borderRadius: 8,
                  textAlign: "center",
                  fontSize: 20,
                  color: THEME.colors.text,
                }}
              />
            ))}
          </View>

          {/* Submit OTP */}
          <WideButton
            style={{
              marginTop: 20,
              backgroundColor: THEME.colors.surface,
              width: width - 40,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
            width={width}
            label="Verify OTP"
            disabled={otp.some((d) => d === "")}
            onPress={handleSubmit}
            isLoading={verifyOTPMutation.isPending}
          />

          {/* Resend OTP */}
          <View style={{ marginTop: 10, alignItems: "center" }}>
            {timer > 0 ? (
              <Text style={{ color: THEME.colors.text }}>
                Resend available in {timer}s
              </Text>
            ) : (
              <TouchableOpacity
                disabled={loginOTPMutation.isPending}
                onPress={handleResendOTP}
              >
                <Text
                  style={{
                    color: loginOTPMutation.isPending
                      ? THEME.colors.disabled
                      : THEME.colors.primary,
                    fontWeight: "600",
                  }}
                >
                  {loginOTPMutation.isPending ? "Resending..." : "Resend OTP"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
