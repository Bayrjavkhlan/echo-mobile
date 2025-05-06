import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { groupsTable } from "./groups";

export const flashcardsTable = sqliteTable("flashcards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: integer("group_id")
    .notNull()
    .references(() => groupsTable.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  easynessFactor: real("easyness_factor").default(2.5),
  reviewCount: integer("review_count").default(0),
  lastReviewedAt: text("last_reviewed_at"),
  isSync: integer("is_active").default(0),

  createdAt: integer("created_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});
