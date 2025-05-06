import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const calendarTable = sqliteTable("calendar", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => userTable.id),
  date: text("date").notNull(),
  minutesSpent: integer("minutes_spent").default(0),
  wordsMemorized: integer("words_memorized").default(0),
  appOpened: integer("app_opened").default(0),
  isSync: integer("is_sync").default(0),
});
