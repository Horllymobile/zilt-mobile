import ChatRequestItem from "@/components/ChatRequestItem";
import ChatSkeletonList from "@/components/ChatSkeletonList";
import EmptyState from "@/components/EmptyState";
import { Chat } from "@/models/chat";
import { IApiResponse } from "@/models/response";
import { useSocket } from "@/shared/hooks/use-socket";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, View } from "react-native";

export default function RequestPage() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = Dimensions.get("window");

  const [chats, setChats] = useState<Chat[]>([]);

  const handleRequests = (res: IApiResponse<Chat[]>) => {
    console.log("Handle Requests", res);
    setChats(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit("get_chat_requests", { page: 1, size: 10 });

    socket.on("requests", handleRequests);

    return () => {
      socket.off("requests", handleRequests);
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
          renderItem={({ item }) => <ChatRequestItem chat={item} />}
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
          label="No Chat Requests."
          // trigger={
          //   <TouchableOpacity
          //     style={{
          //       backgroundColor: THEME.colors.primary,
          //       paddingHorizontal: 20,
          //       paddingVertical: 10,
          //       borderRadius: 50,
          //       height: 50,
          //       width: 50,
          //       flexDirection: "row",
          //       alignItems: "center",
          //       justifyContent: "center",
          //     }}
          //     onPress={() => router.push("/main/(profile)/add-friend")}
          //   >
          //     <MessageCirclePlus color={THEME.colors.text} />
          //   </TouchableOpacity>
          // }
        />
      )}
    </>
  );
}
