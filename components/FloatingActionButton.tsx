import { THEME } from "@/shared/constants/theme";
import React, { JSX } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

export default function FloatingActionButton({
  onPress,
  icon,
  disabled,
  isLoading,
  color,
}: {
  onPress: () => void;
  icon: JSX.Element;
  disabled?: boolean;
  isLoading?: boolean;
  color?: string;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.fab,
        { backgroundColor: !disabled ? color : THEME.colors.surfaceDisabled },
      ]}
      onPress={onPress}
    >
      {isLoading ? <ActivityIndicator size={"small"} /> : icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Android shadow
  },
});
