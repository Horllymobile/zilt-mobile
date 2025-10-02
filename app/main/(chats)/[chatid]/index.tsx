import { chats } from "@/shared/data";
import { router, usePathname } from "expo-router";
import {
  Camera,
  ChevronLeft,
  Mic,
  Paperclip,
  Phone,
  Smile,
  Video,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const { width } = Dimensions.get("window");

  const pathname = usePathname();

  const chatId = pathname.split("/").pop();
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) {
    return null;
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
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
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <ChevronLeft color="#2C057A" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "medium" }}>
            {chat.sender.name}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <TouchableOpacity onPress={() => {}}>
            <Video color="#2C057A" size={28} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Phone color="#2C057A" size={28} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          marginBottom: 10,
          gap: 20,
          paddingHorizontal: 10,
        }}
      >
        <View
          className="relative"
          style={{
            borderWidth: 0.5,
            borderRadius: 30,
            backgroundColor: "#fff",
            borderColor: "#2C057A",

            marginTop: 10,
            padding: 10,
            height: 46,
            width: width - 80,
            position: "relative",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <Smile style={{ position: "absolute", left: 12, top: 12 }} />
          <TextInput
            style={{
              fontSize: 16,
              width: width - 80,
              borderWidth: 0,
              borderRadius: 0,
              height: 50,
              paddingLeft: 30,
            }}
            placeholder="Enter message"
          />

          <View
            style={{
              position: "absolute",
              right: 12,
              top: 5,
              height: 36,
              width: 80,
              // borderColor: "#2C057A",
              // borderRadius: 20,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 8,
              }}
              onPress={() => {}}
            >
              <Paperclip size={24} color="#2C057A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 8,
              }}
              onPress={() => {}}
            >
              <Camera size={24} color="#2C057A" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={{
            right: 12,
            top: 5,
            backgroundColor: "#2C057A",
            borderRadius: 50,
            padding: 8,
            width: 50,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {}}
        >
          <Mic color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
