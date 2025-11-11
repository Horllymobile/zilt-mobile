import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type ShimmerSkeletonProps = {
  width: string | number;
  height: string | number;
  style?: any;
  borderRadius?: number;
};

export default function ShimmerSkeleton({
  width = "100%",
  height = 16,
  borderRadius = 4,
  style,
}: ShimmerSkeletonProps) {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [translateX]);

  const translateInterpolation = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: translateInterpolation }],
          },
        ]}
      >
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.45)",
            "rgba(255,255,255,0)",
          ]}
          style={{ flex: 1, width: 300 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6EEF2",
    overflow: "hidden",
  },
});
