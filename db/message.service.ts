import { ILocalMessageDto } from "@/models/local-chat";
import { desc, eq } from "drizzle-orm";
import * as crypto from "expo-crypto";
import { getChat } from "./chat.service";
import db from "./database";
import {
  chatMemberTable,
  chatTable,
  messageTable,
  profileTable,
} from "./schema";

export function generateChatId(senderId: string, recipientId: string) {
  return [senderId, recipientId].sort().join("-");
}

// Save a message (auto-create chat if missing)
export async function saveMessage(message: ILocalMessageDto) {
  const {
    chatId: incomingChatId,
    sender,
    recipient,
    content,
    media,
    messageId,
  } = message;
  const now = Date.now();
  let chatId = incomingChatId;

  try {
    const chat = await getChat(chatId);

    // Start transaction
    const mgs = await db.transaction(async (tx) => {
      // 1️⃣ Create chat if missing
      if (!chat) {
        await tx.insert(profileTable).values({
          id: sender.id,
          name: sender.name,
          avatar: sender.avatar,
        });

        await tx.insert(profileTable).values({
          id: recipient.id,
          name: recipient.name,
          avatar: recipient.avatar,
        });

        await tx.insert(chatTable).values({
          id: chatId,
          isGroup: 0,
          status: "PENDING",
          createdBy: sender.id,
          createdAt: now,
          updatedAt: now,
        });

        // Add members
        await tx.insert(chatMemberTable).values({
          id: crypto.randomUUID(),
          chatId,
          userId: sender.id,
          joinedAt: now,
          role: "OWNER",
        });
        await tx.insert(chatMemberTable).values({
          id: crypto.randomUUID(),
          chatId,
          userId: recipient.id,
          joinedAt: now,
          role: "MEMBER",
        });
      }

      // 2️⃣ Insert message
      const msgId = messageId || crypto.randomUUID();
      await tx.insert(messageTable).values({
        id: msgId,
        chatId,
        senderId: sender.id,
        seen: 0,
        content: content || null,
        media: media ? JSON.stringify(media) : null,
        createdAt: now,
      });

      // 3️⃣ Update lastMessageId in chat
      await tx
        .update(chatTable)
        .set({ lastMessageId: msgId, updatedAt: now })
        .where(eq(chatTable.id, chatId));

      return { chatId, msgId };
    });

    return mgs;
  } catch (error) {
    console.log(error);
  }
}

export async function updateMessageSeenStatus(messageId: string) {
  try {
    const result = await db
      .update(messageTable)
      .set({ seen: 1 })
      .where(eq(messageTable.id, messageId));

    return result.changes > 0;
  } catch (error) {
    console.error("updateChatStatus error:", error);
    return false;
  }
}

export async function updateMessageStatus(messageId: string, status: string) {
  try {
    const result = await db
      .update(messageTable)
      .set({ status: status })
      .where(eq(messageTable.id, messageId));

    return result.changes > 0;
  } catch (error) {
    console.error("updateChatStatus error:", error);
    return false;
  }
}

// Get messages for a chat
export async function getMessages(chatId: string, limit = 50, offset = 0) {
  return db
    .select()
    .from(messageTable)
    .where(eq(messageTable.chatId, chatId))
    .orderBy(desc(messageTable.createdAt))
    .limit(limit)
    .offset(offset)
    .all();
}

export async function getMessage(messageId: string) {
  if (!messageId) return null;
  const message = await db
    .select()
    .from(messageTable)
    .where(eq(messageTable.id, messageId))
    .limit(1);

  console.log(message[0]);

  return message[0];
}
