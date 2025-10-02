import ChatItem from "@/components/ChatItem";
import { chats } from "@/shared/data";
import { MessageCirclePlus, Search } from "lucide-react-native";
import React from "react";
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
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
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
        <Text style={{ fontSize: 24, fontWeight: "medium" }}>ZiltChat</Text>

        <TouchableOpacity onPress={() => {}}>
          <MessageCirclePlus />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
        <View
          className="relative"
          style={{
            borderWidth: 0.5,
            borderRadius: 30,
            backgroundColor: "#ffff",
            borderColor: "#2C057A",

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
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem item={item} />}
        contentContainerStyle={{
          padding: 5,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}
