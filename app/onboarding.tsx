import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

export default async function Login() {
  const { width } = Dimensions.get("window");
  const [imageUri, setImageUri] = useState<string>("");

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [isLoading, setLoading] = useState(false);
  const { session, user } = useAuthStore();

  // const openGallery = await launchImageLibrary({
  //   mediaType: "photo",
  //   quality: 1,
  // });

  const [imageFile, setImageFile] = useState<string | null | undefined>(
    undefined
  );

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
      }
    } catch (err) {
      console.error("Image picker error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert("Please select an image first");
      return;
    }

    try {
      // ✅ Convert the URI to a blob (works in React Native)
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const filePath = `avatars/${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from("Zilt Storage") // your bucket name (no spaces)
        .upload(filePath, blob, {
          cacheControl: "3600",
          upsert: false,
          contentType: "image/jpeg",
        });

      if (error) {
        console.error("Upload error:", error);
        Alert.alert("Upload failed", error.message);
        return;
      }

      // ✅ Get public URL
      const { data: publicUrl } = supabase.storage
        .from("Zilt Storage")
        .getPublicUrl(filePath);

      console.log("Upload success:", publicUrl.publicUrl);
      Alert.alert("Upload successful!", publicUrl.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error uploading image");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 30 }}>Account Setup</Text>
      {/* <TouchableOpacity onPress={() => pickImage()}>
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
          {!imageUri ? (
            <ImageIcon size={34} />
          ) : (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 50,
              }}
            />
          )}
        </View>
      </TouchableOpacity> */}
      <View>
        <Text>Username</Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 10,
            padding: 10,
            height: 58,
            width: width - 40,
          }}
        >
          <TextInput
            style={{
              fontSize: 16,
              width: width - 40,
              borderWidth: 0,
              borderRadius: 0,
            }}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>Bio</Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 10,
            padding: 10,
            height: 70,
            width: width - 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              fontSize: 16,
              width: width - 40,
              height: 70,
              borderWidth: 0,
              borderRadius: 0,
              paddingHorizontal: 10,
            }}
            placeholder="Enter your bio"
            value={bio}
            onChangeText={setBio}
          />
        </View>
      </View>

      <TouchableHighlight
        style={{
          marginTop: 30,
          backgroundColor: "#2C057A",
          width: width - 40,
          height: 58,
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          borderRadius: 20,
        }}
        className="p-4 bg-[#2C057A] rounded-full"
        onPress={handleSubmit}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "normal",
            fontFamily: Platform.select({
              android: "itim",
              ios: "itim",
            }),
            color: "white",
          }}
          className="text-white"
        >
          Submit
        </Text>
      </TouchableHighlight>
    </View>
  );
}
