import { updateChatStatus } from "@/db/chat.service";
import { useAuthStore } from "@/libs/store/authStore";
import { useChatStore } from "@/libs/store/chatStore";
import { getColorFromString } from "@/libs/utils/colors";
import { timeAgo } from "@/libs/utils/lib";
import { ILocalChat } from "@/models/local-chat";
import { THEME } from "@/shared/constants/theme";
import { socketService } from "@/shared/services/socket";
import { router } from "expo-router";
import { Image, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "./Avatar";

export default function ChatRequestItem({
  chat,
  refetchChat,
}: {
  chat: ILocalChat;
  refetchChat: () => void;
}) {
  const { profile } = useAuthStore();
  const member = chat?.chat_members.find(
    (user) => user?.userId !== profile?.id
  )?.profile;

  const { setChatData } = useChatStore();

  const socket = socketService?.getSocket();
  const [showRequestMenu, setShowRequestMenu] = useState(false);

  const unSeenMessages =
    chat?.messages?.filter(
      (msg) => !msg.seen && msg.senderId !== profile?.id
    ) || [];

  const isNotSeen =
    chat?.lastMessage?.senderId !== profile?.id && !chat?.lastMessage?.seen;

  const isSender = chat?.lastMessage?.senderId === profile?.id;

  const chatId = chat.id;

  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);

  // console.log("Members", chat.members);

  useEffect(() => {
    // SocketService.connect();
    if (!socket) return;

    const eventKey = `chat:${chatId}:typing`;

    socket.emit("join_chat", { chatId });

    socket.on("chat:joined", ({ roomId, userId }) => {
      // console.log("Joined Chat", roomId);
    });

    socket.on(eventKey, ({ userId, isTyping }) => {
      // console.log(`User ${userId} is typing`);

      setTypingUserIds((prev) => {
        if (isTyping) return [...new Set([...prev, userId])];
        return prev?.filter((id) => id !== userId);
      });
    });

    // return () => {
    //   socket.off(eventKey);
    // };
  }, [socket, chatId]);

  const handleAcceptChat = async () => {
    if (!socket) return;

    try {
      const acceptChat = await updateChatStatus(chatId, "ACCEPTED");

      if (acceptChat) {
        setShowRequestMenu(false);
        socket.emit("accept_requests", { chatId, recipientId: member?.id });
        refetchChat();
        router.replace({
          pathname: `/main/(dashboard)`,
        });
      }
    } catch (error) {
      Alert.alert(`Can't accept request now try again letter`);
    }
  };

  const handleRejectedChat = async () => {
    if (!socket) return;

    try {
      const rejectChat = await updateChatStatus(chatId, "REJECT");

      if (rejectChat) {
        setShowRequestMenu(false);
        socket.emit("reject_requests", { chatId, recipientId: profile?.id });
        // router.dismissAll();
        refetchChat();
        router.replace({
          pathname: `/main/(dashboard)`,
        });
      }
    } catch (error) {
      Alert.alert(`Can't accept request now try again letter`);
    }
    // if (!socket) return;
    // socket.emit("reject_requests", { chatId, recipientId: profile?.id });
  };

  const chatMedia = JSON.parse(chat?.lastMessage?.media || "[]");
  console.log("Chat Media", chatMedia);

  return (
    <TouchableOpacity
      touchSoundDisabled={true}
      style={{
        flexDirection: "row",
        alignItems: "center",
        opacity: 1,
        padding: 12,
        borderRadius: 0,
      }}
      onPress={() => setShowRequestMenu(true)}
    >
      {member?.avatar ? (
        <Avatar
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: getColorFromString(member?.name),
            overflow: "hidden",
            marginRight: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
          avatar_url={member?.avatar}
          width={50}
          height={50}
        />
      ) : undefined}
      <View style={{ flex: 1 }}>
        {member?.name ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: THEME.colors.text,
            }}
          >
            {member?.name}
          </Text>
        ) : undefined}

        {chat?.lastMessage?.content ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: isNotSeen ? "600" : "200",
              marginTop: 5,
              color: THEME.colors.text,
            }}
          >
            {isSender
              ? `You: ${chat.lastMessage?.content}`
              : `${chat.lastMessage?.content}`}
          </Text>
        ) : undefined}

        {chatMedia.length > 0 ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 3,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Image size={18} color={THEME.colors.text} />
            <Text
              style={{
                fontSize: 12,
                color: THEME.colors.text,
                fontWeight: isNotSeen ? "600" : "200",
              }}
            >
              Photo
            </Text>
          </View>
        ) : undefined}
      </View>
      <View style={{ alignItems: "flex-end" }}>
        {chat?.lastMessage?.createdAt ? (
          <Text
            style={{
              fontSize: 12,
              color: THEME.colors.text,
              marginLeft: 8,
            }}
          >
            {timeAgo(new Date(chat.lastMessage?.createdAt).toISOString())}
          </Text>
        ) : undefined}

        {!isSender ? (
          <View
            style={{
              borderRadius: 50,
              marginTop: 4,
              padding: 5,
              backgroundColor: THEME.colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "600",
                color: THEME.colors.text,
              }}
            >
              Request
            </Text>
          </View>
        ) : null}
      </View>

      {/* Buy Coin Bottom Sheet */}
      <Modal
        visible={showRequestMenu}
        allowSwipeDismissal
        animationType="slide"
        transparent
        onDismiss={() => setShowRequestMenu(false)}
        onRequestClose={() => setShowRequestMenu(false)}
      >
        <Pressable
          onPress={() => setShowRequestMenu(false)}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: THEME.colors.background,
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: "center",
              position: "relative",
            }}
          >
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: THEME.colors.text,
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                A New Message Request
              </Text>

              <Pressable
                onPress={() => setShowRequestMenu(false)}
                style={{ position: "absolute", top: 1, right: 5 }}
              >
                <X color={THEME.colors.text} />
              </Pressable>
            </View>

            <View style={{ gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: THEME.colors.surface,
                  padding: 15,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={() => handleAcceptChat()}
              >
                <Text style={{ color: THEME.colors.text, fontWeight: "600" }}>
                  Accept
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: THEME.colors.error,
                  padding: 15,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={() => handleRejectedChat()}
              >
                <Text style={{ color: THEME.colors.text, fontWeight: "600" }}>
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
}
