"use client";
import { Avatar } from "@/components/Avatar";
import { useAuthStore } from "@/libs/store/authStore";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { router } from "expo-router";
import { ChevronLeft, Link } from "lucide-react-native";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QrScan() {
  const { width } = Dimensions.get("window");

  const { profile } = useAuthStore();

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <ChevronLeft color="#2C057A" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "medium" }}>
            Scan QR Code
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 16,
          gap: 15,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
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
            avatar_url={profile?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
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
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {profile?.name}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20, paddingHorizontal: 16, gap: 15 }}>
        <Text
          className="text-center"
          style={{ fontSize: 24, textAlign: "center" }}
        >
          Scan the QR code to add a contact
        </Text>
        {/* QR Code Scanner component would go here */}
        <Image
          source={require("@/assets/images/qr_code.png")}
          style={{
            height: 300,
            minHeight: 300,
            borderRadius: 8,
            width: width - 32,
            maxWidth: 400,
            alignSelf: "center",
          }}
        />

        <TouchableOpacity
          style={{
            alignSelf: "center",
            marginTop: 10,
            backgroundColor: "#2C057A",
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 15,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Link color="white" size={18} />
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: "white",
                fontWeight: "500",
              }}
            >
              Copy Link
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
