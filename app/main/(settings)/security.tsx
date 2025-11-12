"use client";
import { THEME } from "@/shared/constants/theme";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Security() {
  const { width } = Dimensions.get("window");

  return (
    <SafeAreaView
      style={{
        flex: 1,
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
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <ChevronLeft color={THEME.colors.text} size={24} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "medium",
              color: THEME.colors.text,
            }}
          >
            Security Settings
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
