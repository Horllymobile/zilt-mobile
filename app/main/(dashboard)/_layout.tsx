import { THEME } from "@/shared/constants/theme";
import { Tabs } from "expo-router";
import { MessageCircle, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.colors.text,
        headerShown: false,
        tabBarIconStyle: { marginTop: 5 },
        tabBarLabelStyle: { marginBottom: 5, fontSize: 12 },
        tabBarActiveBackgroundColor: THEME.colors.background,
        tabBarInactiveTintColor: THEME.colors.text,
        tabBarStyle: {
          backgroundColor: THEME.colors.surface,
          borderTopColor: THEME.colors.surface,
          paddingBottom: 0,
          borderTopWidth: 2,
          height: 70,
        },
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Telescope color={color} size={size} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
