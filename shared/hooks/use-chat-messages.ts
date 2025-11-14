import { getMessages } from "@/db/message.service";
import { useMessageStore } from "@/libs/store/messageStore";
import { ILocalMessage } from "@/models/local-chat";
import { useEffect } from "react";

const useLoadMessages = (chatId: string) => {
  const {
    refetch,
    setMessageData,
    chat,
    chatId: storedChatId,
  } = useMessageStore();

  useEffect(() => {
    const load = async () => {
      setMessageData({ fetching: true });
      const localMessages = (await getMessages(
        chatId || (storedChatId as string)
      )) as ILocalMessage[];
      setMessageData({
        messages: localMessages,
        refetch: false,
        fetching: false,
      });
    };
    load();
  }, [chatId, storedChatId]);

  useEffect(() => {
    if (refetch) {
      setMessageData({ fetching: false });
      const reload = async () => {
        const localMessages = (await getMessages(
          chatId || storedChatId || ""
        )) as ILocalMessage[];
        setMessageData({
          messages: localMessages,
          refetch: false,
          fetching: false,
        });
      };

      reload();
    }
  }, [refetch, chatId, storedChatId]);
};

export default useLoadMessages;
