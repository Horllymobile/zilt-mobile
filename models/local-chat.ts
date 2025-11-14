export interface ILocalChat {
  chat_members: ILocalChatMember[];
  createdAt: number;
  createdBy: string;
  id: string;
  isGroup: number;
  lastMessage?: ILocalMessage;
  messages?: ILocalMessage[];
  lastMessageId: string;
  name: string | null;
  status: string;
  updatedAt: number;
}

export interface ILocalMessage {
  chatId: string;
  content: string;
  createdAt: number;
  id: string;
  status: string;
  media: string;
  seen: number;
  senderId: string;
  type: null;
}

export interface ILocalChatMember {
  chatId: string;
  id: string;
  joinedAt: number;
  profile: ILocalChatProfile;
  role: string;
  userId: string;
}

export interface ILocalChatProfile {
  id: string;
  name: string;
  avatar: string;
  avatar_url?: string;
}

export interface ILocalMessageDto {
  chatId: string;
  messageId?: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  status?: string;
  recipient: {
    id: string;
    name: string;
    avatar: string;
  };
  content?: string;
  media?: string[];
}
