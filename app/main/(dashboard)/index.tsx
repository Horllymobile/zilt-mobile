"use client";
import SearchBar from "@/components/SearchBar";
import { updateChatStatus } from "@/db/chat.service";
import {
  saveMessage,
  updateMessageSeenStatus,
  updateMessageStatus,
} from "@/db/message.service";
import { getOutboxMessages, removeOutboxMessage } from "@/db/outbox.service";
import { useAuthStore } from "@/libs/store/authStore";
import { useChatStore } from "@/libs/store/chatStore";
import { useMessageStore } from "@/libs/store/messageStore";
import { MessageDto } from "@/models/chat";
import { IMessageResp } from "@/models/message";
import { THEME } from "@/shared/constants/theme";
import useLoadChats from "@/shared/hooks/use-loadchat";
import { useSocket } from "@/shared/hooks/use-socket";
import { useRouter } from "expo-router";
import { MessageCirclePlus } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InboxPage from "../(chats)/inbox";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

type Route = { key: string; title: string };

export default function Index() {
  const socket = useSocket();
  const { width } = Dimensions.get("window");

  const { profile, session } = useAuthStore();
  useLoadChats(profile?.id ?? "");
  const router = useRouter();

  const { fetching, chats, setChatData } = useChatStore();
  const { setMessageData } = useMessageStore();

  const handleDeliveredMessages = async (res: {
    messageId: string;
    chatId: string;
  }) => {
    try {
      console.log("Handle Delivered Messages", res);
      await removeOutboxMessage(res.messageId);
      const success = await updateMessageStatus(res.messageId, "DELIVERED");

      if (success) {
        setChatData({
          fetching: false,
          refetch: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendingMessages = async (res: {
    messageId: string;
    chatId: string;
  }) => {
    try {
      console.log("Handle Sent Messages", res);
      // await updateMessageStatus(res.messageId, "SENDING");
      // await updateOutxoxStatus(res.messageId, "SENDING");
      setChatData({
        fetching: false,
        refetch: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptedChat = async (chatId: string) => {
    console.log("Handle Accepted Chat", chatId);
    try {
      const success = await updateChatStatus(chatId, "ACCEPTED");

      if (success) {
        console.log("Updated Chat", chatId);
        setChatData({
          fetching: false,
          refetch: true,
        });
      }
    } catch (error) {
      Alert.alert(`Can't accept request now try again letter`);
    }
  };

  const handleRejectedChat = async (chatId: string) => {
    console.log("Handle Rejected Chat ", chatId);
    try {
      const success = await updateChatStatus(chatId, "REJECTED");
      if (success) {
        console.log("Updated Chat", chatId);
        setChatData({
          fetching: false,
          refetch: true,
        });
      }
    } catch (error) {
      Alert.alert(`Can't reject request now try again letter`);
    }
  };

  const handleNewMessages = async (res: IMessageResp) => {
    // console.log("Handle Recieved Chats", res);

    try {
      const msg = await saveMessage({
        chatId: res.chatId,
        recipient: res.recipient,
        sender: res.sender,
        status: "DELIVERED",
        content: res.content.trim(),
        media: res.media ? res.media : [],
        messageId: res.messageId,
      });

      if (msg) {
        socket?.emit("message:device_delivered", {
          chatId: msg?.chatId,
          messageId: msg?.msgId,
          senderId: res.sender.id,
        });

        setChatData({
          fetching: false,
          refetch: true,
        });

        setMessageData({
          refetch: true,
          fetching: false,
          chatId: msg.chatId,
        });
      }
    } catch (error) {
      console.log("HandleNew Messages Error", error);
    }
  };

  const handleReadMessage = async (res: string) => {
    // console.log("Handle Recieved Chats", res);
    try {
      await updateMessageStatus(res, "SEEN");
      const msg = await updateMessageSeenStatus(res);

      if (msg) {
        setChatData({
          fetching: false,
          refetch: true,
        });
      }
    } catch (error) {
      console.log("HandleNew Messages Error", error);
    }
  };

  useEffect(() => {
    if (!profile && !session) return;

    setTimeout(() => {
      if (profile && !profile?.onboarded) router.push("/onboarding");
    }, 200);
  }, [profile]);

  useEffect(() => {
    if (!socket) return;

    // socket.emit("get_chats", { page: 1, size: 10 });

    socket.on("message:new", handleNewMessages);
    socket.on("message:read", handleReadMessage);
    socket.on("message:sending", handleSendingMessages);
    socket.on("message:delivered", handleDeliveredMessages);

    socket.on("chat:accepted", handleAcceptedChat);
    socket.on("chat:rejected", handleRejectedChat);

    return () => {
      // socket.off("message:new");
      // socket.off("message:delivered");
      // socket.off("chat:accepted");
      // socket.off("message:sent");
      // socket.off("chat:rejected");
    };
  }, [socket]);

  const getAllOutboxAndResent = async () => {
    const msgs = await getOutboxMessages("SENDING");
    msgs.forEach((msg) => {
      const payload: MessageDto = {
        chatId: msg.chatId ?? "",
        messageId: msg.localId ?? "",
        senderId: msg.senderId ?? "",
        recipientId: msg?.recipientId ?? "",
        content: msg.content ?? "",
        media: msg.media || JSON.stringify("[]"),
      };

      // 4️⃣ Emit to socket
      if (socket) {
        socket.emit("send_message", payload);
      }
    });
  };

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

      <InboxPage
        refetchChat={() =>
          setChatData({
            fetching: false,
            refetch: true,
          })
        }
        isLoading={fetching}
        chats={chats}
      />

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
