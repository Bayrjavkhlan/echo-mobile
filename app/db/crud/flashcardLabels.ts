import useDatabase from "@/hooks/useDatabase";
import { eq, and } from "drizzle-orm";
import { flashcardLabelsTable, flashcardsTable, labelsTable } from "../schema";

const db = useDatabase();
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
export const addLabelToFlashcard = async (
  flashcardId: number,
  labelId: number
) => {
  try {
    const existing = await db
      .select()
      .from(flashcardLabelsTable)
      .where(
        and(
          eq(flashcardLabelsTable.flashcardId, 1),
          eq(flashcardLabelsTable.labelId, 1)
        )
      );

    if (!existing || existing.length === 0) {
      await db.insert(flashcardLabelsTable).values({
        flashcardId,
        labelId,
      });
    }

    return await getLabelsForFlashcard(flashcardId);
  } catch (error) {
    console.error("Error adding label to flashcard:", error);
    throw error;
  }
};

export const removeLabelFromFlashcard = async (
  flashcardId: number,
  labelId: number
) => {
  try {
    await db
      .delete(flashcardLabelsTable)
      .where(
        and(
          eq(flashcardLabelsTable.flashcardId, flashcardId),
          eq(flashcardLabelsTable.labelId, labelId)
        )
      );

    // Return updated labels for this flashcard
    return await getLabelsForFlashcard(flashcardId);
  } catch (error) {
    console.error("Error removing label from flashcard:", error);
    throw error;
  }
};

export const updateFlashcardLabels = async (
  flashcardId: number,
  labelIds: number[]
) => {
  try {
    await db
      .delete(flashcardLabelsTable)
      .where(eq(flashcardLabelsTable.flashcardId, flashcardId));

    if (labelIds.length > 0) {
      const values = labelIds.map((labelId) => ({
        flashcardId,
        labelId,
      }));

      await db.insert(flashcardLabelsTable).values(values);
    }

    return await getLabelsForFlashcard(flashcardId);
  } catch (error) {
    console.error("Error updating flashcard labels:", error);
    throw error;
  }
};

export const getAllFlashcardLabelsTableData = async () => {
  try {
    const result = await db.query.flashcardLabelsTable.findMany();
    console.log("getAllFlashcardLabels:\t", result);
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const deleteAllFlashcardLabelTableData = async () => {
  try {
    const result = await db.delete(flashcardLabelsTable);
    return result;
  } catch (error) {
    console.error("Error deleting all records:", error);
  }
};
