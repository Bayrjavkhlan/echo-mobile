// app/db/hooks/useDatabase.ts
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";

const useDatabase = () => {
  const expo = SQLite.openDatabaseSync("echo.db");

  const db = drizzle(expo, { schema });

  return db;
};

export default useDatabase;
