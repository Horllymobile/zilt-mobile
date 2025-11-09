import { getColorFromString } from "@/libs/utils/colors";
import { timeAgo } from "@/libs/utils/lib";
import { Moment } from "@/models/moments";
import { THEME } from "@/shared/constants/theme";
import { socketService } from "@/shared/services/socket";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react-native";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "./Avatar";

interface MomentCardProps {
  moment: Moment;
  onPress?: () => void;
}

export default function MomentCard({ moment, onPress }: MomentCardProps) {
  const momentId = moment.id;

  const socket = socketService?.getSocket();

  useEffect(() => {
    // SocketService.connect();
    if (!socket) return;
    const eventKey = `moment:${momentId}:typing`;
    socket.emit("join_moment", { momentId });

    socket.on("moment:joined", ({ roomId, userId }) => {
      // console.log("Joined Moment", roomId);
    });

    // socket.on(eventKey, ({ userId, isTyping }) => {
    //   console.log(`User ${userId} is typing`);

    //   setTypingUserIds((prev) => {
    //     if (isTyping) return [...new Set([...prev, userId])];
    //     return prev.filter((id) => id !== userId);
    //   });
    // });
  }, [socket, momentId]);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.authorContainer}>
          <Avatar
            avatar_url={
              moment?.author?.avatar || moment.author.avatar_url || ""
            }
            style={{
              backgroundColor: getColorFromString(moment.author.name),
              borderRadius: 50,
            }}
            width={40}
            height={40}
          />
          <View style={styles.headerText}>
            <Text style={styles.authorName}>{moment.author.name}</Text>
            <Text style={styles.time}>{timeAgo(moment.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color={THEME.colors.text} />
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
      <View style={styles.actionsContainer}>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={18} color="#FF444F" />
            <Text style={styles.actionText}>{moment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={18} color={THEME.colors.text} />
            <Text style={styles.actionText}>{moment.commentsCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.background,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    shadowColor: THEME.colors.elevation.level5,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    marginLeft: 10,
    justifyContent: "center",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  time: {
    fontSize: 12,
    color: THEME.colors.primaryContainer,
    marginTop: 2,
  },
  moreButton: {
    padding: 6,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
    color: THEME.colors.text,
  },
  media: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: THEME.colors.text,
  },
});
