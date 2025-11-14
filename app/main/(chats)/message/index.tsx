"use client";

import { Avatar } from "@/components/Avatar";
import ChatMessage from "@/components/ChatMessage";
import MessageBox from "@/components/MessageBox";
import { updateChatStatus } from "@/db/chat.service";
import {
  generateChatId,
  saveMessage,
  updateMessageSeenStatus,
  updateMessageStatus,
} from "@/db/message.service";
import {
  removeOutboxMessage,
  saveOutboxMessage,
  updateOutxoxStatus,
} from "@/db/outbox.service";
import { useAuthStore } from "@/libs/store/authStore";
import { useChatStore } from "@/libs/store/chatStore";
import { useMessageStore } from "@/libs/store/messageStore";
import { supabase } from "@/libs/superbase";
import { MessageDto } from "@/models/chat";
import { ILocalChatProfile } from "@/models/local-chat";
import { THEME } from "@/shared/constants/theme";
import useLoadMessages from "@/shared/hooks/use-chat-messages";
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
  const socket = useSocket();

  const pathname = usePathname();
  const { profile } = useAuthStore();

  const { person, chatId } = useLocalSearchParams();

  // console.log("chatItem", chatItem);

  const router = useRouter();

  const { setChatData } = useChatStore();
  const {
    messages,
    setMessageData,
    chatId: storeChatId,
    chat,
  } = useMessageStore();

  const [currentChatId, setCurrentChatId] = useState(
    (chatId as string) || storeChatId || chat?.id
  );

  useLoadMessages(currentChatId ?? "");

  // const { data: chat } = useGetChatQuery(false);
  const member = JSON.parse(person as any) as ILocalChatProfile;

  // const navigation = useNavigation<ChatScreenNav>();

  const viewShotRef = useRef<ViewShot | null>(null);

  // const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  useEffect(() => {
    if (!messages?.length) return;

    messages.forEach(async (msg) => {
      if (msg.status === "SENDING" && !msg.seen) {
        console.log("Messages Changes", msg);
        socket?.emit("read_message", msg.id);
        await updateMessageSeenStatus(msg.id);
        await updateMessageStatus(msg.id, "DELIVERED");
        setMessageData({
          refetch: true,
          fetching: false,
        });
      }
    });
  }, [messages]);

  const [message, setMessage] = useState("");
  const [imageURL, setImageURL] = useState("");

  const isMine = profile?.id === chat?.lastMessage?.senderId;

  const canRead = chat?.lastMessage && !chat?.lastMessage?.seen && !isMine;

  const handleReadMessage = async (res: string) => {
    try {
      await updateMessageStatus(res, "SEEN");
      const msg = await updateMessageSeenStatus(res);

      if (currentChatId) {
        console.log(`${profile?.name} Saved message`, msg);
        setChatData({
          fetching: false,
          refetch: true,
        });
        setMessageData({
          fetching: false,
          refetch: true,
        });
      }
    } catch (error) {
      console.log("HandleNew Messages Error", error);
    }
  };

  const handleAcceptedChat = async (chatId: string) => {
    console.log("Handle Accepted Chat", chatId);
    try {
      await updateChatStatus(chatId, "ACCEPTED");

      setChatData({ refetch: true, fetching: false });
      setMessageData({
        fetching: false,
        refetch: true,
      });
    } catch (error) {
      // Alert.alert(`Can't accept request now try again letter`);
    }
  };

  const handleRejectedChat = async (chatId: string) => {
    try {
      await updateChatStatus(chatId, "REJECTED");
      setChatData({ refetch: true, fetching: false });
      setMessageData({
        fetching: false,
        refetch: true,
      });
    } catch (error) {
      Alert.alert(`Can't accept request now try again letter`);
    }
  };

  const handleDeliveredMessages = async (res: {
    messageId: string;
    chatId: string;
  }) => {
    try {
      console.log("Handle Delivered Messages", res);
      await removeOutboxMessage(res.messageId);
      const succuess = await updateMessageStatus(res.messageId, "DELIVERED");
      console.log("Delivered", succuess);
      if (succuess) {
        setMessageData({
          fetching: false,
          refetch: true,
        });
        setChatData({
          fetching: false,
          refetch: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendingMessages = async (res: {
    messageId: string;
    chatId: string;
  }) => {
    try {
      console.log("Handle Sent Messages", res);

      await updateOutxoxStatus(res.messageId, "SENDING");
      const success = await updateMessageStatus(res.messageId, "SENDING");

      if (success) {
        setMessageData({
          fetching: false,
          refetch: true,
        });
        setChatData({
          fetching: false,
          refetch: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // socket.emit("get_chats", { page: 1, size: 10 });

    // socket.on("message:new", handleNewMessages);
    socket.on("message:read", handleReadMessage);
    socket.on("message:delivered", handleDeliveredMessages);
    socket.on("message:sending", handleSendingMessages);

    socket.on("chat:accepted", handleAcceptedChat);
    socket.on("chat:rejected", handleRejectedChat);

    const typingEventKey = `chat:${chatId}:typing`;

    socket.emit("join_chat", { chatId });

    socket.on("chat:joined", ({ roomId, userId }) => {
      console.log(`User ${userId} Joined Chat`, roomId);
    });

    console.log("Typing Event Key", typingEventKey);
    const room = `chat:${chatId}`;
    socket.on(typingEventKey, ({ userId, isTyping }) => {
      console.log(`User ${userId} is typing`);

      setTypingUserIds((prev) => {
        if (isTyping && userId !== profile?.id) {
          return [...new Set([...prev, userId])];
        }
        return prev.filter((id) => id !== userId);
      });
    });

    return () => {};
  }, [socket]);

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

    return publicUrl.publicUrl;
  };

  const readMessage = (msgId: string) => {
    if (msgId && canRead) {
      console.log("");
      socket?.emit("read_message", msgId);
    }
  };

  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (text: string) => {
    if (!socket) return;

    // user started typing
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { chatId: currentChatId.id, isTyping: true });
    }

    // clear any existing timeout
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // if no typing for 1.5s, mark as stopped
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { chatId: currentChatId.id, isTyping: false });
    }, 1000) as any;
  };

  const sendMessage = async () => {
    try {
      if (!profile) return;

      const chatId = generateChatId(profile.id, member.id);
      const image = imageURL ? await onImageLoaded(imageURL) : "";
      const content = message.trim();

      if (!content && !image) return;

      // 1️⃣ Save message locally
      const saved = await saveMessage({
        chatId,
        sender: {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar || profile.avatar_url || "",
        },
        recipient: {
          id: member.id,
          name: member.name,
          avatar: member.avatar_url || "",
        },
        content,
        media: image ? [image] : [],
      });

      console.log("Saved", saved);

      // IMPORTANT: saved.msgId must exist
      const localMessageId = saved?.msgId;

      if (localMessageId) {
        // 2️⃣ Save to outbox BEFORE sending
        await saveOutboxMessage({
          localId: localMessageId ?? "",
          chatId,
          senderId: profile.id,
          content,
          media: image ? JSON.stringify([image]) : undefined,
        });

        // 3️⃣ Build the payload to send to server
        const payload: MessageDto = {
          chatId,
          messageId: localMessageId ?? "",
          senderId: profile.id,
          recipientId: member.id,
          content,
          media: image ? JSON.stringify([image]) : undefined,
        };

        // 4️⃣ Emit to socket
        if (socket) {
          socket.emit("send_message", payload);
          // 5️⃣ Reset UI inputs
          setMessage("");
          setImageURL("");
          setChatData({
            fetching: false,
            refetch: true,
          });
          setMessageData({
            fetching: false,
            refetch: true,
          });
        }
      }
    } catch (error) {
      console.warn("sendMessage error:", error);
    }
  };

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

                {(member?.avatar || member.avatar_url) && (
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
                    avatar_url={member.avatar || member.avatar_url || ""}
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
