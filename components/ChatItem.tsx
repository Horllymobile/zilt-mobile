import { useAuthStore } from "@/libs/store/authStore";
import { getColorFromString } from "@/libs/utils/colors";
import { timeAgo } from "@/libs/utils/lib";
import { Chat } from "@/models/chat";
import { THEME } from "@/shared/constants/theme";
import { socketService } from "@/shared/services/socket";
import { router } from "expo-router";
import { Image } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "./Avatar";

export default function ChatItem({ chat }: { chat: Chat }) {
  const { profile } = useAuthStore();
  const member = chat?.members.find((user) => user?.userId !== profile?.id);

  const socket = socketService?.getSocket();
  const readMessage = () => {
    if (
      chat?.lastMessage &&
      !chat?.lastMessage?.seen &&
      socket &&
      profile?.id !== member?.id
    ) {
      socket.emit("read_message", chat.lastMessageId);
    }
  };

  const unSeenMessages = chat.messages.filter(
    (msg) => !msg.seen && msg.senderId !== profile?.id
  );

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
        return prev.filter((id) => id !== userId);
      });
    });

    // return () => {
    //   socket.off(eventKey);
    // };
  }, [socket, chatId]);

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
      onPress={() => {
        readMessage();
        router.push({
          pathname: `/main/(chats)/message`,
          params: {
            person: JSON.stringify(member?.user),
          },
        });
      }}
    >
      {member?.user?.avatar_url ? (
        <Avatar
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: getColorFromString(member?.user?.name),
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
      <View style={{ flex: 1 }}>
        {member?.user?.name ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: THEME.colors.text,
            }}
          >
            {member?.user?.name}
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

        {chat?.lastMessage?.media?.length ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 3,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Image size={18} />
            <Text
              style={{
                fontSize: 12,
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
            {timeAgo(chat.lastMessage?.createdAt)}
          </Text>
        ) : undefined}

        {typingUserIds.length > 0 && (
          <Text
            style={{
              fontStyle: "italic",
              fontWeight: "600",
              color: THEME.colors.text,
              marginBottom: 4,
              fontSize: 12,
            }}
          >
            {!typingUserIds.includes(member?.id ?? "") ? `Typing...` : null}
          </Text>
        )}

        {unSeenMessages.length ? (
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 50,
              marginTop: 4,
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
              {unSeenMessages.length}
            </Text>
          </View>
        ) : undefined}
      </View>
    </TouchableOpacity>
  );
}
