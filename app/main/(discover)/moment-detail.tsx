"use client";
import { Avatar } from "@/components/Avatar";
import { useAuthStore } from "@/libs/store/authStore";
import { getColorFromString } from "@/libs/utils/colors";
import { timeAgo } from "@/libs/utils/lib";
import { Moment } from "@/models/moments";
import { THEME } from "@/shared/constants/theme";
import { useSocket } from "@/shared/hooks/use-socket";
import { socketService } from "@/shared/services/socket";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MomentDetail() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { momentId } = useLocalSearchParams();
  // console.log("Moment ID", momentId);

  // TODO: Fetch single moment by ID
  // const { data: moment, isLoading } = useFindMomentQuery(momentId);

  // Placeholder data for demo:

  const [moment, setMoment] = useState<Moment | undefined>(undefined);
  const socket = useSocket();

  const getDataFromSocket = () => {
    socket?.on("moments:get_one", (moment: Moment) => {
      setMoment(moment);
    });

    // // Optional: Confirm room join
    // socket?.on("moment:joined", ({ roomId }) => {
    //   console.log(`Joined room: ${roomId}`);
    // });

    socket?.on("moment:update", (updatedMoment: Moment) => {
      setMoment(updatedMoment);
    });
  };

  useEffect(() => {
    if (!socket || !momentId) return;

    // Request the moment details
    socket.emit("get_moment", { momentId });

    socketService.onConnect(() => {
      getDataFromSocket();
    });

    getDataFromSocket();

    // Cleanup when unmounted
    return () => {
      socket.off("moment:get_one");
      socket.off("moment:joined");
      socket.off("moment:update");
    };
  }, [socket, momentId]);

  return (
    <SafeAreaView style={styles.container}>
      {moment ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={THEME.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Author Row */}
          <View style={styles.authorRow}>
            <Avatar
              avatar_url={moment?.author?.avatar ?? ""}
              style={{
                backgroundColor: getColorFromString(moment?.author?.name),
                borderRadius: 50,
              }}
              width={50}
              height={50}
            />
            <View style={styles.authorText}>
              <Text style={styles.authorName}>{moment.author.name}</Text>
              <Text style={styles.time}>{timeAgo(moment.createdAt)}</Text>
            </View>
            <TouchableOpacity style={{ marginLeft: "auto" }}>
              <MoreHorizontal color={THEME.colors.text} size={20} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {moment.content ? (
            <Text style={styles.content}>{moment.content}</Text>
          ) : null}

          {/* Media */}
          {moment.mediaUrl ? (
            <Image
              source={{ uri: moment.mediaUrl }}
              style={styles.media}
              resizeMode="cover"
            />
          ) : null}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={20} color="#FF444F" />
              <Text style={styles.actionText}>{moment.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color={THEME.colors.text} />
              <Text style={styles.actionText}>{moment.commentsCount}</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section Placeholder */}
          <View style={styles.commentsSection}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: THEME.colors.text,
              }}
            >
              Comments
            </Text>
            {/* TODO: Render comments list here */}
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 16,
  },
  header: {
    marginVertical: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  authorText: {
    marginLeft: 12,
    justifyContent: "center",
    color: THEME.colors.text,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  time: {
    fontSize: 12,
    color: THEME.colors.text,
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    marginBottom: 12,
    color: THEME.colors.text,
  },
  media: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: THEME.colors.text,
  },
  commentsSection: {
    marginTop: 12,
    color: THEME.colors.text,
  },
});
