"use client";
import SearchBar from "@/components/SearchBar";
import { useAuthStore } from "@/libs/store/authStore";
import { Chat, Message } from "@/models/chat";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
import { useRouter } from "expo-router";
import { MessageCirclePlus } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap } from "react-native-tab-view";
import InboxPage from "../(chats)/inbox";
import Requests from "../(chats)/requests";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

type Route = { key: string; title: string };

export default function Index() {
  const socket = useSocket();
  const { width } = Dimensions.get("window");

  const [chats, setChats] = useState<Chat[]>([]);
  const [chatRequests, setChatRequests] = useState<Chat[]>([]);
  const { profile, session } = useAuthStore();
  const router = useRouter();

  const [unseenChats, setUnseenChats] = useState(0);
  const [unseenRequests, setUnseenRequests] = useState(0);

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<Route[]>([
    { key: "inbox", title: "Inbox" },
    { key: "requests", title: "Requests" },
  ]);

  const renderScene = SceneMap({
    inbox: InboxPage,
    requests: Requests,
  });

  useEffect(() => {
    if (!profile && !session) return;

    setTimeout(() => {
      if (profile && !profile?.onboarded) router.push("/onboarding");
    }, 200);
  }, [profile]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_chats", { page: 1, size: 20 });
    socket.emit("get_chat_requests", { page: 1, size: 20 });

    const handleChats = (res: any) => setChats(res?.data);
    const handleRequests = (res: any) => setChatRequests(res?.data);

    socket.on("chats", handleChats);
    socket.on("requests", handleRequests);

    return () => {
      socket.off("chats", handleChats);
      socket.off("requests", handleRequests);
    };
  }, [socket]);

  const unSeenMsgs = (msgs: Message[]) => {
    return msgs.filter((msg) => !msg.seen);
  };

  // 🧮 Compute unseen counts for current user
  const unseenChatsCount = useMemo(() => {
    if (!profile || !chats?.length) return 0;
    return chats.filter((chat) => {
      const lastMessage = chat.lastMessage;
      if (!lastMessage) return false;

      // If message is not sent by current user and not seen by them
      return lastMessage.senderId !== profile.id && !lastMessage.seen;
    }).length;
  }, [chats, profile]);

  const unseenRequestsCount = useMemo(() => {
    if (!profile || !chatRequests?.length) return 0;
    // Assuming request is unseen if current user hasn't accepted or viewed it
    return chatRequests.filter(
      (req) =>
        !req.members.some(
          (m) => m.userId === profile.id && req.status === "ACTIVE"
        )
    ).length;
  }, [chatRequests, profile]);

  // 🧱 Update tab titles dynamically with counts
  useEffect(() => {
    setRoutes([
      {
        key: "inbox",
        title: unseenChatsCount > 0 ? `Inbox (${unseenChatsCount})` : "Inbox",
      },
      {
        key: "requests",
        title:
          unseenRequestsCount > 0
            ? `Requests (${unseenRequestsCount})`
            : "Requests",
      },
    ]);
  }, [unseenChatsCount, unseenRequestsCount]);

  return (
    <SafeAreaView
      edges={["top"]}
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

      <InboxPage />

      {/* Tab View */}
      {/* <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor={THEME.colors.text}
            inactiveColor={THEME.colors.text}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            tabStyle={styles.tab}
          />
        )}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: THEME.colors.background,
    elevation: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  indicator: {
    backgroundColor: THEME.colors.text,
    height: 3,
    borderRadius: 3,
  },
  tab: {
    width: initialLayout.width / 2,
  },
});
