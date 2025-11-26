import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { flashcardsTable } from "./flashcards";

export const wrongAnswersTable = sqliteTable("wrong_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flashcardId: integer("flashcard_id").notNull(),
  wrongText: text("wrong_text").notNull(),
  isSync: integer("is_sync").default(0),
});

export type WrongAnswer = typeof wrongAnswersTable.$inferSelect;
export type NewWrongAnswer = typeof wrongAnswersTable.$inferInsert;
