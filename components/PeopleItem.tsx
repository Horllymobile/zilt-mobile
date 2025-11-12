import { useAuthStore } from "@/libs/store/authStore";
import { getColorFromString } from "@/libs/utils/colors";
import { Profile } from "@/models/profile";
import { COLORS } from "@/shared/constants/color";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { THEME } from "@/shared/constants/theme";
import { useCreateChatMutation } from "@/shared/services/chats/chatApi";
import { router } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "./Avatar";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};
export default function PeopleItem({ person }: { person: Profile }) {
  // console.log("Member", member);

  // console.log(person.name);

  const { profile } = useAuthStore();

  const createChatMutation = useCreateChatMutation();

  const onChat = () => {
    if (person) {
      router.push({
        pathname: `/main/(chats)/message`,
        params: {
          person: JSON.stringify(person),
        },
      });
    }
  };

  return (
    <TouchableOpacity
      touchSoundDisabled={true}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",

        alignItems: "center",
        opacity: 1,
        padding: 5,
        borderRadius: 0,
      }}
      // onPress={() => onCreateChat()}
    >
      <View
        style={{
          width: initialLayout.width - 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            alignItems: "center",
            //   justifyContent: "center",
            flexDirection: "row",
            opacity: 1,
            //   padding: 12,
            borderRadius: 0,
          }}
        >
          <Avatar
            avatar_url={person?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              backgroundColor: getColorFromString(person?.name ?? ""),
              overflow: "hidden",
              marginRight: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
            width={40}
            height={40}
          />
          <View style={{}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: THEME.colors.text,
              }}
            >
              {person?.name}
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: THEME.colors.text,
              }}
            >
              {person?.distanceReadable}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            alignSelf: "center",
            // marginTop: 10,
            // backgroundColor: THEME.colors.background,
            paddingHorizontal: 10,
            paddingVertical: 15,
            //   borderRadius: 15,
          }}
          onPress={onChat}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            {createChatMutation.isPending ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <MessageCircle color={COLORS.primary} size={18} />
            )}

            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: COLORS.primary,
                fontWeight: "500",
              }}
            >
              Chat
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* {person.lastSeen && (
        <Text style={{ flex: 2, fontSize: 12, color: "#999", marginLeft: 8 }}>
          {timeAgo(person.lastSeen)}
        </Text>
      )} */}
    </TouchableOpacity>
  );
}
