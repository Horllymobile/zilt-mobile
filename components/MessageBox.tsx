import { THEME } from "@/shared/constants/theme";
import { ImageIcon, Send, Smile, X } from "lucide-react-native";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MessageBoxProps = {
  imageURL: string;
  setImageURL: (url: string) => void;
  setMessage: (message: string) => void;
  message: string;
  handleTyping: (typeing: string) => void;
  pickImage: () => void;
  onSend: () => void;
};

export default function MessageBox({
  imageURL,
  setImageURL,
  message,
  setMessage,
  handleTyping,
  pickImage,
  onSend,
}: MessageBoxProps) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: THEME.colors.surface,
      }}
    >
      {imageURL && (
        <View
          style={{
            marginBottom: 8,
            borderRadius: 10,
            overflow: "hidden",
            maxHeight: 200,
          }}
        >
          <Image
            source={{ uri: imageURL }}
            style={{ width: "100%", height: 200, resizeMode: "cover" }}
          />
          <TouchableOpacity
            onPress={() => setImageURL("")}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 16,
              padding: 4,
            }}
          >
            <X color={THEME.colors.text} size={16} />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 0.5,
            borderRadius: 30,
            borderColor: THEME.colors.text,
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 6,
            paddingRight: 20,
          }}
        >
          <Smile color={THEME.colors.text} />
          <TextInput
            style={styles.textInput}
            maxLength={2000}
            onChangeText={(text) => {
              setMessage(text);
              handleTyping(text);
            }}
            multiline
            value={message}
            placeholder="Message"
            placeholderTextColor={THEME.colors.text}
          />
          {message === "" && !imageURL ? (
            <TouchableOpacity onPress={pickImage}>
              <ImageIcon size={24} color={THEME.colors.text} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: THEME.colors.background,
            borderRadius: 50,
            padding: 12,
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={!message.trim() && !imageURL}
          onPress={onSend}
        >
          <Send color={THEME.colors.text} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  selectorButton: {
    width: 80,
    height: 70,
    borderWidth: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  textInputWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textInput: {
    width: "85%",
    fontSize: 14,
    borderWidth: 0,
    borderRadius: 0,
    color: THEME.colors.text,
    // height: 30,
    paddingVertical: 10,
    paddingLeft: 8,
  },
});
