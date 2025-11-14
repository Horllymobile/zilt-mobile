export interface IMessageResp {
  chatId: string;
  content: string;
  media: [];
  messageId: string;
  recipient: {
    avatar: string;
    id: string;
    name: string;
  };
  sender: {
    avatar: string;
    id: string;
    name: string;
  };
}
