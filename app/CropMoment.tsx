import { COLORS } from "@/shared/constants/color";
import {
  FlipType,
  SaveFormat,
  useImageManipulator,
} from "expo-image-manipulator";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};
export default function CropMoment({
  imageUri,
  onComplete,
  onClose,
}: {
  imageUri: string;
  onComplete: (croppedUri: string) => void;
  onClose: () => void;
}) {
  //   console.log(route);
  //   const { imageUri } = route?.params;

  const [image, setImage] = useState(imageUri);
  const context = useImageManipulator(imageUri);

  const rotate90andFlip = async () => {
    context.rotate(90).flip(FlipType.Vertical);
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result.uri);
  };

  const cropImage = async () => {
    context.crop({
      height: 500,
      width: initialLayout.width,
      originX: 0,
      originY: 0,
    });
    //   .flip(FlipType.Vertical);
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result.uri);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => onClose()}>
            <X color={COLORS.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Zilt Moment</Text>
        </View>
      </View>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        <Button title="Crop" onPress={cropImage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#555",
    color: "#fff",
    height: initialLayout.height,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: initialLayout.width,
    height: initialLayout.height / 2,
    resizeMode: "contain",
  },
});
