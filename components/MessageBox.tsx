import { THEME } from "@/shared/constants/theme";
import * as Camera from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, Send, Smile, X } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Modal,
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
  onSend: () => void;
};

export default function MessageBox({
  imageURL,
  setImageURL,
  message,
  setMessage,
  handleTyping,
  onSend,
}: MessageBoxProps) {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<Camera.CameraView | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageURL(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setCameraVisible(true);
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImageURL(photo.uri);
      setCameraVisible(false);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: THEME.colors.surface,
      }}
    >
      {/* --- Preview selected image --- */}
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

      {/* --- Message input --- */}
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
            focusable={true}
            multiline
            value={message}
            placeholder="Message"
            placeholderTextColor={THEME.colors.text}
          />

          {/* --- Camera Icon --- */}
          {message === "" && !imageURL ? (
            <TouchableOpacity onPress={openCamera}>
              <CameraIcon size={24} color={THEME.colors.text} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* --- Send Button --- */}
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

      {/* --- Camera Modal --- */}
      <Modal visible={cameraVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <Camera.CameraView
            style={{ flex: 1 }}
            ref={(ref) => setCameraRef(ref)}
          />
          <View
            style={{
              position: "absolute",
              bottom: 50,
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setCameraVisible(false)}
              style={{
                backgroundColor: "rgba(255,255,255,0.3)",
                padding: 12,
                borderRadius: 30,
              }}
            >
              <X size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePhoto}
              style={{
                backgroundColor: "white",
                width: 70,
                height: 70,
                borderRadius: 35,
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: "85%",
    fontSize: 14,
    borderWidth: 0,
    borderRadius: 0,
    color: THEME.colors.text,
    paddingVertical: 10,
    paddingLeft: 8,
  },
});
