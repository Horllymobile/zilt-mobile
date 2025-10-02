import { router } from "expo-router";
import { Image, Platform, Text, TouchableHighlight, View } from "react-native";

export default function Splash() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 150, height: 150, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 24,
          fontWeight: "normal",
          fontFamily: Platform.select({
            android: "itim",
            ios: "itim",
          }),
        }}
      >
        Chat, Meet and Discover
      </Text>

      <TouchableHighlight
        style={{
          backgroundColor: "#2C057A",
          width: 309,
          height: 58,
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          borderRadius: 100,
        }}
        className="p-4 bg-[#2C057A] rounded-full"
        onPress={() => {
          // Handle sign-in action
          router.navigate("/(auth)/login");
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "normal",
            fontFamily: Platform.select({
              android: "itim",
              ios: "itim",
            }),
            color: "white",
          }}
          className="text-white"
        >
          Sign In
        </Text>
      </TouchableHighlight>
    </View>
  );
}
