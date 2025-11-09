import { THEME } from "@/shared/constants/theme";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
  width: number;
};

export function PasswordInput({
  password,
  setPassword,
  width,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text
        style={{
          color: THEME.colors.text,
        }}
      >
        Password
      </Text>
      <View
        style={{
          borderWidth: 0.2,
          borderRadius: 10,
          marginTop: 10,
          padding: 10,
          height: 40,
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
          placeholder="Enter your password"
          placeholderTextColor={THEME.colors.textPlaceholder}
          style={{
            fontSize: 16,
            width: width - 40,
            borderWidth: 0,
            borderRadius: 0,
            color: THEME.colors.text,
          }}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 5,
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
    </View>
  );
}
