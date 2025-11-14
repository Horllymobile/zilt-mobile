import { getUserChats } from "@/db/chat.service";
import { getMessage } from "@/db/message.service";
import { getProfile } from "@/db/profile.service";
import { useChatStore } from "@/libs/store/chatStore";
import { useEffect } from "react";

const useLoadChats = (userId: string) => {
  const { refetch, setChatData } = useChatStore();

  useEffect(() => {
    const load = async () => {
      setChatData({ fetching: true });
      const localChats = await getUserChats(userId);
      const mappedChats = await mapChat(localChats);
      setChatData({ chats: mappedChats, refetch: false, fetching: false });
    };

    // initial load
    load();
  }, [userId]);

  async function mapChat(chats: any[]) {
    return await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = chat.lastMessageId
          ? await getMessage(chat.lastMessageId)
          : null;

        const mappedProfile = await mapProfile(chat);

        return {
          ...chat,
          chat_members: mappedProfile,
          lastMessage,
        };
      })
    );
  }

  async function mapProfile(chat: any) {
    return await Promise.all(
      chat.chat_members.map(async (member: any) => {
        const profile = member.userId ? await getProfile(member.userId) : null;
        return {
          ...member,
          profile,
        };
      })
    );
  }

  useEffect(() => {
    if (refetch) {
      setChatData({ fetching: false });
      const reload = async () => {
        const freshChats = await getUserChats(userId);
        const mappedChats = await mapChat(freshChats);
        setChatData({ chats: mappedChats, refetch: false, fetching: false });
      };

      reload();
    }
  }, [refetch, userId]);
};

export default useLoadChats;
