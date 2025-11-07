import { COLORS } from "@/shared/constants/color";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoaderActivity() {
  return (
    <SafeAreaView style={[styles.container, styles.horizontal]}>
      {/* <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 150, height: 150, marginBottom: 20 }}
        resizeMode="contain"
      /> */}
      <ActivityIndicator size="large" color={COLORS.primary} />;
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
});
