import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const settingsTable = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id),
  mode: text("mode", { enum: ["light", "dark", "auto"] }).notNull(),
  AiGeneratedWrongAnswers: integer("Ai_generated_wrong_answers").notNull().default(1),
  language: text("language", { enum: ["mn", "en"] }).notNull(),
  isSync: integer("is_active").default(0),

  createdAt: integer("created_at").notNull().default(1),
  updatedBy: text("updated_by").notNull(),
});
