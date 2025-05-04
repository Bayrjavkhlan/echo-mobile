import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";
import { groupsTable } from "./groups";
import { flashcardsTable } from "./flashcards";

export const reviewTable = sqliteTable("flashcard_review", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Unique ID for the review entry

  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  // References the user who owns this review entry

  groupId: integer("group_id")
    .notNull()
    .references(() => groupsTable.id),
  // References the group this flashcard belongs to (for aggregating stats)

  flashcardId: integer("flashcard_id")
    .notNull()
    .references(() => flashcardsTable.id),
  // References the specific flashcard being reviewed

  lastReviewDate: text("last_review_date").notNull(),
  // ISO date of the last time this flashcard was reviewed (e.g. 2025-05-04T10:00:00Z)

  nextReview: text("next_review").notNull(),
  // ISO date for when the flashcard should be reviewed next

  repetitions: integer("repetitions").notNull(),
  // Number of consecutive successful reviews (used in SM-2 formula)

  responseTime: integer("response_time"),
  // Time in milliseconds or seconds it took user to answer this card during last review

  easynessFactor: real("easyness_factor").notNull(),
  // The SM-2 Easiness Factor (usually starts at 2.5, adjusted based on performance)

  interval: integer("interval").notNull(),
  // Number of days until the next review (derived from repetitions & EF)

  lastScore: integer("last_score"),
  // Last score given for this flashcard (e.g. 0–5 scale based on recall quality)

  createdAt: integer("created_at").notNull().default(1),
  // Timestamp or numeric placeholder for record creation (consider switching to ISO `text` if storing real time)
});
