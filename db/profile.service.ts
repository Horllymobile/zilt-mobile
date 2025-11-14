import { eq } from "drizzle-orm";
import db from "./database";
import { profileTable } from "./schema";

// Save or update a profile
export async function saveProfile(payload: {
  id: string;
  name?: string;
  avatar?: string;
}) {
  await db
    .insert(profileTable)
    .values(payload)
    .onConflictDoUpdate({
      target: profileTable.id,
      set: {
        name: payload.name,
        avatar: payload.avatar,
      },
    });
}

// Get a profile by ID
export async function getProfile(id: string) {
  return await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.id, id))
    .get();
}

// Delete profile
export async function deleteProfile(id: string) {
  await db.delete(profileTable).where(eq(profileTable.id, id));
}
