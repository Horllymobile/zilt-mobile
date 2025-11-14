import { useAuthStore } from "@/libs/store/authStore";
import { timeAgo } from "@/libs/utils/lib";
import { ILocalMessage } from "@/models/local-chat";
import { THEME } from "@/shared/constants/theme";
import { CheckCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function ChatMessage({ message }: { message: ILocalMessage }) {
  const { profile } = useAuthStore();
  const isSender = message?.senderId === profile?.id;
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );

  const media = JSON.parse(message.media) || [];
  // console.log("media", media);
  useEffect(() => {
    if (media.length) {
      console.log("media", media);
      Image.getSize(media[0], (width, height) => {
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
  }, [media]);

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
      {media?.length > 0 && media[0] && (
        <Image
          source={{ uri: media[0] }}
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
            {message.status === "SENDING" ? (
              <ActivityIndicator size={"small"} color={THEME.colors.text} />
            ) : null}

            {message.status === "DELIVERED" ? (
              <CheckCheck size={12} color={THEME.colors.text} />
            ) : null}

            {message.status === "SEEN" ? (
              <CheckCheck size={12} color={"green"} />
            ) : null}
          </>
        ) : null}
        <Text
          style={{
            color: isSender ? THEME.colors.text : THEME.colors.background,
            fontSize: 10,
            marginLeft: 4,
          }}
        >
          {timeAgo(new Date(message.createdAt).toISOString())}
        </Text>
      </View>
    </View>
  );
}
