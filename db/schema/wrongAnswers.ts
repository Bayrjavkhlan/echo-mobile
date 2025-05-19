import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { flashcardsTable } from "./flashcards";

export const wrongAnswersTable = sqliteTable("wrong_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flashcardId: integer("flashcard_id").notNull(),
  wrongText: text("wrong_text").notNull(),
  correctText: text("correct_text").notNull(),
  userId: integer("user_id"),
  serverId: integer("server_id"),
  isSync: integer("is_sync").default(0),
  createdAt: integer("created_at").default(sql`(strftime('%s', 'now') * 1000)`),
  updatedAt: integer("updated_at"),
  updatedBy: text("updated_by"),
});

export type WrongAnswer = typeof wrongAnswersTable.$inferSelect;
export type NewWrongAnswer = typeof wrongAnswersTable.$inferInsert;
