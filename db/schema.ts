import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// --------------------
// PROFILE TABLE
// --------------------
export const profileTable = sqliteTable("profile", {
  id: text("id").primaryKey(),
  name: text("name"),
  avatar: text("avatar"),
});

// --------------------
// CHATS TABLE
// --------------------
export const chatTable = sqliteTable("chats", {
  id: text("id").primaryKey(),
  name: text("name"),
  isGroup: integer("isGroup").default(0),
  status: text("status").default("PENDING"), // PENDING | ACCEPTED | REJECTED
  lastMessageId: text("lastMessageId").unique(),
  createdBy: text("createdBy"),
  createdAt: integer("createdAt"),
  updatedAt: integer("updatedAt"),
});

// --------------------
// CHAT MEMBERS TABLE
// --------------------
export const chatMemberTable = sqliteTable("chat_members", {
  id: text("id").primaryKey(),
  chatId: text("chatId").references(() => chatTable.id),
  userId: text("userId").references(() => profileTable.id),
  joinedAt: integer("joinedAt"),
  role: text("role").default("MEMBER"), // OWNER | MEMBER
});

// Indexes:
export const chatMembersChatIdIdx = sql`
  CREATE INDEX IF NOT EXISTS idx_chat_members_chatId
  ON chat_members(chatId);
`;

export const chatMembersUserIdIdx = sql`
  CREATE INDEX IF NOT EXISTS idx_chat_members_userId
  ON chat_members(userId);
`;

// --------------------
// MESSAGES TABLE
// --------------------
export const messageTable = sqliteTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chatId").references(() => chatTable.id),
  senderId: text("senderId").references(() => profileTable.id),
  recipientId: text("recipientId").references(() => profileTable.id),
  seen: integer("seen").default(0), // 0 or 1
  status: text("status").default("SENDING"),
  type: text("type"),
  content: text("content"),
  media: text("media"), // JSON string array
  createdAt: integer("createdAt"),
});

// Indexes:
export const messagesChatIdIdx = sql`
  CREATE INDEX IF NOT EXISTS idx_messages_chatId
  ON messages(chatId);
`;

export const messagesCreatedAtIdx = sql`
  CREATE INDEX IF NOT EXISTS idx_messages_createdAt
  ON messages(createdAt);
`;

// --------------------
// OUTBOX TABLE (For Offline)
//
// Stores messages waiting to sync to server.
// --------------------
export const outboxTable = sqliteTable("outbox", {
  localId: text("localId").primaryKey(),
  chatId: text("chatId"),
  senderId: text("senderId"),
  recipientId: text("recipientId"),
  type: text("type"),
  status: text("status").default("SENDING"),
  content: text("content"),
  media: text("media"),
  createdAt: integer("createdAt"),
});
