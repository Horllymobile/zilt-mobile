import FloatingActionButton from "@/components/FloatingActionButton";
import MomentCard from "@/components/MomentCard";
import { useAuthStore } from "@/libs/store/authStore";
import { Moment } from "@/models/moments";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
import { useRouter } from "expo-router";
import { Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export default function MomentPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const [moments, setMoments] = useState<Moment[]>([]);
  const { profile } = useAuthStore();

  // const { data: moments, refetch: refetchMoments } = useFindMomentsQuery(
  //   { userId: profile?.id, page: 1, size: 10 },
  //   true
  // );

  // console.log(moments);

  useEffect(() => {
    // if (moments) console.log(moments);
  }, [moments]);

  const socket = useSocket();

  useEffect(() => {
    // SocketService.connect();
    if (!socket) return;

    socket.emit("get_moments", { page: 1, size: 10 });
    socket.on("moments:get_many", (moments: Moment[]) => {
      setMoments(moments);
    });

    return () => {
      socket.off("moments:get_many");
    };
  }, [socket]);

  return (
    <View style={styles.safeArea}>
      {moments?.length ? (
        <FlatList
          data={moments}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <MomentCard
              key={item.id}
              moment={item}
              onPress={() => {
                router.navigate({
                  pathname: "/main/(discover)/moment-detail",
                  params: {
                    momentId: item.id,
                  },
                });
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      ) : (
        <View
          style={{
            // height: height - 250,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>
            No Moment, Click{"  "}
            <TouchableOpacity
            // onPress={() => router.push("/main/(profile)/add-friend")}
            >
              <Zap />
            </TouchableOpacity>
            {"  "}to create
          </Text>
        </View>
      )}
      <FloatingActionButton
        color={THEME.colors.background}
        icon={<Zap color={THEME.colors.text} />}
        onPress={() => router.push("/main/(discover)/create-moment")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // flex: 1,
    // justifyContent: "center",
    backgroundColor: THEME.colors.background,
    minHeight: "100%",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // dimmed background
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%", // Full screen modal that respects SafeAreaView inside CreateMoment
    backgroundColor: THEME.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
});
