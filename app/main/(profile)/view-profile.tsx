"use client";
import { Avatar } from "@/components/Avatar";
import { useAuthStore } from "@/libs/store/authStore";
import { Profile } from "@/models/profile";
import { COLORS } from "@/shared/constants/color";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { THEME } from "@/shared/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, MoreVertical, ShareIcon } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewProfile() {
  const { width } = Dimensions.get("window");

  const { profile } = useAuthStore();

  const { user } = useLocalSearchParams();

  // console.log("USER", user);

  const userData = JSON.parse(user as string) as Profile;
  const [menuVisible, setMenuVisible] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${userData?.name}'s profile!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setMenuVisible(false);
    }
  };

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

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
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
              backgroundColor: THEME.colors.surface,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 15,
            }}
            onPress={handleShare}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <ShareIcon color={THEME.colors.text} />
              <Text style={{ color: THEME.colors.text }}>Share</Text>
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

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              position: "absolute",
              top: 100,
              right: 20,
              backgroundColor: THEME.colors.surface,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5,
              paddingVertical: 10,
              minWidth: 150,
            }}
          >
            {/* <TouchableOpacity style={{ padding: 12 }} onPress={handleShare}>
              <Text style={{ color: THEME.colors.text }}>Share Profile</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{ padding: 12 }}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert("Blocked", `${userData?.name} has been blocked.`);
              }}
            >
              <Text style={{ color: COLORS.red }}>Block User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 12 }}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert("Reported", "This profile has been reported.");
              }}
            >
              <Text style={{ color: THEME.colors.text }}>Report</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
