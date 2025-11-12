"use client";
import { Avatar } from "@/components/Avatar";
import { PlainTextInput } from "@/components/PlainTextInput";
import { useAuthStore } from "@/libs/store/authStore";
import { ErrorResponse } from "@/models/response";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { THEME } from "@/shared/constants/theme";
import { useFindFriendQuery } from "@/shared/services/auth/authApi";
import { useCreateChatMutation } from "@/shared/services/chats/chatApi";
import { useRouter } from "expo-router";
import { MessageCircle, Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddFriend() {
  const { width } = Dimensions.get("window");
  const [name, setName] = useState("");
  const router = useRouter();
  const { profile } = useAuthStore();
  const { data, refetch, isFetching, isError, error } = useFindFriendQuery(
    false,
    name
  );

  const err = error as unknown as ErrorResponse;
  //   console.log(err);
  const user = data?.data;
  //   console.log(user);

  const createChatMutation = useCreateChatMutation();

  //   router.push(`/main/(chats)/`);

  const onChat = () => {
    if (user) {
      router.push({
        pathname: `/main/(chats)/message`,
        params: {
          person: JSON.stringify(user),
        },
      });
    }
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError, error]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
      }}
    >
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <X color={THEME.colors.text} size={24} />
          </TouchableOpacity>
          {/* <Text style={{ fontSize: 18, fontWeight: "medium" }}>Back</Text> */}
        </View>
      </View>

      {user && (
        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 16,
            gap: 15,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: THEME.colors.background,
            paddingBottom: 20,
          }}
        >
          <Avatar
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: "#c3adef",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            avatar_url={user?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
            width={80}
            height={80}
          />

          <View style={{ alignItems: "center", gap: 5 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: THEME.colors.text,
              }}
            >
              {user?.name}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: 10,
              backgroundColor: THEME.colors.surface,
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderRadius: 15,
            }}
            disabled={createChatMutation.isPending}
            onPress={onChat}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              {createChatMutation.isPending ? (
                <ActivityIndicator size={"small"} />
              ) : (
                <MessageCircle color={THEME.colors.text} size={18} />
              )}
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  color: THEME.colors.text,
                  fontWeight: "500",
                }}
              >
                Chat
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ marginTop: 20, paddingHorizontal: 16, gap: 15 }}>
        <Text
          className="text-center"
          style={{
            fontSize: 20,
            textAlign: "center",
            color: THEME.colors.text,
          }}
        >
          Search for friends and start chatting
        </Text>
        {/* QR Code Scanner component would go here */}
        <PlainTextInput
          label=""
          placeholder="Enter your username"
          width={width}
          plainText={name}
          setPlainText={(n) => {
            setName(n.toLowerCase());
          }}
        />

        <TouchableOpacity
          style={{
            alignSelf: "center",
            marginTop: 10,
            backgroundColor: THEME.colors.surface,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderRadius: 15,
          }}
          disabled={isFetching}
          onPress={() => refetch()}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            {isFetching ? (
              <ActivityIndicator size={"small"} color={THEME.colors.text} />
            ) : (
              <>
                <Search color={THEME.colors.text} size={18} />

                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    color: THEME.colors.text,
                    fontWeight: "500",
                  }}
                >
                  Search
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
