import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { router } from "expo-router";
import { Eye, EyeOff, Loader2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { width } = Dimensions.get("window");

  const [email, setEmail] = useState("horlamidex1@gmail.com");
  const [password, setPassword] = useState("P@ssword1");

  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setAuthData, session } = useAuthStore();

  useEffect(() => {
    console.log(session);
  }, [session]);

  const handleSubmit = async () => {
    setLoading(true);
    supabase.auth.signInWithOtp({
      email,
    });
    const auth = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (auth.error) {
      Alert.alert(auth.error.message);
    } else {
      setAuthData({
        session: auth.data.session,
        user: auth.data.user,
      });

      supabase
        .from("users")
        .select("")
        .eq("id", auth.data.user?.user_metadata?.sub)
        .single()
        .then((res) => {
          console.log(res);
          if (!res.data) {
            router.navigate("/onboarding");
          } else {
            router.push("/main/(dashboard)");
          }
        });
    }
    setLoading(false);
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
              top: 15,
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
        disabled={isLoading}
        className="p-4 bg-[#2C057A] rounded-full"
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
          {isLoading ? (
            <Loader2 className="animate-spin" color="white" />
          ) : (
            "Login"
          )}
        </Text>
      </TouchableHighlight>

      <TouchableHighlight
        className="mt-2"
        onPress={() => {
          router.navigate("/(auth)/signup");
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
            color: "#2C057A",
          }}
        >
          Forgot Password?
        </Text>
      </TouchableHighlight>

      <TouchableHighlight
        className="p-2 mt-3"
        onPress={() => {
          router.navigate("/(auth)/signup");
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
            color: "#2C057A",
          }}
          className="text-white"
        >
          Sign Up
        </Text>
      </TouchableHighlight>
    </View>
  );
}
