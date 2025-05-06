import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { flashcardsTable } from "./flashcards";

export const wrongAnswersTable = sqliteTable("wrong_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flashcardId: integer("flashcard_id")
    .notNull()
    .references(() => flashcardsTable.id),
  wrongAnswer2: text("text"),
});
