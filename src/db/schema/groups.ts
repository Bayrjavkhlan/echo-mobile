import { desc } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const groupsTable = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  isSync: integer("is_sync").default(0),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),

  createdAt: integer("created_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});
