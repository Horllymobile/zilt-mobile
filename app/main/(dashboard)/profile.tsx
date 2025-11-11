"use client";
import { Avatar } from "@/components/Avatar";
import { useAuthStore } from "@/libs/store/authStore";
import { getColorFromString } from "@/libs/utils/colors";
import { THEME } from "@/shared/constants/theme";
import { RelativePathString, router } from "expo-router";
import { ChevronLeft, QrCode, Settings, User } from "lucide-react-native";
import {
  Dimensions,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Settings = {
  id: string;
  name: string;
  icon: React.JSX.Element;
  route: RelativePathString;
};

export default function Profile() {
  const { width } = Dimensions.get("window");
  const { profile } = useAuthStore();
  console.log(profile);

  const settings: Settings[] = [
    {
      id: "1",
      name: "Edit Account",
      icon: <User color={THEME.colors.text} size={24} />,
      route: "../(account)",
    },
    {
      id: "6",
      name: "Settings",
      icon: <Settings color={THEME.colors.text} size={24} />,
      route: "../(settings)",
    },
    // {
    //   id: "4",
    //   name: "Help",
    //   icon: <MessageCircleQuestionMark color={THEME.colors.primary,} size={24} />,
    //   route: "../help",
    // },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
          height: 60,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "medium",
            color: THEME.colors.text,
          }}
        >
          Profile
        </Text>

        {/* <TouchableOpacity onPress={() => {}}>
          <Search />
        </TouchableOpacity> */}
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
        {profile?.avatar_url && (
          <Avatar
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: getColorFromString(profile.avatar_url),
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            avatar_url={profile?.avatar_url}
            width={80}
            height={80}
          />
        )}

        <View style={{ alignItems: "center", gap: 5 }}>
          <View style={{ alignItems: "center", gap: 5 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: THEME.colors.text,
              }}
            >
              {profile?.name}
            </Text>

            {profile?.email && (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "medium",
                  color: THEME.colors.text,
                }}
              >
                {profile?.email}
              </Text>
            )}
          </View>

          <View style={{ alignItems: "center", gap: 5, flexDirection: "row" }}>
            <TouchableHighlight
              onPress={() => {}}
              activeOpacity={0.6}
              underlayColor="none"
              style={{ padding: 5, borderRadius: 5 }}
            >
              <Text style={{ fontSize: 16, color: THEME.colors.text }}>
                {profile?.bio}
              </Text>
            </TouchableHighlight>
          </View>
        </View>

        <TouchableOpacity
          style={{
            marginTop: 10,
            borderColor: THEME.colors.text,
            borderWidth: 1,
            backgroundColor: THEME.colors.background,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
          onPress={() => {
            // setShowQrModal(true)
            router.push("/main/(profile)/qr-scan");
          }}
        >
          <QrCode color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20, paddingHorizontal: 8, gap: 15 }}>
        {settings.map((setting) => (
          <TouchableOpacity
            key={setting.id}
            style={{
              padding: 15,
              borderRadius: 8,
            }}
            onPress={() => {
              // Handle setting option press
              router.push(setting.route);
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {setting.icon}
              <Text style={{ fontSize: 16, color: THEME.colors.text }}>
                {setting.name}
              </Text>
              <ChevronLeft
                color={THEME.colors.text}
                size={20}
                style={{
                  transform: [{ rotate: "180deg" }],
                  marginLeft: "auto",
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
