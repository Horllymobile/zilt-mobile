"use client";

import { Avatar } from "@/components/Avatar";
import ChatMessage from "@/components/ChatMessage";
import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { Chat, Message } from "@/models/chat";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import {
  ChevronLeft,
  Image as ImageIcon,
  Search,
  Send,
  Smile,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

// type ChatScreenNav = NativeStackNavigationProp<RootStackParamList, "Chat">;

export default function ChatMessages() {
  const { width } = Dimensions.get("window");

  const pathname = usePathname();
  const { profile } = useAuthStore();

  const { chat } = useLocalSearchParams();

  const router = useRouter();

  const chatData = JSON.parse(chat as string) as Chat;

  const [messages, setMessages] = useState<Message[]>([]);

  // const { data: chat } = useGetChatQuery(chatId);
  const chatId = chatData.id;
  const member = chatData?.members.find((user) => user.userId !== profile?.id);

  // const navigation = useNavigation<ChatScreenNav>();

  const viewShotRef = useRef<ViewShot | null>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleCapture = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        router.push({
          pathname: "/main/(discover)/crop-moment",
          params: { imageUri: encodeURIComponent(uri) },
        });
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
    // setImageURL(publicUrl.publicUrl);
    return publicUrl.publicUrl;
  };

  // useEffect(() => {
  //   if (imageURL) {
  //     sendImage();
  //   }
  // }, [imageURL]);

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

  const unSeenMsgs = (msgs: Message[]) => {
    return msgs.filter((msg) => !msg.seen);
  };

  const socket = useSocket();
  const readMessage = (msgId: string) => {
    if (msgId) {
      socket?.emit("read_message", msgId);
    }
  };

  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);

  useEffect(() => {
    // SocketService.connect();
    if (!socket) return;

    const eventKey = `chat:${chatId}:typing`;

    // socket.emit("join_chat", { chatId });

    socket.emit("get_messages", { chatId, page: 1, size: 10 });
    socket.on("messages", (msgs: Message[]) => {
      console.log(msgs[1].media);
      setMessages(msgs);

      unSeenMsgs(msgs).forEach((msg) => {
        if (msg && profile?.id !== msg?.senderId) {
          readMessage(msg.id);
        }
      });
    });

    // socket.on("chat:joined", ({ roomId, userId }) => {
    //   console.log("Joined Chat", roomId);
    // });

    socket.on(eventKey, ({ userId, isTyping }) => {
      console.log(`User ${userId} is typing`);

      setTypingUserIds((prev) => {
        if (isTyping) return [...new Set([...prev, userId])];
        return prev.filter((id) => id !== userId);
      });
    });

    return () => {
      socket.off("messages");
      // socket.off(eventKey);
    };
  }, [socket, chatId]);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (text: string) => {
    if (!socket) return;

    // user started typing
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { chatId, isTyping: true });
    }

    // clear any existing timeout
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // if no typing for 1.5s, mark as stopped
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { chatId, isTyping: false });
    }, 1000) as any;
  };

  const sendImage = async () => {
    const url = await onImageLoaded(imageURL);
    if (imageURL.trim()) {
      if (socket) {
        socket.emit("send_message", {
          chatId: chatData?.id ?? "",
          senderId: profile?.id ?? "",
          recipientId: member?.id ?? "",
          content: message,
          media: [url],
        });
      }
      setImageURL("");
    }
  };

  const sendMessage = async () => {
    const url = imageURL ? await onImageLoaded(imageURL) : "";
    if (message.trim() || url) {
      if (socket) {
        socket.emit("send_message", {
          chatId: chatData?.id ?? "",
          senderId: profile?.id ?? "",
          recipientId: member?.id ?? "",
          content: message.trim(),
          media: url ? [url] : [],
        });
      }
      setMessage("");
      setImageURL("");
    }
  };

  // if (!chat) {
  //   return <LoaderActivity />;
  // }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: THEME.colors.background,
      }}
    >
      {member ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={{ flex: 1 }}>
            {/* ✅ Chat header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
              }}
            >
              <Pressable
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                onPress={() =>
                  router.push({
                    pathname: "/main/(profile)/view-profile",
                    params: {
                      user: JSON.stringify(member.user),
                    },
                  })
                }
              >
                <TouchableOpacity onPress={() => router.back()}>
                  <ChevronLeft color={THEME.colors.text} size={24} />
                </TouchableOpacity>

                {member?.user?.avatar_url && (
                  <Avatar
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "#c3adef",
                      marginRight: 12,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    avatar_url={member?.user?.avatar_url}
                    width={40}
                    height={40}
                  />
                )}

                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "500",
                      color: THEME.colors.text,
                    }}
                  >
                    {member?.user.name}
                  </Text>
                  {typingUserIds.length > 0 && (
                    <Text
                      style={{
                        fontStyle: "italic",
                        color: THEME.colors.text,
                        fontSize: 12,
                      }}
                    >
                      Typing...
                    </Text>
                  )}
                </View>
              </Pressable>

              <View
                style={{ flexDirection: "row", gap: 20, alignItems: "center" }}
              >
                <TouchableOpacity onPress={handleCapture}>
                  <Zap color={THEME.colors.text} size={28} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Search color={THEME.colors.text} size={28} />
                </TouchableOpacity>
              </View>
            </View>

            {/* ✅ Chat messages */}
            <ViewShot
              style={{ flex: 1, backgroundColor: THEME.colors.background }}
              ref={viewShotRef}
              options={{ fileName: "Zilt-Shot", format: "jpg", quality: 0.9 }}
            >
              <FlatList
                data={messages}
                keyExtractor={(item) =>
                  item.id?.toString() ?? Math.random().toString()
                }
                renderItem={({ item }) => <ChatMessage message={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                inverted
              />
            </ViewShot>

            {/* ✅ Floating input section */}
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
                  onPress={sendMessage}
                >
                  <Send color={THEME.colors.text} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View />
      )}
    </SafeAreaView>
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
    // height: 30,
    paddingVertical: 10,
    paddingLeft: 8,
  },
});
