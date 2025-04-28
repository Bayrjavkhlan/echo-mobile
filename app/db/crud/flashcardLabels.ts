import useDatabase from "@/hooks/useDatabase";
import { eq, and } from "drizzle-orm";
import { flashcardLabelsTable, flashcardsTable, labelsTable } from "../schema";

const db = useDatabase();
export const addLabelToFlashcard = async (
  flashcardId: number,
  labelId: number
) => {
  try {
    const result = await db.insert(flashcardLabelsTable).values({
      flashcardId,
      labelId,
    });
    return result;
  } catch (error) {
    console.error("Error adding label to flashcard:", error);
  }
};
export const removeLabelFromFlashcard = async (
  flashcardId: number,
  labelId: number
) => {
  try {
    const result = await db
      .delete(flashcardLabelsTable)
      .where(
        and(
          eq(flashcardLabelsTable.flashcardId, flashcardId),
          eq(flashcardLabelsTable.labelId, labelId)
        )
      );
    return result;
  } catch (error) {
    console.error("Error removing label from flashcard:", error);
  }
};

export const getLabelsForFlashcard = async (flashcardId: number) => {
  try {
    const result = await db
      .select()
      .from(flashcardLabelsTable)
      .innerJoin(labelsTable, eq(flashcardLabelsTable.labelId, labelsTable.id))
      .where(eq(flashcardLabelsTable.flashcardId, flashcardId));
    return result;
  } catch (error) {
    console.error("Error retrieving labels for flashcard:", error);
  }
};

export const getFlashcardsForLabel = async (labelId: number) => {
  try {
    const result = await db
      .select()
      .from(flashcardLabelsTable)
      .innerJoin(
        flashcardsTable,
        eq(flashcardLabelsTable.flashcardId, flashcardsTable.id)
      )
      .where(eq(flashcardLabelsTable.labelId, labelId));
    return result;
  } catch (error) {
    console.error("Error retrieving flashcards for label:", error);
  }
};
