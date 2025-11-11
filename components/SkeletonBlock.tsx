// SkeletonBlock.js
import { THEME } from "@/shared/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

type SkeletonBlockProps = {
  width: string | number;
  height: string | number;
  style?: any;
  borderRadius?: number;
};

export default function SkeletonBlock({
  width = "100%",
  height = 16,
  borderRadius = 4,
  style,
}: SkeletonBlockProps) {
  return (
    <View
      style={[styles.base, { width, height, borderRadius }, style ? style : {}]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: THEME.colors.surface, // light grey skeleton color
    overflow: "hidden",
  },
});
