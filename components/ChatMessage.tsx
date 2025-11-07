import { useAuthStore } from "@/libs/store/authStore";
import { timeAgo } from "@/libs/utils/lib";
import { Message } from "@/models/chat";
import { COLORS } from "@/shared/constants/color";
import { Image, Text, View } from "react-native";

export default function ChatMessage({ message }: { message: Message }) {
  const { profile } = useAuthStore();
  const isSender = message?.senderId === profile?.id;
  return (
    <View
      style={{
        alignSelf: isSender ? "flex-end" : "flex-start",
        backgroundColor: isSender ? "#2C057A" : "#f0f0f0",
        borderRadius: 16,
        marginVertical: 4,
        marginHorizontal: 10,
        padding: 10,
        maxWidth: "75%",
      }}
    >
      {message?.content && (
        <View>
          {message.content && (
            <Text
              style={{
                color: isSender ? "#fff" : "#000",
                fontSize: 16,
              }}
            >
              {message.content}
            </Text>
          )}
        </View>
      )}

      {message?.media?.length > 0 && (
        <View>
          {message.media[0] && (
            <Image
              source={{ uri: message.media[0] }}
              width={200}
              height={300}
            />
          )}
        </View>
      )}
      <View
        style={{
          alignItems: "flex-end",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: !isSender ? COLORS.primary : COLORS.white,
            fontSize: 12,
          }}
        >
          {timeAgo(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
