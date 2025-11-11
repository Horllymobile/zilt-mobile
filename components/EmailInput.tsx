import { THEME } from "@/shared/constants/theme";
import { Text, TextInput, View } from "react-native";

type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
  width: number;
  onBlur?: () => void;
  label: string;
  placeholder?: string;
};

export function EmailInput({
  email,
  setEmail,
  width,
  onBlur,
  label,
  placeholder,
}: EmailInputProps) {
  return (
    <View>
      <Text
        style={{
          color: THEME.colors.text,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          borderWidth: 0.2,
          borderRadius: 10,
          marginTop: 10,
          paddingTop: 5,
          paddingBottom: 5,
          paddingHorizontal: 10,
          height: 50,
          width: width - 40,
          borderColor: THEME.colors.text,
        }}
      >
        <TextInput
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setEmail(e)}
          placeholder={placeholder}
          onBlur={onBlur}
          placeholderTextColor={THEME.colors.text}
          style={{
            fontSize: 16,
            width: width - 40,
            height: 40,
            borderWidth: 0,
            borderRadius: 0,
            color: THEME.colors.text,
          }}
        />
      </View>
    </View>
  );
}
