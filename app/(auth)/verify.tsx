import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import {
  useGetProfileQuery,
  useVerifyOTPMutation,
} from "@/shared/services/auth/authApi";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Verify() {
  const { width } = Dimensions.get("window");
  const { setAuthData } = useAuthStore();
  const getProfileQuery = useGetProfileQuery(false);

  const { email } = useLocalSearchParams();
  // console.log(params);

  const verifyOTPMutation = useVerifyOTPMutation();

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    console.log("Submitted OTP:", otpCode);
    // Call your API to verify OTP here
    verifyOTPMutation.mutate({
      token: otpCode,
      email: email as string,
    });
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
                  // Handle paste of full OTP
                  if (text.length > 1) {
                    const pasted = text.slice(0, 6).split("");
                    const newOtp = [...otp];
                    for (let i = 0; i < 6; i++) {
                      newOtp[i] = pasted[i] || "";
                    }
                    setOtp(newOtp);

                    // Move focus to last filled input
                    const nextIndex = Math.min(pasted.length - 1, 5);
                    inputsRef.current[nextIndex]?.focus();
                    return;
                  }

                  // Normal single-digit handling
                  handleChange(text, index);
                }}
                keyboardType="number-pad"
                maxLength={6} // allows paste of all 6 digits
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
