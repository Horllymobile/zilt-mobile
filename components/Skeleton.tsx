// Skeleton.js
import React from "react";
import { View } from "react-native";
import ShimmerSkeleton from "./ShimmerSkeleton";
import SkeletonBlock from "./SkeletonBlock";

type SkeletonProps = {
  style?: any;
  borderRadius?: number;
  shimmer: boolean;
  variant: string;
};

export default function Skeleton({
  variant = "block",
  shimmer = false,
  ...rest
}: SkeletonProps) {
  if (shimmer) return <ShimmerSkeleton width={"100%"} height={16} {...rest} />;

  switch (variant) {
    case "avatar":
      return (
        <SkeletonBlock width={48} height={48} borderRadius={24} {...rest} />
      );
    case "row":
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SkeletonBlock width={48} height={48} borderRadius={8} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <SkeletonBlock
              width="70%"
              height={12}
              style={{ marginBottom: 6 }}
            />
            <SkeletonBlock width="40%" height={10} />
          </View>
        </View>
      );
    default:
      return <SkeletonBlock width={"100%"} height={16} {...rest} />;
  }
}
