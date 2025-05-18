import { desc } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const groupsTable = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  isSync: integer("is_sync").default(0),

  createdAt: integer("created_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});
