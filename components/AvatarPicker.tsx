import {
  adventurer,
  avataaars,
  bigEars,
  bigSmile,
  bottts,
  dylan,
  micah,
  personas,
} from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import React, { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { Avatar } from "./Avatar";

type Props = {
  imageURI?: string;
  onImageLoaded: (url: string) => void;
};

export default function AvatarPicker({ onImageLoaded, imageURI }: Props) {
  const [avatars] = useState(() => {
    const seeds = [
      "alpha",
      "bravo",
      "charlie",
      "delta",
      "echo",
      "dummy",
      "sammy",
    ];
    const collections: any[] = [
      adventurer,
      avataaars,
      bottts,
      micah,
      personas,
      dylan,
      bigEars,
      bigSmile,
    ];

    return collections.map((style, i) =>
      createAvatar(style, { seed: seeds[i], size: 100 }).toString()
    );
  });

  const [avatar, setAvatar] = useState(
    imageURI || createAvatar(adventurer, { seed: "", size: 100 }).toString()
  );

  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? Math.max(index - 1, 0)
        : Math.min(index + 1, avatars.length - 1);
    setIndex(newIndex);
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 75,
          borderWidth: 2,
          borderColor: "#2C057A",
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 5,
          marginBottom: 16,
        }}
      >
        <SvgXml xml={avatar || ""} width="100" height="100" />
      </View>
      {/* ✅ Avatar Carousel */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={() => scrollTo("left")}>
          <Text style={{ fontSize: 24, paddingHorizontal: 10 }}>◀</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={avatars}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          pagingEnabled
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / 150);
            setIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setAvatar(item);
                onImageLoaded(item);
              }}
            >
              <Avatar
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 75,
                  borderWidth: 2,
                  borderColor: "#2C057A",
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 5,
                }}
                avatar_url={item}
                width={40}
                height={40}
              />
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity onPress={() => scrollTo("right")}>
          <Text style={{ fontSize: 24, paddingHorizontal: 10 }}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
