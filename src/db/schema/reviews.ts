import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { flashcardsTable } from "./flashcards";
import { groupsTable } from "./groups";
import { userTable } from "./user";

export const reviewsTable = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  flashcardId: integer("flashcard_id").references(() => flashcardsTable.id, {
    onDelete: "cascade",
  }),
  groupId: integer("group_id").references(() => groupsTable.id, {
    onDelete: "cascade",
  }),
  userId: integer("user_id").references(() => userTable.id),
  correct: integer("correct"), // 1 for correct, 0 for incorrect
  timeToAnswer: real("time_to_answer"), // in seconds
  userAnswer: text("user_answer"), // what the user answered

  // Additional SM-2 fields
  repetitions: integer("repetitions").default(0),
  interval: integer("interval").default(1),
  nextReview: text("next_review"),
  easynessFactor: real("easyness_factor").default(2.5),

  // Additional fields from reviewTable
  lastReviewDate: text("last_review_date"), // ISO date of the last review
  responseTime: integer("response_time"), // Time in ms to answer
  lastScore: integer("last_score"), // Last score (0-5 scale)

  isSync: integer("is_sync").default(0),
  createdAt: text("created_at").default(String(new Date().toISOString())),
});

// Export the alternative name for backward compatibility
export const reviewTable = reviewsTable;
