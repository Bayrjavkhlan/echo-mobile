import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { flashcardsTable } from "./flashcards";
import { groupsTable } from "./groups";

export const reviewsTable = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flashcardId: integer("flashcard_id").references(() => flashcardsTable.id, {
    onDelete: "cascade",
  }),
  groupId: integer("group_id").references(() => groupsTable.id, {
    onDelete: "cascade",
  }),
  correct: integer("correct"), // 1 for correct, 0 for incorrect
  timeToAnswer: real("time_to_answer"), // in seconds
  userAnswer: text("user_answer"), // what the user answered
  createdAt: text("created_at").default(String(new Date().toISOString())),
});
