"use client";

import { Avatar } from "@/components/Avatar";
import ChatMessage from "@/components/ChatMessage";
import MessageBox from "@/components/MessageBox";
import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { Chat, Message } from "@/models/chat";
import { Profile } from "@/models/profile";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { File } from "expo-file-system";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { ChevronLeft, Search } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
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

  const { person, chat: chatItem } = useLocalSearchParams();

  // console.log("chatItem", chatItem);

  const router = useRouter();

  // const chatData = JSON.parse(chat as string) as Chat;

  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | undefined>(
    chatItem ? JSON.parse(chatItem as string) : undefined
  );

  // const { data: chat } = useGetChatQuery(false);
  const [chatId, setChatId] = useState(chat?.id);
  const member = JSON.parse(person as any) as Profile;

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

    const typingEventKey = `chat:${chatId}:typing`;

    socket.on("chat", (chat: Chat) => {
      // console.log("Got Chat", chat);
      setChat(chat);
      setChatId(chat?.id);
    });

    if (chatId) {
      socket.emit("join_chat", { chatId });

      socket.emit("get_messages", {
        chatId,
        page: 1,
        size: 10,
        members: [profile?.id, member.id],
      });

      socket.on("messages", (msgs: Message[]) => {
        setMessages(msgs);

        if (msgs?.length) {
          const unseens = unSeenMsgs(msgs);

          unseens.forEach((msg) => {
            if (msg && profile?.id !== msg?.senderId) {
              readMessage(msg.id);
            }
          });
        }
      });

      socket.on("chat:joined", ({ roomId }) => {
        console.log("Joined Chat", roomId);
      });

      socket.on("chat", (chat: Chat) => {
        console.log("Got Chat", chat);
        setChat(chat);
      });

      socket.on(typingEventKey, ({ userId, isTyping }) => {
        console.log(`User ${userId} is typing`);

        // console.log("Am I typing", userId === profile?.id);
        setTypingUserIds((prev) => {
          if (isTyping && userId !== profile?.id) {
            return [...new Set([...prev, userId])];
          }
          return prev.filter((id) => id !== userId);
        });
      });
    }

    return () => {
      socket.off("messages");
      socket.off("chat");
      // socket.off("chat:joined");
      // socket.off(typingEventKey);
    };
  }, [socket, chat]);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (text: string) => {
    if (!socket) return;

    // user started typing
    if (!isTyping) {
      console.log("handleTyping");
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

  const sendMessage = async () => {
    const url = imageURL ? await onImageLoaded(imageURL) : "";
    if (message.trim() || url) {
      if (socket) {
        socket.emit("send_message", {
          chatId,
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

  const isMe = member.id === profile?.id;

  const notMyTypeings = typingUserIds.filter((id) => id !== profile?.id);

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
                      user: JSON.stringify(member),
                    },
                  })
                }
              >
                <TouchableOpacity onPress={() => router.back()}>
                  <ChevronLeft color={THEME.colors.text} size={24} />
                </TouchableOpacity>

                {member?.avatar_url && (
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
                    avatar_url={member?.avatar_url}
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
                    {member.name}
                  </Text>
                  {notMyTypeings.length > 0 ? (
                    <Text
                      style={{
                        fontStyle: "italic",
                        color: THEME.colors.text,
                        fontSize: 12,
                      }}
                    >
                      Typing...
                    </Text>
                  ) : null}
                </View>
              </Pressable>

              <View
                style={{ flexDirection: "row", gap: 20, alignItems: "center" }}
              >
                {/* <TouchableOpacity onPress={handleCapture}>
                  <Zap color={THEME.colors.text} size={28} />
                </TouchableOpacity> */}
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
            <MessageBox
              handleTyping={(typing) => handleTyping(typing)}
              imageURL={imageURL}
              message={message}
              onSend={sendMessage}
              setImageURL={setImageURL}
              setMessage={setMessage}
            />
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
