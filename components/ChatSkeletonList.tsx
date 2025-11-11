// SkeletonList.js
import { THEME } from "@/shared/constants/theme";
import React from "react";
import { View } from "react-native";
import SkeletonBlock from "./SkeletonBlock";

type SkeletonBlockProps = {
  width: string | number;
  height: string | number;
  style?: any;
  borderRadius?: number;
  items: number;
};

export default function ChatSkeletonList({ items = 5 }) {
  return (
    <View>
      {Array.from({ length: items }).map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            opacity: 1,
            padding: 12,
            borderRadius: 0,
            gap: 10,
          }}
        >
          <SkeletonBlock width={60} height={60} borderRadius={50} />
          <View style={{ flex: 1, gap: 10 }}>
            <SkeletonBlock
              width="30%"
              height={10}
              style={{ marginBottom: 0 }}
            />

            <SkeletonBlock width={20} height={8} style={{ marginBottom: 0 }} />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                marginTop: 4,
                borderRadius: 5,
                backgroundColor: THEME.colors.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SkeletonBlock
                width={20}
                height={8}
                style={{ marginBottom: 0 }}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
