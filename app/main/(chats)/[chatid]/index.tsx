"use client";

import CropMoment from "@/app/CropMoment";
import { Avatar } from "@/components/Avatar";
import ChatMessage from "@/components/ChatMessage";
import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { Message } from "@/models/chat";
import { COLORS } from "@/shared/constants/color";
import { useSocket } from "@/shared/hooks/use-socket";
import { useGetChatQuery } from "@/shared/services/chats/chatApi";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { usePathname, useRouter } from "expo-router";
import {
  ChevronLeft,
  Image as ImageIcon,
  Search,
  Send,
  Smile,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

export type RootStackParamList = {
  Chat: undefined;
  CropMoment: { imageUri: string };
  CreateMoment: { imageUri?: string };
};

type ChatScreenNav = NativeStackNavigationProp<RootStackParamList, "Chat">;

export default function Chat() {
  const { width } = Dimensions.get("window");

  const pathname = usePathname();
  const { profile } = useAuthStore();

  const chatId = pathname.split("/").pop();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);

  const { data: chat } = useGetChatQuery(chatId);
  const member = chat?.members.find((user) => user.userId !== profile?.id);

  const navigation = useNavigation<ChatScreenNav>();

  const viewShotRef = useRef<ViewShot | null>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleCapture = async () => {
    console.log("Handle Capture");
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        console.log(uri);
        setImageToCrop(uri);
        // Navigate to crop screen or show modal
        // navigation.navigate<any>("CropMoment", { imageUri: uri });
      }
    } catch (e) {
      console.log("Error capturing:", e);
    }
  };

  const onImageLoaded = async (imageURI: string) => {
    // ✅ Use new File API
    const file = new File(imageURI);
    const buff = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buff);
    const filePath = `messages/ZiltChat-${Date.now()}.jpg`;

    // setIsUploading(true);
    const { data, error } = await supabase.storage
      .from("ZiltStorage")
      .upload(filePath, uint8Array, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload failed", error.message);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("ZiltStorage")
      .getPublicUrl(filePath);

    console.log(publicUrl);
    // setIsUploading(false);
    setImageURL(publicUrl.publicUrl);
  };

  useEffect(() => {
    if (imageURL) {
      sendImage();
    }
  }, [imageURL]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      onImageLoaded(result.assets[0].uri);
    }
  };

  const unSeenMsgs = (msgs: Message[]) => {
    return msgs.filter((msg) => !msg.seen);
  };

  const socket = useSocket();
  const readMessage = (msgId: string) => {
    if (msgId) {
      socket?.emit("read_message", msgId);
    }
  };

  useEffect(() => {
    // SocketService.connect();
    if (!socket) return;

    socket.emit("get_messages", { chatId, page: 1, size: 10 });
    socket.on("messages", (msgs: Message[]) => {
      console.log(msgs[1].media);
      setMessages(msgs.reverse());

      unSeenMsgs(msgs).forEach((msg) => {
        if (msg && profile?.id !== msg?.senderId) {
          readMessage(msg.id);
        }
      });
    });

    return () => {
      socket.off("messages");
    };
  }, [socket, chatId]);

  const sendImage = () => {
    if (imageURL.trim()) {
      if (socket) {
        socket.emit("send_message", {
          chatId: chat?.id ?? "",
          senderId: profile?.id ?? "",
          recipientId: member?.id ?? "",
          content: message,
          media: [imageURL],
        });
      }
      setImageURL("");
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      if (socket) {
        socket.emit("send_message", {
          chatId: chat?.id ?? "",
          senderId: profile?.id ?? "",
          recipientId: member?.id ?? "",
          content: message,
        });
      }
      setMessage("");
    }
  };

  // if (!chat) {
  //   return <LoaderActivity />;
  // }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      {member ? (
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <ChevronLeft color={COLORS.primary} size={24} />
              </TouchableOpacity>

              {member?.user?.avatar_url ? (
                <Avatar
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#c3adef",
                    overflow: "hidden",
                    marginRight: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  avatar_url={member?.user?.avatar_url}
                  width={50}
                  height={50}
                />
              ) : undefined}

              <Text style={{ fontSize: 24, fontWeight: "medium" }}>
                {member?.user.name}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", gap: 20, alignItems: "center" }}
            >
              <TouchableOpacity onPress={() => handleCapture()}>
                <Zap color={COLORS.primary} size={28} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Search color={COLORS.primary} size={28} />
              </TouchableOpacity>
            </View>
          </View>

          <ViewShot
            style={{ flex: 1, backgroundColor: COLORS.white }}
            ref={viewShotRef}
            options={{ fileName: "Zilt-Shot", format: "jpg", quality: 0.9 }}
          >
            <FlatList
              data={messages}
              keyExtractor={(item) =>
                item.id?.toString() ?? Math.random().toString()
              }
              renderItem={({ item }) => <ChatMessage message={item} />}
              contentContainerStyle={{ paddingBottom: 80 }}
              inverted // 👈 makes the newest messages appear at the bottom
            />
          </ViewShot>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={90} // adjust depending on your header height
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: COLORS.white,
            }}
          >
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
                  borderColor: COLORS.primary,
                  backgroundColor: COLORS.white,
                  flex: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <Smile color={COLORS.primary} />
                <TextInput
                  style={[styles.textInput]}
                  maxLength={2000}
                  onChangeText={setMessage}
                  multiline
                  value={message}
                  placeholder="Message"
                />
                {message !== "" ? (
                  <TouchableOpacity onPress={pickImage}>
                    <ImageIcon size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                ) : undefined}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 50,
                  padding: 12,
                  width: 48,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disabled={!message.trim()}
                onPress={sendMessage}
              >
                <Send color={COLORS.white} size={20} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      ) : (
        <View></View>
      )}

      {imageToCrop ? (
        <Modal
          visible={true}
          animationType="slide"
          transparent={false} // keep true for overlay look
        >
          <CropMoment
            imageUri={imageToCrop}
            onComplete={(croppedUri) => {
              setImageToCrop(null);
              // open CreateMoment modal here
            }}
            onClose={() => setImageToCrop(null)}
          />
        </Modal>
      ) : undefined}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    paddingHorizontal: 16,
  },
  textInput: {
    width: "100%",
    fontSize: 14,
    // width: width - 80,
    borderWidth: 0,
    borderRadius: 0,
    height: 30,
    paddingLeft: 30,
  },
});
