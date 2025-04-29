import { deleteAllFlashcardLabelTableData } from "@/app/db/crud/flashcardLabels";
import { deleteAllFlashcardRecords } from "@/app/db/crud/flashcards";
import { deleteAllGroupRecords } from "@/app/db/crud/group";

import useDatabase from "@/hooks/useDatabase";

console.log("Clearing database tables...");
const db = useDatabase();

try {
  await deleteAllFlashcardLabelTableData();
  await deleteAllFlashcardRecords();
  await deleteAllGroupRecords();
  // await deleteAllLabelTableData();

  console.log("✅ All tables cleared.");
} catch (error) {
  console.error("❌ Failed to clear database tables:", error);
}
