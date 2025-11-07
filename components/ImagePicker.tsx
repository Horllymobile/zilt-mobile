import * as ImagePicker from "expo-image-picker";
import { ImageIcon } from "lucide-react-native";
import { Image, TouchableOpacity, View } from "react-native";

type Props = {
  //   setImageURI: React.Dispatch<React.SetStateAction<string>>;
  imageURI: string;
  onImageLoaded: (url: string) => void;
};

export default function ImagePickerComponent({
  imageURI,
  onImageLoaded,
}: Props) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onImageLoaded(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={() => pickImage()}>
      <View
        style={{
          width: 150,
          height: 150,
          minHeight: 150,
          minWidth: 150,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderRadius: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!imageURI ? (
          <ImageIcon size={34} />
        ) : (
          <Image
            source={{ uri: imageURI }}
            width={60}
            height={60}
            style={{
              width: 150,
              height: 150,
              borderRadius: 50,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
