import { THEME } from "@/shared/constants/theme";
import * as ImageManipulator from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const ASPECT_RATIO = 4 / 3; // or dynamically calculate based on current cropBox

export default function CropMoment() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [imageLayout, setImageLayout] = useState({
    x: 0,
    y: 0,
    width: screenWidth,
    height: screenHeight,
  });

  if (!imageUri) return null;

  const [cropBox, setCropBox] = useState({
    x: 0,
    y: 0,
    width: screenWidth,
    height: screenHeight * 0.6,
  });

  const lastPos = useRef({ x: 0, y: 0 });
  const lastBox = useRef({ ...cropBox });

  const handleDone = async () => {
    const cropped = await ImageManipulator.manipulateAsync(
      imageUri as string,
      [
        {
          crop: {
            originX: cropBox.x,
            originY: cropBox.y,
            width: cropBox.width,
            height: cropBox.height,
          },
        },
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    console.log("✅ Cropped image:", cropped.uri);
    router.push({
      pathname: "/main/(discover)/moment-preview",
      params: { imageUri: cropped.uri },
    });
  };

  /** MOVE crop box smoothly */
  const moveResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastBox.current = { ...cropBox };
      },
      onPanResponderMove: (_, gesture) => {
        const { dx, dy } = gesture;
        setCropBox((prev) => {
          const newX = Math.max(
            imageLayout.x,
            Math.min(
              imageLayout.x + imageLayout.width - prev.width,
              lastBox.current.x + dx
            )
          );
          const newY = Math.max(
            imageLayout.y,
            Math.min(
              imageLayout.y + imageLayout.height - prev.height,
              lastBox.current.y + dy
            )
          );
          return { ...prev, x: newX, y: newY };
        });
      },
    })
  ).current;

  /** RESIZE crop box smoothly */
  const createResizeResponder = (corner: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastBox.current = { ...cropBox };
      },
      onPanResponderMove: (_, gesture) => {
        const { dx, dy } = gesture;
        setCropBox(() => {
          let { x, y, width, height } = lastBox.current;

          switch (corner) {
            case "tl":
              x += dx;
              y += dy;
              width -= dx;
              height -= dy;
              break;
            case "tr":
              y += dy;
              width += dx;
              height -= dy;
              break;
            case "bl":
              x += dx;
              width -= dx;
              height += dy;
              break;
            case "br":
              width += dx;
              height += dy;
              break;
            case "tb": // top-bottom vertical drag (bottom edge)
              height -= dy;
              width = height * ASPECT_RATIO;
              break;
            case "bt": // bottom-top vertical drag (top edge)
              height += dy;
              width = height * ASPECT_RATIO;
              y -= dy; // move up while shrinking
              break;
            default:
              break;
          }

          // Maintain aspect ratio if desired
          if (
            corner === "tl" ||
            corner === "tr" ||
            corner === "bl" ||
            corner === "br"
          ) {
            const newHeight = width / ASPECT_RATIO;
            const diff = newHeight - height;
            height = newHeight;
            // Adjust Y to keep it centered vertically when resizing diagonally
            if (corner === "tl" || corner === "tr") y -= diff / 2;
          }

          // Prevent box from going outside image boundaries
          if (x < imageLayout.x) x = imageLayout.x;
          if (y < imageLayout.y) y = imageLayout.y;
          if (x + width > imageLayout.x + imageLayout.width)
            width = imageLayout.x + imageLayout.width - x;
          if (y + height > imageLayout.y + imageLayout.height)
            height = imageLayout.y + imageLayout.height - y;

          width = Math.max(60, width);
          height = Math.max(60, height);

          return { x, y, width, height };
        });
      },
    });

  const resizeTL = useRef(createResizeResponder("tl")).current;
  const resizeTR = useRef(createResizeResponder("tr")).current;
  const resizeTB = useRef(createResizeResponder("tb")).current;
  const resizeBT = useRef(createResizeResponder("bt")).current;
  const resizeBL = useRef(createResizeResponder("bl")).current;
  const resizeBR = useRef(createResizeResponder("br")).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <X color={THEME.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Crop Zilt Moment</Text>
        </View>
        <TouchableOpacity onPress={() => console.log("✅ Done")}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri as string }}
          style={styles.image}
          resizeMode="contain"
          onLayout={(e: LayoutChangeEvent) => {
            const { x, y, width, height } = e.nativeEvent.layout;
            setImageLayout({ x, y, width, height });
          }}
        />

        {/* Dim overlay */}
        <View style={styles.overlay} pointerEvents="none" />

        {/* Crop box */}
        <View
          style={[
            styles.cropBox,
            {
              left: cropBox.x,
              top: cropBox.y,
              width: cropBox.width,
              height: cropBox.height,
            },
          ]}
          {...moveResponder.panHandlers}
        >
          {/* Handles */}
          <View style={[styles.handle, styles.tl]} {...resizeTL.panHandlers} />
          <View style={[styles.handle, styles.tr]} {...resizeTR.panHandlers} />
          <View style={[styles.handle, styles.tb]} {...resizeTB.panHandlers} />
          <View style={[styles.handle, styles.bt]} {...resizeBT.panHandlers} />
          <View style={[styles.handle, styles.bl]} {...resizeBL.panHandlers} />
          <View style={[styles.handle, styles.br]} {...resizeBR.panHandlers} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerText: { color: THEME.colors.text, fontSize: 16, fontWeight: "500" },
  doneText: { color: THEME.colors.text ?? "#00FFAA", fontWeight: "600" },
  imageContainer: {
    // flex: 1
  },
  image: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cropBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: THEME.colors.text,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  handle: {
    position: "absolute",
    width: 28,
    height: 28,
    backgroundColor: THEME.colors.text,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: THEME.colors.text,
  },
  tl: { top: -14, left: -14 },
  tr: { top: -14, right: -14 },
  tb: {
    top: -14,
    left: "50%",
    marginLeft: -14, // centers horizontally
  },
  bt: {
    bottom: -14,
    left: "50%",
    marginLeft: -14, // centers horizontally
  },
  bl: { bottom: -14, left: -14 },
  br: { bottom: -14, right: -14 },
});
