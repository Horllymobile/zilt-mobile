import { THEME } from "@/shared/constants/theme";
import { Text, TextInput, View } from "react-native";

type EmailInputProps = {
  plainText: string;
  setPlainText: (plainText: string) => void;
  width?: number;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  error?: string;
  maxLength?: number;
};

export function PlainTextInput({
  plainText,
  setPlainText,
  width,
  onBlur,
  label,
  placeholder,
  error,
  maxLength,
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
          width: width ? width - 40 : "100%",
          borderColor: THEME.colors.text,
        }}
      >
        <TextInput
          keyboardType="default"
          value={plainText}
          onChangeText={setPlainText}
          placeholder={placeholder}
          onBlur={onBlur}
          placeholderTextColor={THEME.colors.text}
          multiline={true} // <-- allow multiple lines
          textAlignVertical="top" // <-- makes text start from top instead of center
          style={{
            fontSize: 16,
            width: width ? width - 40 : "100%",
            minHeight: 80, // <-- allows height to grow
            borderWidth: 0,
            borderRadius: 0,
            color: THEME.colors.text,
            padding: 10, // optional padding for better look
          }}
          maxLength={maxLength}
        />
        {error ? (
          <Text style={{ color: THEME.colors.error, marginTop: 10 }}>
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
