import { THEME } from "@/shared/constants/theme";
import { Text, TextInput, View } from "react-native";

type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
  width: number;
};

export function EmailInput({ email, setEmail, width }: EmailInputProps) {
  return (
    <View>
      <Text
        style={{
          color: THEME.colors.text,
        }}
      >
        Email
      </Text>
      <View
        style={{
          borderWidth: 0.2,
          borderRadius: 10,
          marginTop: 10,
          padding: 10,
          height: 40,
          width: width - 40,
          borderColor: THEME.colors.text,
        }}
      >
        <TextInput
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setEmail(e)}
          placeholder="Enter your email address"
          placeholderTextColor={THEME.colors.textPlaceholder}
          style={{
            fontSize: 16,
            width: width - 40,
            borderWidth: 0,
            borderRadius: 0,
            color: THEME.colors.text,
          }}
        />
      </View>
    </View>
  );
}
