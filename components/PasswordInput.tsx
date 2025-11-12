import { THEME } from "@/shared/constants/theme";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
  width: number;
  onBlur?: () => void;
  label: string;
  placeholder?: string;
  error?: string;
};

export function PasswordInput({
  password,
  setPassword,
  width,
  onBlur,
  label,
  placeholder,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

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
          position: "relative",
          borderColor: THEME.colors.text,
        }}
      >
        <TextInput
          secureTextEntry={!showPassword} // 👈 this hides text with •••
          autoCapitalize="none" // 👈 prevent auto-capitalization
          autoCorrect={false} // 👈 prevent autocorrect
          value={password}
          onChangeText={(e) => setPassword(e)}
          placeholder={placeholder}
          placeholderTextColor={THEME.colors.text}
          onBlur={onBlur}
          style={{
            fontSize: 16,
            // width: width - 40,
            borderWidth: 0,
            height: 40,
            borderRadius: 0,
            color: THEME.colors.text,
          }}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 10,
            right: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setShowPassword(!showPassword);
          }}
        >
          {showPassword ? (
            <EyeOff color={THEME.colors.text} size={28} />
          ) : (
            <Eye color={THEME.colors.text} size={28} />
          )}
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={{ color: THEME.colors.error }}>{error}</Text>
      ) : null}
    </View>
  );
}
