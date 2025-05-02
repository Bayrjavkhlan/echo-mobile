import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const testTable = sqliteTable("test_table", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  testNumber: integer("test_number").notNull(),
  testText: text("test_text").notNull(),
});
