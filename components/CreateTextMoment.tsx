import { THEME } from "@/shared/constants/theme";
import { useMemo } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export function CreateTextMoment({
  color,
  content,
  setContent,
}: {
  color: string;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  const maxLength = 500;

  // const createMomentMutation = useCreateMomentMutation();

  const handleChangeText = (text: string) => {
    if (text.length > maxLength) {
      Alert.alert("Limit Reached", "Moment text has passed 500 characters");
      setContent(text.slice(0, maxLength));
    } else {
      setContent(text);
    }
  };

  const dynamicFontSize = useMemo(() => {
    if (content.length < 100) return 34;
    if (content.length < 200) return 28;
    if (content.length < 350) return 24;
    return 20; // smaller when near limit
  }, [content.length]);

  const textAlign = useMemo(
    () => (content.length > 300 ? "justify" : "center"),
    [content.length]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: color }]}
    >
      <View style={styles.textInputWrapper}>
        <TextInput
          style={[
            styles.textInput,
            !content && styles.centeredText,
            {
              fontSize: dynamicFontSize,
              textAlign: textAlign as "center" | "justify",
            },
          ]}
          multiline
          maxLength={500}
          autoFocus
          placeholder="Type a moment"
          placeholderTextColor={THEME.colors.text}
          value={content}
          onChangeText={handleChangeText}
        />

        <Text
          style={[
            styles.counterText,
            content.length > 480 && { color: "tomato" },
          ]}
        >
          {content.length} / {maxLength}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputWrapper: {
    flex: 1,
    justifyContent: "center", // centers the input block vertically
    alignItems: "center", // centers horizontally
    paddingHorizontal: 20,
  },
  textInput: {
    width: "100%",
    fontSize: 34,
    color: THEME.colors.text,
    textAlign: "center",
    textAlignVertical: "center",
    padding: 0,
    minHeight: 100,
  },
  centeredText: {
    flex: 0,
    textAlignVertical: "center", // perfect center for empty input
  },
  counterText: {
    color: THEME.colors.text,
    opacity: 0.7,
    fontSize: 16,
    position: "absolute",
    bottom: 60, // sits above FloatingActionButton
    left: 20,
  },
});
