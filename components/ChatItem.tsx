import {
  updateMessageSeenStatus,
  updateMessageStatus,
} from "@/db/message.service";
import { useAuthStore } from "@/libs/store/authStore";
import { useChatStore } from "@/libs/store/chatStore";
import { getColorFromString } from "@/libs/utils/colors";
import { timeAgo } from "@/libs/utils/lib";
import { ILocalChat } from "@/models/local-chat";
import { THEME } from "@/shared/constants/theme";
import { socketService } from "@/shared/services/socket";
import { router } from "expo-router";
import { Check, CheckCheckIcon, Image } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "./Avatar";

export default function ChatItem({ chat }: { chat: ILocalChat }) {
  const { profile } = useAuthStore();
  const { setChatData } = useChatStore();
  const member = chat?.chat_members.find(
    (user) => user?.userId !== profile?.id
  )?.profile;

  const isSender = profile?.id === chat?.lastMessage?.senderId;

  const socket = socketService?.getSocket();
  const canRead = chat?.lastMessage && !chat?.lastMessage?.seen && !isSender;
  const readMessage = async () => {
    if (canRead && socket) {
      socket.emit("read_message", {
        messageId: chat.lastMessageId,
        senderId: chat?.lastMessage?.senderId,
      });
      await updateMessageSeenStatus(chat.lastMessageId);
      await updateMessageStatus(chat.lastMessageId, "DELIVERED");
      setChatData({
        refetch: true,
        fetching: true,
      });
    }
  };

  const unSeenMessages =
    chat?.messages?.filter(
      (msg) => !msg.seen && msg.senderId !== profile?.id
    ) || [];

  const isNotSeen =
    chat?.lastMessage?.senderId !== profile?.id && !chat?.lastMessage?.seen;

  const chatId = chat.id;

  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);

  // console.log("Members", chat.members);

  useEffect(() => {
    // SocketService.connect();
    if (!socket) return;

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

    // return () => {
    //   socket.off(eventKey);
    // };
  }, [socket, chatId]);

  const notMyTypeings = typingUserIds.filter((id) => id !== profile?.id);

  const chatMedia = JSON.parse(chat?.lastMessage?.media || "[]");

  // console.log("Member", member);

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
            person: JSON.stringify(member),
            chatId: chatId,
          },
        });
      }}
    >
      {member?.avatar || member?.avatar_url ? (
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
          avatar_url={member?.avatar || member?.avatar_url || ""}
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

        {chatMedia?.length ? (
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
                fontWeight: isNotSeen ? "600" : "200",
                color: THEME.colors.text,
              }}
            >
              Photo
            </Text>
          </View>
        ) : undefined}
      </View>
      {chat.status === "ACCEPTED" && (
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

          {isSender ? (
            <>
              {chat?.lastMessage?.status === "SENDING" ? (
                <ActivityIndicator size={"small"} color={THEME.colors.text} />
              ) : null}

              {chat?.lastMessage?.status === "SENT" ? (
                <Check size={"small"} color={THEME.colors.surface} />
              ) : null}

              {chat?.lastMessage?.status === "DELIVERED" ? (
                <CheckCheckIcon size={"small"} color={THEME.colors.surface} />
              ) : null}
            </>
          ) : null}

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
      )}

      {/* {isSender ? (
        <>
          {chat.lastMessage?.status === "SENDING" ? (
            <ActivityIndicator size={"small"} color={THEME.colors.text} />
          ) : null}

          {chat.lastMessage?.status === "SENT" ? (
            <Check size={"small"} color={THEME.colors.surface} />
          ) : null}

          {chat.lastMessage?.status === "DELIVERED" ? (
            <CheckCheckIcon size={"small"} color={THEME.colors.surface} />
          ) : null}
        </>
      ) : null} */}

      {chat.status === "PENDING" ? (
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
            Requested
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
