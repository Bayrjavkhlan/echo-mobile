import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const calendarTable = sqliteTable("calendar", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  date: text("date").notNull(),
  minutesSpend: integer("minutes_spend").default(0),
  wordsMemorized: integer("words_memorized").default(0),
  isActive: integer("is_active").default(0),
});
