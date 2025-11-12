"use client";
import { useAuthStore } from "@/libs/store/authStore";
import { THEME } from "@/shared/constants/theme";
import { RelativePathString, router } from "expo-router";
import {
  Bell,
  ChevronLeft,
  Info,
  LogOut,
  Settings2,
} from "lucide-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Settings = {
  id: string;
  name: string;
  icon: React.JSX.Element;
  route?: RelativePathString;
  onClick?: () => void;
};

export default function Settings() {
  const { width } = Dimensions.get("window");

  const { logout } = useAuthStore();

  const settings: Settings[] = [
    {
      id: "settings",
      name: "Account Settings",
      icon: <Settings2 size={24} color={THEME.colors.text} />,
      route: "./settings",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: <Bell size={24} color={THEME.colors.text} />,
      route: "./notifications",
    },

    // {
    //   id: "privacy",
    //   name: "Privacy",
    //   icon: <Shield size={24} color={THEME.colors.text} />,
    //   route: "./privacy",
    // },
    // {
    //   id: "language",
    //   name: "Laguage",
    //   icon: <Languages size={24} color={THEME.colors.text} />,
    //   route: "./language",
    // },
    // {
    //   id: "help",
    //   name: "Help",
    //   icon: <MessageCircleQuestionMark size={24} color={THEME.colors.text} />,
    //   route: "./help",
    // },
    {
      id: "about",
      name: "About",
      icon: <Info size={24} color={THEME.colors.text} />,
      route: "./about",
    },
    {
      id: "logout",
      name: "Logout",
      icon: <LogOut color="red" size={24} />,
      onClick: () => {
        // console.log("Logout clicked");
        logout();
        router.push("/(auth)/login");
      },
    },
  ];

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
            Settings
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20, paddingHorizontal: 16, gap: 15 }}>
        {settings.map((setting) => (
          <TouchableOpacity
            key={setting.id}
            style={{
              padding: 15,
              borderRadius: 8,
            }}
            onPress={() => {
              // Handle setting option press
              if (setting.route) {
                router.push(setting.route);
              }

              if (setting.onClick) {
                setting.onClick();
              }
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {setting.icon}
              <Text
                style={{
                  fontSize: 16,
                  color: setting.id === "logout" ? "red" : THEME.colors.text,
                }}
              >
                {setting.name}
              </Text>
              {setting.route && (
                <ChevronLeft
                  color={THEME.colors.text}
                  size={20}
                  style={{
                    transform: [{ rotate: "180deg" }],
                    marginLeft: "auto",
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
