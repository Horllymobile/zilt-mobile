import { THEME } from "@/shared/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = {
  label: string;
  trigger?: React.ReactNode; // 👈 allows any React element (Button, Icon, etc.)
};

export default function EmptyState({ label, trigger }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      {trigger && <View style={styles.trigger}>{trigger}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 550,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: THEME.colors.text,
    marginBottom: 10,
  },
  trigger: {
    marginTop: 8,
  },
});
