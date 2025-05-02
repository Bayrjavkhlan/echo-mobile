import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { flashcardsTable } from "./flashcards";
import { labelsTable } from "./labels";
import { relations } from "drizzle-orm";

export const flashcardLabelsTable = sqliteTable("flashcard_labels", {
  flashcardId: integer("flashcard_id")
    .notNull()
    .references(() => flashcardsTable.id),
  labelId: integer("label_id")
    .notNull()
    .references(() => labelsTable.id),
});

export const flashcardLabelsRelations = relations(flashcardLabelsTable, ({ one }) => ({
  label: one(labelsTable, {
    fields: [flashcardLabelsTable.labelId],
    references: [labelsTable.id],
  }),
}));
