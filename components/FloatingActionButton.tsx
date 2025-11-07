import React, { JSX } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function FloatingActionButton({
  onPress,
  icon,
}: {
  onPress: () => void;
  icon: JSX.Element;
}) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      {icon}
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
    backgroundColor: "#2C057A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Android shadow
  },
});
