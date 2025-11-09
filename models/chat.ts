import { Profile } from "./profile";

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  lastMessageId: string;
  createdAt: string;
  updatedAt: string;
  members: Member[];
  lastMessage: Message;
  messages: Message[];
}

export interface Member {
  id: string;
  chatId: string;
  userId: string;
  joinedAt: string;
  user: Profile;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;

  seen: boolean;
  chat?: Chat;
  sender?: Profile;
  chatAsLastMessage: string;

  content: string;
  media: string[];
  createdAt: string;
}

export interface MessageDto {
  chatId: string;
  senderId: string;
  recipientId: string;
  content?: string;
  media?: string[];
}
