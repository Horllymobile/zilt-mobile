"use client";
import { Avatar } from "@/components/Avatar";
import { useAuthStore } from "@/libs/store/authStore";
import { Profile } from "@/models/profile";
import { COLORS } from "@/shared/constants/color";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { THEME } from "@/shared/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { BanIcon, ChevronLeft, MoreVertical } from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewProfile() {
  const { width } = Dimensions.get("window");

  const { profile } = useAuthStore();

  const { user } = useLocalSearchParams();

  console.log("USER", user);

  const userData = JSON.parse(user as string) as Profile;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <ChevronLeft color={THEME.colors.text} size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <MoreVertical color={THEME.colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 16,
          gap: 15,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: THEME.colors.text,
          paddingBottom: 20,
        }}
      >
        <View>
          <Avatar
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: "#c3adef",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            avatar_url={userData?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
            width={80}
            height={80}
          />

          {/* {user.isOnline && (
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 50,
                position: "absolute",
                bottom: 5,
                right: 5,
                borderWidth: 2,
                borderColor: "#fff",
                backgroundColor: "green",
              }}
            />
          )} */}
        </View>

        <View style={{ alignItems: "center", gap: 5 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: THEME.colors.text,
            }}
          >
            {userData?.name}
          </Text>

          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: 10,
              backgroundColor: COLORS.red,
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderRadius: 15,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <BanIcon color={THEME.colors.text} />
              <Text style={{ color: THEME.colors.text }}>Block</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          marginTop: 5,
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: THEME.colors.text,
        }}
      >
        <View
          style={{
            //   borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 10,

            padding: 10,
            height: 70,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "medium",
              color: THEME.colors.text,
            }}
          >
            {userData?.bio}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
