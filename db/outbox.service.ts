import { eq } from "drizzle-orm";
import db from "./database";
import { outboxTable } from "./schema";

// Add message to outbox
export async function saveOutboxMessage(message: {
  localId: string;
  chatId: string;
  senderId: string;
  type?: string;
  content?: string;
  recipientId?: string;
  media?: string;
}) {
  await db
    .insert(outboxTable)
    .values({
      ...message,
      status: "SENDING",
      createdAt: Date.now(),
      media: message.media,
    })
    .onConflictDoNothing();
}

// Get pending outbox messages
export async function getOutboxMessages(status: string) {
  return await db
    .select()
    .from(outboxTable)
    .where(eq(outboxTable.status, status))
    .all();
}

export async function updateOutxoxStatus(messageId: string, status: string) {
  try {
    const result = await db
      .update(outboxTable)
      .set({ status: status })
      .where(eq(outboxTable.localId, messageId));

    return result.changes > 0;
  } catch (error) {
    console.error("updateChatStatus error:", error);
    return false;
  }
}

// Remove from outbox after sent
export async function removeOutboxMessage(localId: string) {
  await db.delete(outboxTable).where(eq(outboxTable.localId, localId));
}
