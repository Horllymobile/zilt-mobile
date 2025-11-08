import { useAuthStore } from "@/libs/store/authStore";
import { getColorFromString } from "@/libs/utils/colors";
import { timeAgo } from "@/libs/utils/lib";
import { Chat } from "@/models/chat";
import { COLORS } from "@/shared/constants/color";
import { socketService } from "@/shared/services/socket";
import { router } from "expo-router";
import { Image } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "./Avatar";

export default function ChatItem({ chat }: { chat: Chat }) {
  const { profile } = useAuthStore();
  const member = chat?.members.find((user) => user?.userId !== profile?.id);

  const socket = socketService?.getSocket();
  const readMessage = () => {
    if (chat?.lastMessage && !chat?.lastMessage?.seen && socket) {
      socket.emit("read_message", chat.lastMessageId);
    }
  };

  const unSeenMessages = chat.messages.filter(
    (msg) => !msg.seen && msg.senderId !== profile?.id
  );

  const isNotSeen =
    chat?.lastMessage?.senderId !== profile?.id && !chat?.lastMessage?.seen;

  const isSender = chat?.lastMessage?.senderId === profile?.id;

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
        router.push(`/main/(chats)/${chat.id}`);
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
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {member?.user?.name}
          </Text>
        ) : undefined}

        {chat?.lastMessage?.content ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: isNotSeen ? "600" : "200",
              marginTop: 5,
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
              color: isNotSeen ? COLORS.primary : "#999",
              marginLeft: 8,
            }}
          >
            {timeAgo(chat.lastMessage?.createdAt)}
          </Text>
        ) : undefined}

        {unSeenMessages.length ? (
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 50,
              marginTop: 4,
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "600",

                color: COLORS.white,
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
