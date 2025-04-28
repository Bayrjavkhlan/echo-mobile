import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { flashcardsTable } from "./flashcards";
import { labelsTable } from "./labels";

export const flashcardLabelsTable = sqliteTable("flashcard_labels", {
  flashcardId: integer("flashcard_id")
    .notNull()
    .references(() => flashcardsTable.id),
  labelId: integer("label_id")
    .notNull()
    .references(() => labelsTable.id),
});
