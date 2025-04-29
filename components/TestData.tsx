import { openDatabaseSync } from "expo-sqlite";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";

export const TestData = () => {
  const expoDb = openDatabaseSync("echo.db");

  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  if (error) {
    return (
      <ThemedView>
        <ThemedText>Migration error: {error.message}</ThemedText>
      </ThemedView>
    );
  }

  if (!success) {
    return (
      <ThemedView>
        <ThemedText>Migration is in progress...</ThemedText>
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <ThemedText>Test Data</ThemedText>
    </ThemedView>
  );
};
