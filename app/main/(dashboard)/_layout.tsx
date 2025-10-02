import "@/global.css";
import { Tabs } from "expo-router";
import { MessageCircle, Telescope, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        headerShown: false,
        tabBarIconStyle: { marginTop: 5 },
        tabBarLabelStyle: { marginBottom: 5, fontSize: 12 },
        tabBarActiveBackgroundColor: "#2C057A",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#2C057A",
          paddingBottom: 5,
          borderTopWidth: 1,
          height: 70,
          // borderTopLeftRadius: 10,
          // borderTopRightRadius: 10,
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

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Telescope color={color} size={size} />
          ),
        }}
      />

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
