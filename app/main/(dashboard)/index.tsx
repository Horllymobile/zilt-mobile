"use client";
import ChatItem from "@/components/ChatItem";
import { useAuthStore } from "@/libs/store/authStore";
import { Chat } from "@/models/chat";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
import { useRouter } from "expo-router";
import { MessageCirclePlus, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chats() {
  const socket = useSocket();
  const { width, height } = Dimensions.get("window");

  const [chats, setChats] = useState<Chat[]>([]);

  const { session } = useAuthStore();
  const router = useRouter();

  // if (!session) {
  //   return <Redirect href={"/(auth)/login"} />;
  // }

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_chats", { page: 1, size: 10 });

    const handleChats = (res: any) => setChats(res.data);

    socket.on("chats", handleChats);

    return () => {
      socket.off("chats", handleChats);
    };
  }, [socket]);

  // if (!chats) return <ActivityIndicator size={"large"} />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: THEME.colors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "medium",
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
        {/* <TouchableOpacity onPress={refresh}>
          <Loader />
        </TouchableOpacity> */}
      </View>
      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
        <View
          className="relative"
          style={{
            borderWidth: 0.5,
            borderRadius: 30,
            backgroundColor: THEME.colors.text,
            borderColor: THEME.colors.background,

            marginTop: 10,
            padding: 10,
            height: 46,
            width: width - 20,
            position: "relative",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <Search style={{ position: "absolute", left: 12, top: 12 }} />
          <TextInput
            style={{
              fontSize: 16,
              width: width,
              borderWidth: 0,
              borderRadius: 0,
              height: 46,
              paddingLeft: 30,
            }}
            placeholder="Search messages or users"
          />
        </View>
      </View>

      {chats?.length > 0 ? (
        <FlatList
          data={chats || []}
          keyExtractor={(chat) => chat.id}
          renderItem={({ item }) => <ChatItem chat={item} />}
          contentContainerStyle={{
            padding: 5,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      ) : (
        <View
          style={{
            height: height - 250,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>
            No Chat, Click{"  "}
            <TouchableOpacity
              onPress={() => router.push("/main/(profile)/add-friend")}
            >
              <MessageCirclePlus />
            </TouchableOpacity>
            {"  "}to add friends
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
