// SkeletonList.js
import { THEME } from "@/shared/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonBlock from "./SkeletonBlock";

type SkeletonBlockProps = {
  width: string | number;
  height: string | number;
  style?: any;
  borderRadius?: number;
  items: number;
};

export default function MomentCardSkeletonList({ items = 5 }) {
  return (
    <View>
      {Array.from({ length: items }).map((_, i) => (
        <View key={i} style={styles.card}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.authorContainer}>
              <SkeletonBlock width={60} height={60} borderRadius={50} />
              <View style={{ gap: 8, width: "50%" }}>
                <SkeletonBlock width="100%" height={8} />
                <SkeletonBlock
                  width={40}
                  height={5}
                  style={{ marginBottom: 0 }}
                />
              </View>
            </View>
            <View style={styles.moreButton}>
              <SkeletonBlock
                width={20}
                height={8}
                style={{ marginBottom: 0 }}
              />
            </View>
          </View>

          <View style={{ gap: 5 }}>
            <SkeletonBlock
              width={"90%"}
              height={6}
              style={{ marginBottom: 0 }}
            />
            <SkeletonBlock
              width={"80%"}
              height={6}
              style={{ marginBottom: 0 }}
            />
            <SkeletonBlock
              width={"90%"}
              height={6}
              style={{ marginBottom: 0 }}
            />
            <SkeletonBlock
              width={"80%"}
              height={6}
              style={{ marginBottom: 0 }}
            />
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={styles.actionButton}>
                <SkeletonBlock width={20} height={20} borderRadius={50} />
              </View>
              <View style={styles.actionButton}>
                <SkeletonBlock width={20} height={20} borderRadius={50} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.background,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    shadowColor: THEME.colors.elevation.level5,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerText: {
    marginLeft: 10,
    justifyContent: "center",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  time: {
    fontSize: 12,
    color: THEME.colors.primaryContainer,
    marginTop: 2,
  },
  moreButton: {
    padding: 6,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
    color: THEME.colors.text,
  },
  media: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: THEME.colors.text,
  },
});
