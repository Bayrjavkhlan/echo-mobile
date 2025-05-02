import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const labelsTable = sqliteTable("labels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  count: integer("count").notNull(),
  createdAt: integer("created_at").notNull().default(1),
  updatedBy: text("updated_by").notNull(),
});
