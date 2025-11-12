import { THEME } from "@/shared/constants/theme";
import { Search } from "lucide-react-native";
import { TextInput, View } from "react-native";

type SearchBar = {
  width: number;
  text: string;
  onChange?: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  width,
  text,
  onChange,
  placeholder,
}: SearchBar) {
  return (
    <View style={{ alignItems: "center", marginVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 0.5,
          borderRadius: 30,
          backgroundColor: THEME.colors.text,
          borderColor: THEME.colors.background,
          paddingHorizontal: 10,
          height: 46,
          width: width * 0.9, // 90% of screen width
        }}
      >
        <Search style={{ marginRight: 8 }} color={THEME.colors.background} />
        <TextInput
          onChangeText={onChange}
          value={text}
          style={{
            flex: 1,
            fontSize: 16,
            width: width,
            color: THEME.colors.background,
          }}
          placeholder={placeholder}
          placeholderTextColor={THEME.colors.background + "99"}
        />
      </View>
    </View>
  );
}
