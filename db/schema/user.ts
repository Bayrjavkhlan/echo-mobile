import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serverId: integer("server_id"),
  username: text("username").notNull(),
  age: integer("age"),
  email: text("email"),
  password: text("password"),
  isSync: integer("is_active").default(0),

  createdAt: integer("created_at").notNull().default(1),
  updatedBy: text("updated_by").notNull(),
});
