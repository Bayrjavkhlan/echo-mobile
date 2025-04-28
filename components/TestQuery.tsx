import { drizzle } from "drizzle-orm/expo-sqlite";
import { testTable } from "../app/db/schema"; // This is where your schema is defined

// Initialize the database without passing schema directly
const db = drizzle({
  schema: { testTable }, // Make sure to pass schema like this
});
