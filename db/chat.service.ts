import { eq, inArray } from "drizzle-orm";
import * as crypto from "expo-crypto";
import db from "./database";
import { chatMemberTable, chatTable } from "./schema";

// Create or get chat
export async function createOrGetChat({
  chatId,
  createdBy,
  name,
  isGroup = false,
}: {
  chatId: string;
  createdBy: string;
  name?: string;
  isGroup?: boolean;
}) {
  const id = chatId;
  await db
    .insert(chatTable)
    .values({
      id,
      name: name || null,
      isGroup: isGroup ? 1 : 0,
      status: "PENDING",
      createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    .onConflictDoNothing();

  return id;
}

export async function updateChatStatus(chatId: string, status: string) {
  try {
    const result = await db
      .update(chatTable)
      .set({ status })
      .where(eq(chatTable.id, chatId));

    return result.changes > 0;
  } catch (error) {
    console.error("updateChatStatus error:", error);
    return false;
  }
}

// Get chats for a user
export async function getUserChats(userId: string, limit = 50, offset = 0) {
  // 1️⃣ Get all chat IDs where this user is a member
  const userChatIds = await db
    .select({ chatId: chatMemberTable.chatId })
    .from(chatMemberTable)
    .where(eq(chatMemberTable.userId, userId))
    .all();

  const chatIds = userChatIds.map((row) => row.chatId) as string[];
  if (!chatIds.length) return [];

  // 2️⃣ Fetch chats
  const chats = await db
    .select()
    .from(chatTable)
    .where(inArray(chatTable.id, chatIds))
    .limit(limit)
    .offset(offset)
    .all();

  // 3️⃣ Fetch all members for these chats
  const members = await db
    .select()
    .from(chatMemberTable)
    .where(inArray(chatMemberTable.chatId, chatIds))
    .all();

  // 4️⃣ Group members by chatId
  const membersMap = members.reduce((map, member) => {
    const memberChatId = member.chatId || "";
    if (!map[memberChatId]) map[memberChatId] = [];
    map[memberChatId].push(member);
    return map;
  }, {} as Record<string, typeof members>);

  // 5️⃣ Attach members to chats
  return chats.map((chat) => ({
    ...chat,
    chat_members: membersMap[chat.id] || [],
  }));
}

// Get chats for a user
export async function getChat(chatId: string) {
  const chat = await db
    .select()
    .from(chatTable)
    .where(eq(chatTable.id, chatId))
    // .innerJoin(chatMemberTable, eq(chatMemberTable.chatId, chatTable.id))
    .limit(1);

  return chat[0];
}

// Get chats for a user
export async function getUserChat(userId: string) {
  return await db
    .select()
    .from(chatTable)
    .innerJoin(chatMemberTable, eq(chatMemberTable.chatId, chatTable.id))
    .where(eq(chatMemberTable.userId, userId))
    .limit(1);
}

// Add a member to chat
export async function addChatMember({
  chatId,
  userId,
  role = "MEMBER",
}: {
  chatId: string;
  userId: string;
  role?: "OWNER" | "MEMBER";
}) {
  await db
    .insert(chatMemberTable)
    .values({
      id: crypto.randomUUID(),
      chatId,
      userId,
      joinedAt: Date.now(),
      role,
    })
    .onConflictDoNothing();
}

// Get members of a chat
export async function getChatMembers(chatId: string) {
  return db
    .select()
    .from(chatMemberTable)
    .where(eq(chatMemberTable.chatId, chatId))
    .all();
}
