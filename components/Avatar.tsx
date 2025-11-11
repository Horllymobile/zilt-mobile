import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

type AvatarProps = {
  avatar_url: string; // Can be SVG string or URL
  style?: StyleProp<ViewStyle>;
  width: number;
  height: number;
};

export function Avatar({ avatar_url, style, width, height }: AvatarProps) {
  // console.log(avatar_url);
  const [svgXml, setSvgXml] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadSvg = async () => {
      // Detect if avatar_url looks like raw XML or URL
      if (avatar_url.trim().startsWith("<svg")) {
        setSvgXml(avatar_url);
      } else {
        try {
          const response = await fetch(avatar_url);
          const text = await response.text();
          // console.log(text);
          setSvgXml(text);
        } catch (e) {
          setSvgXml(PLACEHOLDER_CONSTANTS.avatar);
          // console.error("Failed to load SVG:", e);
        }
      }
    };

    loadSvg();
  }, [avatar_url]);

  if (!svgXml) {
    return (
      <View
        style={[
          style,
          { width, height, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={style}>
      {svgXml && (
        <SvgXml
          xml={svgXml || PLACEHOLDER_CONSTANTS.avatar}
          width={width}
          height={height}
        />
      )}
    </View>
  );
}
