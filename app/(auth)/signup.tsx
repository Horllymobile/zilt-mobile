import { useAuthStore } from "@/libs/store/authStore";
import { useRegisterMutation } from "@/shared/services/auth/authApi";
import { Redirect, router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { width } = Dimensions.get("window");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const { session } = useAuthStore();

  const { setAuthData, session } = useAuthStore();

  if (session) {
    return <Redirect href={"/main/(dashboard)"} />;
    // router.push("/main/(dashboard)/");
  }

  const registerMutation = useRegisterMutation();

  const handleSubmit = async () => {
    // console.log(email, password);

    registerMutation.mutate(
      {
        email: email.toLowerCase(),
        password,
      },
      {
        onSuccess: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
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
        source={require("../../assets/images/icon.png")}
        style={{ width: 109.09, height: 101.67, marginBottom: 20 }}
        resizeMode="contain"
      />

      <View style={{ marginTop: 20 }}>
        <Text>Email</Text>
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
            keyboardType="email-address"
            value={email}
            onChangeText={(e) => setEmail(e)}
            placeholder="Enter your email address"
            style={{
              fontSize: 16,
              width: width - 40,
              borderWidth: 0,
              borderRadius: 0,
            }}
          />
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>Password</Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 10,
            padding: 10,
            height: 58,
            width: width - 40,
            position: "relative",
          }}
        >
          <TextInput
            secureTextEntry={!showPassword} // 👈 this hides text with •••
            autoCapitalize="none" // 👈 prevent auto-capitalization
            autoCorrect={false} // 👈 prevent autocorrect
            value={password}
            onChangeText={(e) => setPassword(e)}
            placeholder="Enter your password"
            style={{
              fontSize: 16,
              width: width - 40,
              borderWidth: 0,
              borderRadius: 0,
            }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 12,
              right: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
          </TouchableOpacity>
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
        disabled={registerMutation.isPending}
        onPress={() => {
          handleSubmit();
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
          {registerMutation.isPending ? (
            <ActivityIndicator size={"small"} color="white" />
          ) : (
            "Sign Up"
          )}
        </Text>
      </TouchableHighlight>

      <TouchableHighlight
        className="p-4 mt-5"
        style={{
          marginTop: 10,
        }}
        onPress={() => {
          router.navigate("/(auth)/login");
        }}
        disabled={registerMutation.isPending}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "normal",
            fontFamily: Platform.select({
              android: "itim",
              ios: "itim",
            }),
            color: "#2C057A",
          }}
          className="text-white"
        >
          Login
        </Text>
      </TouchableHighlight>
    </View>
  );
}
