import { THEME } from "@/shared/constants/theme";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Verify() {
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
      }}
    >
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ width: 250, height: 250, marginBottom: 20 }}
        resizeMode="contain"
      />

      <View>
        <Text>Verification Code</Text>
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
            placeholder="Enter your code"
          />
        </View>
      </View>

      <TouchableHighlight
        style={{
          marginTop: 30,
          backgroundColor: THEME.colors.primary,
          width: width - 40,
          height: 58,
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          borderRadius: 20,
        }}
        className="p-4 rounded-full"
        onPress={() => {
          router.replace("/onboarding");
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
            color: THEME.colors.text,
          }}
        >
          Verify
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
