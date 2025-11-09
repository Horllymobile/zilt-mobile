import { useAuthStore } from "@/libs/store/authStore";
import { timeAgo } from "@/libs/utils/lib";
import { Message } from "@/models/chat";
import { THEME } from "@/shared/constants/theme";
import { Eye, EyeOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function ChatMessage({ message }: { message: Message }) {
  const { profile } = useAuthStore();
  const isSender = message?.senderId === profile?.id;
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );

  useEffect(() => {
    if (message?.media?.[0]) {
      Image.getSize(message.media[0], (width, height) => {
        const maxWidth = screenWidth * 0.7; // max width 70% of screen
        const maxHeight = 400; // max height limit
        let newWidth = width;
        let newHeight = height;

        // scale down proportionally if too big
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (height / width) * newWidth;
        }
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (width / height) * newHeight;
        }

        setImageSize({ width: newWidth, height: newHeight });
      });
    }
  }, [message?.media]);

  return (
    <View
      style={{
        alignSelf: isSender ? "flex-end" : "flex-start",
        backgroundColor: isSender
          ? THEME.colors.primary
          : THEME.colors.inverseOnSurface,
        borderRadius: 16,
        marginVertical: 4,
        marginHorizontal: 10,
        padding: 10,
        maxWidth: "75%",
      }}
    >
      {message?.media?.length > 0 && message.media[0] && (
        <Image
          source={{ uri: message.media[0] }}
          style={{
            width: imageSize.width,
            height: imageSize.height,
            borderRadius: 10,
            marginBottom: message?.content ? 8 : 0,
          }}
          resizeMode="contain"
        />
      )}

      {message?.content && (
        <Text
          style={{
            color: isSender ? THEME.colors.text : THEME.colors.primary,
            fontSize: 16,
          }}
        >
          {message.content}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          alignSelf: "flex-end", // this makes it stick to the right edge of the bubble
        }}
      >
        {isSender ? (
          <>
            {message.seen ? (
              <Eye color={THEME.colors.text} size={12} />
            ) : (
              <EyeOff color={THEME.colors.text} size={12} />
            )}
          </>
        ) : null}
        <Text
          style={{
            color: isSender ? THEME.colors.text : THEME.colors.background,
            fontSize: 10,
            marginLeft: 4,
          }}
        >
          {timeAgo(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
