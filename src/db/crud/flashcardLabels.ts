import useDatabase from "@/hooks/useDatabase";
import { eq, and, sql } from "drizzle-orm";
import { flashcardLabelsTable, flashcardsTable, labelsTable } from "../schema";

const db = useDatabase();

export const getAllFlashcardLabelsTableData = async () => {
  try {
    const result = await db.query.flashcardLabelsTable.findMany();
    console.log("getAllFlashcardLabels: ", result);
    return result;
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
};

export const getLabelsForFlashcard = async (flashcardId: number) => {
  try {
    console.log("Getting labels for flashcard:", flashcardId);

    const result = await db
      .select({
        id: labelsTable.id,
        name: labelsTable.name,
      })
      .from(labelsTable)
      .innerJoin(
        flashcardLabelsTable,
        eq(labelsTable.id, flashcardLabelsTable.labelId)
      )
      .where(eq(flashcardLabelsTable.flashcardId, flashcardId));

    console.log("Labels for flashcard:", result);
    return result;
  } catch (error) {
    console.log("Error retrieving labels for flashcard:", error);
    throw error;
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
    console.log("Error retrieving flashcards for label:", error);
  }
};

export const addLabelToFlashcard = async (
  flashcardId: number,
  labelId: number
) => {
  try {
    // First, check if the relationship already exists to avoid duplicates
    console.log(`Adding label ${labelId} to flashcard ${flashcardId}`);

    const existingRelationship = await db.query.flashcardLabelsTable.findMany({
      where: and(
        eq(flashcardLabelsTable.flashcardId, flashcardId),
        eq(flashcardLabelsTable.labelId, labelId)
      ),
    });

    console.log("Existing relationship check result:", existingRelationship);

    // If relationship doesn't exist, create it
    if (existingRelationship.length === 0) {
      const result = await db.insert(flashcardLabelsTable).values({
        flashcardId,
        labelId,
      });

      console.log(`Label ${labelId} added to flashcard ${flashcardId}`, result);
      return result;
    } else {
      console.log(
        `Relationship between flashcard ${flashcardId} and label ${labelId} already exists.`
      );
      return { changes: 0, lastInsertRowId: 0 };
    }
  } catch (error) {
    console.log(
      `Error adding label ${labelId} to flashcard ${flashcardId}:`,
      error
    );
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
    console.log(
      `Error removing label ${labelId} from flashcard ${flashcardId}:`,
      error
    );
  }
};

export const removeAllLabelsFromFlashcard = async (flashcardId: number) => {
  try {
    const result = await db
      .delete(flashcardLabelsTable)
      .where(eq(flashcardLabelsTable.flashcardId, flashcardId));
    return result;
  } catch (error) {
    console.log(
      `Error removing all labels from flashcard ${flashcardId}:`,
      error
    );
  }
};

export const updateFlashcardLabels = async (
  flashcardId: number,
  labelIds: number[]
) => {
  try {
    console.log(`Updating labels for flashcard ${flashcardId}:`, labelIds);
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
    console.log("Error updating flashcard labels:", error);
    throw error;
  }
};

export const deleteAllFlashcardLabelTableData = async () => {
  try {
    const result = await db.delete(flashcardLabelsTable);
    return result;
  } catch (error) {
    console.log("Error deleting all records:", error);
  }
};
