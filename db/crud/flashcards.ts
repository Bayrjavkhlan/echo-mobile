import useDatabase from "@/hooks/useDatabase";
import { eq, gt } from "drizzle-orm";
import { flashcardsTable } from "../schema";

const db = useDatabase();

export const getAllFlashcardTableData = async () => {
  try {
    const result = await db.query.flashcardsTable.findMany();
    console.log("getAllFlashcardTableData:\t", result);
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const getFlashcardStats = async () => {
  try {
    // Get total number of flashcards
    const totalResult = await db.select().from(flashcardsTable);

    // Filtered EF > 2.6
    const efAboveResult = await db
      .select()
      .from(flashcardsTable)
      .where(gt(flashcardsTable.easynessFactor, 2.6));

    return {
      total: totalResult.length || 0,
      efAbove2_6: efAboveResult.length || 0,
    };
  } catch (error) {
    console.error("Error retrieving flashcard stats:", error);
    return null;
  }
};

export const getFlashcardTableData = async (flashcardId: number) => {
  try {
    const result = await db.query.flashcardsTable.findFirst({
      where: eq(flashcardsTable.id, flashcardId),
    });

    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const getFlashcardsByGroupId = async (groupId: number) => {
  try {
    const result = await db.query.flashcardsTable.findMany({
      where: eq(flashcardsTable.groupId, groupId),
    });
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const createFlashcardRecord = async (
  question: string,
  answer: string,
  groupId: number
) => {
  try {
    const result = await db.insert(flashcardsTable).values({
      question,
      answer,
      groupId,
      createdAt: Date.now(),
      updatedBy: "user", // todo get the user name or id
    });
    return result;
  } catch (error) {
    console.error("Error creating record:", error);
  }
};
export const createManyFlashcards = async (
  flashcards: {
    question: string;
    answer: string;
    groupId: number;
  }[]
) => {
  try {
    const result = await db.insert(flashcardsTable).values(
      flashcards.map((f) => ({
        question: f.question,
        answer: f.answer,
        groupId: f.groupId,
        createdAt: Date.now(),
        updatedBy: "user", // TODO: get the user name or id
      }))
    );
    return result;
  } catch (error) {
    console.error("Error creating flashcards:", error);
  }
};
export const updateFlashcardRecord = async (
  id: number,
  question: string,
  answer: string
) => {
  try {
    const result = await db
      .update(flashcardsTable)
      .set({
        question,
        answer,
        updatedBy: "user", // TODO: Replace with actual user info later
      })
      .where(eq(flashcardsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error updating record:", error);
  }
};

export const deleteFlashcardRecord = async (id: number) => {
  try {
    const result = await db
      .delete(flashcardsTable)
      .where(eq(flashcardsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};
export const deleteFlashcardsByGroupId = async (groupId: number) => {
  try {
    const result = await db
      .delete(flashcardsTable)
      .where(eq(flashcardsTable.groupId, groupId));
    return result;
  } catch (error) {
    console.error("Error deleting flashcards for group:", error);
  }
};
export const deleteAllFlashcardRecords = async () => {
  try {
    const result = await db.delete(flashcardsTable);
    return result;
  } catch (error) {
    console.error("Error deleting all records:", error);
  }
};
