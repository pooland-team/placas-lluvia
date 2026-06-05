import { and, desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  conversations,
  InsertConversation,
  InsertMessage,
  InsertPlate,
  InsertUser,
  messages,
  plates,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

// ─── Plates ───────────────────────────────────────────────────────────────────

export async function createPlate(data: InsertPlate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(plates).values(data).$returningId();
  return result;
}

export async function getPlateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(plates).where(eq(plates.id, id)).limit(1);
  return result[0];
}

export async function listFoundPlates(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(plates)
    .where(and(eq(plates.type, "found"), eq(plates.status, "active")))
    .orderBy(desc(plates.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function searchPlatesByNumber(plateNumber: string) {
  const db = await getDb();
  if (!db) return { lost: [], found: [] };
  const normalized = plateNumber.trim().toUpperCase();
  const all = await db
    .select()
    .from(plates)
    .where(eq(plates.plateNumber, normalized))
    .orderBy(desc(plates.createdAt));
  return {
    lost: all.filter((p) => p.type === "lost"),
    found: all.filter((p) => p.type === "found"),
  };
}

export async function getUserPlates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(plates)
    .where(eq(plates.userId, userId))
    .orderBy(desc(plates.createdAt));
}

export async function updatePlateStatus(
  id: number,
  status: "active" | "claimed" | "closed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(plates).set({ status }).where(eq(plates.id, id));
}

// ─── Conversations ────────────────────────────────────────────────────────────

export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(conversations).values(data).$returningId();
  return result;
}

export async function getConversationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  return result[0];
}

export async function getConversationByPlateAndUsers(
  foundPlateId: number,
  initiatorId: number,
  responderId: number
) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.foundPlateId, foundPlateId),
        or(
          and(
            eq(conversations.initiatorId, initiatorId),
            eq(conversations.responderId, responderId)
          ),
          and(
            eq(conversations.initiatorId, responderId),
            eq(conversations.responderId, initiatorId)
          )
        )
      )
    )
    .limit(1);
  return result[0];
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(conversations)
    .where(
      or(
        eq(conversations.initiatorId, userId),
        eq(conversations.responderId, userId)
      )
    )
    .orderBy(desc(conversations.updatedAt));
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(messages).values(data).$returningId();
  return result;
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function markMessagesAsRead(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  // Mark messages sent by the OTHER party as read (not the current user's own messages)
  const conv = await getConversationById(conversationId);
  if (!conv) return;
  const otherUserId =
    conv.initiatorId === userId ? conv.responderId : conv.initiatorId;
  await db
    .update(messages)
    .set({ read: true })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.senderId, otherUserId)
      )
    );
}

export async function countUnreadMessages(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const convs = await getUserConversations(userId);
  if (convs.length === 0) return 0;
  let total = 0;
  for (const conv of convs) {
    const otherUserId =
      conv.initiatorId === userId ? conv.responderId : conv.initiatorId;
    const msgs = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conv.id),
          eq(messages.senderId, otherUserId),
          eq(messages.read, false)
        )
      );
    total += msgs.length;
  }
  return total;
}
