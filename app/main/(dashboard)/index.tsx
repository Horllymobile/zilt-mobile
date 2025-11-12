"use client";
import ChatItem from "@/components/ChatItem";
import ChatSkeletonList from "@/components/ChatSkeletonList";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { useAuthStore } from "@/libs/store/authStore";
import { Chat } from "@/models/chat";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { MessageCirclePlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chats() {
  const tabBarHeight = useBottomTabBarHeight();
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = Dimensions.get("window");

  const [chats, setChats] = useState<Chat[]>([]);

  const { session, profile } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (!profile) return; // wait for profile to load
    if (profile && !profile.onboarded) {
      router.push("/onboarding");
    }
  }, [profile]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_chats", { page: 1, size: 10 });

    const handleChats = (res: any) => {
      setChats(res.data);
      setIsLoading(false);
    };

    socket.on("chats", handleChats);

    return () => {
      socket.off("chats", handleChats);
    };
  }, [socket]);

  // if (!chats) return ;

  return (
    <SafeAreaView
      // edges={["top"]}
      style={{
        flex: 1,
        // justifyContent: "center",
        backgroundColor: THEME.colors.background,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          // paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            color: THEME.colors.text,
          }}
        >
          ZiltChat
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/main/(profile)/add-friend")}
        >
          <MessageCirclePlus color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        width={width}
        text=""
        placeholder={"Search messages or users"}
      />

      {/* Content */}
      {isLoading ? (
        <ScrollView style={{ flex: 1 }}>
          <ChatSkeletonList items={8} />
        </ScrollView>
      ) : chats?.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(chat) => chat.id}
          renderItem={({ item }) => <ChatItem chat={item} />}
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
    </SafeAreaView>
  );
}
