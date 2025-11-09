import { THEME } from "@/shared/constants/theme";
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  Text,
  TouchableHighlight,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  width: number;
  disabled: boolean;
  onPress: () => void;
  isLoading: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function WideButton({
  width,
  disabled,
  onPress,
  label,
  isLoading,
  style,
}: ButtonProps) {
  return (
    <TouchableHighlight style={[style]} disabled={disabled} onPress={onPress}>
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
        {isLoading ? (
          <ActivityIndicator size={"small"} color={THEME.colors.text} />
        ) : (
          label
        )}
      </Text>
    </TouchableHighlight>
  );
}
