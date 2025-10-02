import { useAuthStore } from "@/libs/store/authStore";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

export default function Login() {
  const { width } = Dimensions.get("window");

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [isLoading, setLoading] = useState(false);
  const { session, user } = useAuthStore();

  const handleSubmit = async () => {
    router.push("/main/(dashboard)");

    //  supabase.from('user').
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 109.09, height: 101.67, marginBottom: 20 }}
        resizeMode="contain"
      />

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
        onPress={() => {
          router.navigate("/main/(dashboard)");
        }}
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
