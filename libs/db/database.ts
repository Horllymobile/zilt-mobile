import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("ziltchat.db");

export const initDB = () => {
  db.withTransactionAsync(async () => {
    await db.execAsync(`    
        id TEXT PRIMARY KEY,
        name TEXT,
        avatar TEXT
      );
    `);
    await db.execAsync(`    
        CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT,
        isGroup INTEGER DEFAULT 0,
        status TEXT DEFAULT 'PENDING',
        lastMessageId TEXT UNIQUE,
        createdBy TEXT,
        
        createdAt INTEGER,
        updatedAt INTEGER,

        FOREIGN KEY (lastMessageId) REFERENCES messages(id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS chat_members (
        id TEXT PRIMARY KEY,
        chatId TEXT,
        userId TEXT,
        joinedAt INTEGER,
        role TEXT DEFAULT 'MEMBER',

        FOREIGN KEY (chatId) REFERENCES chats(id),
        FOREIGN KEY (userId) REFERENCES profiles(id)
      );
    `);

    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_chat_members_chatId ON chat_members(chatId);`
    );
    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_chat_members_userId ON chat_members(userId);`
    );

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chatId TEXT,
        senderId TEXT,

        seen INTEGER DEFAULT 0,
        type TEXT,
        content TEXT,
        media TEXT, -- stored as JSON string "['file1','file2']"

        createdAt INTEGER,

        FOREIGN KEY (chatId) REFERENCES chats(id),
        FOREIGN KEY (senderId) REFERENCES profiles(id)
      );
    `);

    // Indexes for message pagination
    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_messages_chatId ON messages(chatId);`
    );
    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_messages_createdAt ON messages(createdAt);`
    );

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS outbox (
        localId TEXT PRIMARY KEY,
        chatId TEXT,
        senderId TEXT,
        type TEXT,
        content TEXT,
        media TEXT,
        createdAt INTEGER
      );
    `);
  });
};

export default db;
