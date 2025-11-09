import { CreateTextMoment } from "@/components/CreateTextMoment";
import FloatingActionButton from "@/components/FloatingActionButton";
import { getRandomColor } from "@/libs/utils/colors";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Image, Pencil, Send, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RANDOM_COLOR = getRandomColor();

export default function CreateMoment() {
  const [type, setType] = useState("text");
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // onImageLoaded(result.assets[0].uri);
      // router.dismiss();
    }
  };

  const [content, setContent] = useState("");

  const socket = useSocket();
  useEffect(() => {
    // SocketService.connect();
    if (!socket) return;

    // socket.emit("get_moments", { page: 1, size: 10 });
    socket.on("moments:creating", (moments: { isCreating: boolean }) => {
      // setMoments(moments);
      setIsCreating(moments.isCreating);
    });

    return () => {
      socket.off("moments:creating");
    };
  }, [socket]);

  const createMoment = () => {
    if (content.trim()) {
      socket?.emit("create_moment", {
        type: "text",
        content,
      });
      setContent("");
      // onCreate();
      router.dismiss();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => {
                if (router.canDismiss()) {
                  router.dismiss();
                }
              }}
            >
              <X color={THEME.colors.text} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* TYPE SELECTOR */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            onPress={() => setType("text")}
            style={[
              styles.selectorButton,
              {
                backgroundColor:
                  type === "text" ? THEME.colors.primary : THEME.colors.text,
                borderColor:
                  type === "text" ? THEME.colors.text : THEME.colors.primary,
              },
            ]}
          >
            <Pencil
              color={type === "text" ? THEME.colors.text : THEME.colors.primary}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // setType("media");
              pickImage();
            }}
            style={[
              styles.selectorButton,
              {
                backgroundColor:
                  type === "media" ? THEME.colors.primary : THEME.colors.text,
                borderColor:
                  type === "media" ? THEME.colors.text : THEME.colors.primary,
              },
            ]}
          >
            <Image
              color={
                type === "media" ? THEME.colors.text : THEME.colors.primary
              }
              size={28}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => setType("live")}
            style={[
              styles.selectorButton,
              {
                backgroundColor:
                  type === "live" ? THEME.colors.primary : THEME.colors.text,
                borderColor: type === "live" ? THEME.colors.text : THEME.colors.primary,
              },
            ]}
          >
            <Video
              color={type === "live" ? THEME.colors.text : THEME.colors.primary}
              size={28}
            />
          </TouchableOpacity> */}
        </View>

        {/* TEXT INPUT */}
        {type === "text" && (
          <CreateTextMoment
            color={RANDOM_COLOR}
            content={content}
            setContent={setContent}
          />
        )}

        <FloatingActionButton
          isLoading={isCreating}
          disabled={!content || isCreating}
          icon={<Send color={THEME.colors.text} />}
          onPress={createMoment}
          color={THEME.colors.primary}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: RANDOM_COLOR,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    paddingHorizontal: 16,
  },
  textInput: {
    fontSize: 34,
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
