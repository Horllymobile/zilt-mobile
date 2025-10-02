import { Compass, Search } from "lucide-react-native";
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Discover() {
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "medium" }}>Discover</Text>

        <TouchableOpacity onPress={() => {}}>
          <Compass />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
        <View
          className="relative"
          style={{
            borderWidth: 0.5,
            borderRadius: 30,
            backgroundColor: "#fff",
            borderColor: "#2C057A",

            marginTop: 10,
            padding: 10,
            height: 46,
            width: width - 20,
            position: "relative",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <Search style={{ position: "absolute", left: 12, top: 12 }} />
          <TextInput
            style={{
              fontSize: 16,
              width: width,
              borderWidth: 0,
              borderRadius: 0,
              height: 46,
              paddingLeft: 30,
            }}
            placeholder="Search anything"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
