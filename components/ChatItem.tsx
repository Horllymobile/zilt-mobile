import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";

export default function ChatItem({ item }: { item: any }) {
  return (
    <TouchableOpacity
      touchSoundDisabled={true}
      style={{
        flexDirection: "row",
        alignItems: "center",
        opacity: 1,
        padding: 12,
        borderRadius: 0,
      }}
      onPress={() => {
        router.push(`/(chats)/${item.id}`);
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#c3adef",
          overflow: "hidden",
          marginRight: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SvgXml xml={item.sender.avatar} width="50" height="50" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {item.sender.name}
        </Text>
        <Text
          style={{ fontSize: 14, color: "#666", marginTop: 4 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.lastMessage}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
        {item.timestamp}
      </Text>
    </TouchableOpacity>
  );
}
