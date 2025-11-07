import { StyleProp, View, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

type AvatarProps = {
  avatar_url: string;
  style?: StyleProp<ViewStyle>;
  width: number;
  height: number;
};

export function Avatar({ avatar_url, style, width, height }: AvatarProps) {
  return (
    <View style={style}>
      <SvgXml xml={avatar_url} width={width} height={height} />
    </View>
  );
}
