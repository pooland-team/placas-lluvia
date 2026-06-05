import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Reportes de placas: tanto perdidas como encontradas.
 * type = 'lost' | 'found'
 */
export const plates = mysqlTable("plates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["lost", "found"]).notNull(),
  plateNumber: varchar("plateNumber", { length: 20 }).notNull(),
  description: text("description"),
  incidentDate: timestamp("incidentDate").notNull(),
  photoUrl: text("photoUrl"),
  photoKey: text("photoKey"),
  /** Solo para placas encontradas: zona aproximada */
  locationApprox: varchar("locationApprox", { length: 255 }),
  /** Estado del reporte */
  status: mysqlEnum("status", ["active", "claimed", "closed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Plate = typeof plates.$inferSelect;
export type InsertPlate = typeof plates.$inferInsert;

/**
 * Conversaciones entre el dueño de una placa y quien la encontró.
 * Cada conversación está vinculada a un reporte de placa encontrada.
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  /** ID del reporte de placa encontrada que originó el contacto */
  foundPlateId: int("foundPlateId").notNull(),
  /** ID del reporte de placa perdida (si existe) */
  lostPlateId: int("lostPlateId"),
  /** Usuario que inicia el contacto (generalmente el dueño) */
  initiatorId: int("initiatorId").notNull(),
  /** Usuario que encontró la placa */
  responderId: int("responderId").notNull(),
  status: mysqlEnum("status", ["open", "closed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Mensajes internos dentro de una conversación.
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
