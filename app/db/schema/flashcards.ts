import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { groupsTable } from "./groups";

export const flashcardsTable = sqliteTable("flashcards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: integer("group_id")
    .notNull()
    .references(() => groupsTable.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});
