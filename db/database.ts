import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
// import {
//   chatMemberTable,
//   chatTable,
//   messageTable,
//   outboxTable,
//   profileTable,
// } from "./schema";
const expo = SQLite.openDatabaseSync("ziltdatabase.db");
const db = drizzle(expo);

export async function initDb() {
  // await db.delete(profileTable);
  // await db.delete(messageTable);
  // await db.delete(chatTable);
  // await db.delete(chatMemberTable);
  // await db.delete(outboxTable);
}

export default db;
