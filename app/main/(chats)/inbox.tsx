import ChatItem from "@/components/ChatItem";
import ChatRequestItem from "@/components/ChatRequestItem";
import ChatSkeletonList from "@/components/ChatSkeletonList";
import EmptyState from "@/components/EmptyState";
import { useAuthStore } from "@/libs/store/authStore";
import { Chat } from "@/models/chat";
import { IApiResponse } from "@/models/response";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { MessageCirclePlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";

export default function InboxPage() {
  const { profile } = useAuthStore();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(true);

  const [chats, setChats] = useState<Chat[]>([]);

  const handleChats = (res: IApiResponse<Chat[]>) => {
    console.log("Handle Chats", res);
    setChats(res?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_chats", { page: 1, size: 10 });

    socket.on("chats", handleChats);

    return () => {
      socket.off("chats", handleChats);
    };
  }, [socket]);

  return (
    <>
      {isLoading ? (
        <ScrollView style={{ flex: 1 }}>
          <ChatSkeletonList items={8} />
        </ScrollView>
      ) : chats?.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(chat) => chat.id}
          renderItem={({ item }) => {
            if (item.status === "ACTIVE") return <ChatItem chat={item} />;
            else if (
              item.status === "PENDING" &&
              profile?.id === item.createdBy
            )
              return <ChatItem chat={item} />;
            else return <ChatRequestItem chat={item} />;
          }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 10,
            paddingBottom: tabBarHeight + 10, // dynamic, perfect fit
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false} // 👈 disables auto insets on iOS
          contentInsetAdjustmentBehavior="never"
        />
      ) : (
        <EmptyState
          label="No Chats. Add contact to start one!"
          trigger={
            <TouchableOpacity
              style={{
                backgroundColor: THEME.colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 50,
                height: 50,
                width: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => router.push("/main/(profile)/add-friend")}
            >
              <MessageCirclePlus color={THEME.colors.text} />
            </TouchableOpacity>
          }
        />
      )}
    </>
  );
}
