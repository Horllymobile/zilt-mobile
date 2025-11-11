// SkeletonAvatarRow.js
import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonBlock from "./SkeletonBlock";

export default function SkeletonAvatarRow() {
  return (
    <View style={styles.row}>
      <SkeletonBlock width={48} height={48} borderRadius={24} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <SkeletonBlock width="60%" height={12} style={{ marginBottom: 6 }} />
        <SkeletonBlock width="40%" height={10} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});
