import useDatabase from "@/hooks/useDatabase";
import { wrongAnswersTable } from "@/db/schema/wrongAnswers";
import { eq } from "drizzle-orm";

const db = useDatabase();

export const createWrongAnswerTableData = async (wrongAnswer: {
  flashcardId: number;
  wrongAnswer2: string | null;
}) => {
  try {
    const result = await db
      .insert(wrongAnswersTable)
      .values(wrongAnswer)
      .returning();
    return result[0];
  } catch (error) {
    console.error("Error creating wrong answer:", error);
    return null;
  }
};

export const createManyWrongAnswerTableData = async (
  wrongAnswers: {
    flashcardId: number;
    wrongAnswer2: string | null;
  }[]
) => {
  try {
    const result = await db
      .insert(wrongAnswersTable)
      .values(wrongAnswers)
      .returning();
    return result;
  } catch (error) {
    console.error("Error creating multiple wrong answers:", error);
    return null;
  }
};

export const getAllWrongAnswerTableData = async () => {
  try {
    const result = await db.select().from(wrongAnswersTable);
    return result;
  } catch (error) {
    console.error("Error getting all wrong answers:", error);
    return null;
  }
};

export const getWrongAnswerTableData = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(wrongAnswersTable)
      .where(eq(wrongAnswersTable.id, id));
    return result[0] || null;
  } catch (error) {
    console.error(`Error getting wrong answer with id ${id}:`, error);
    return null;
  }
};

export const getWrongAnswersByFlashcardId = async (flashcardId: number) => {
  try {
    const result = await db
      .select()
      .from(wrongAnswersTable)
      .where(eq(wrongAnswersTable.flashcardId, flashcardId));
    return result;
  } catch (error) {
    console.error(
      `Error getting wrong answers for flashcard ${flashcardId}:`,
      error
    );
    return null;
  }
};

export const updateWrongAnswerTableData = async (
  id: number,
  wrongAnswer: Partial<{
    flashcardId: number;
    wrongAnswer2: string | null;
  }>
) => {
  try {
    const result = await db
      .update(wrongAnswersTable)
      .set(wrongAnswer)
      .where(eq(wrongAnswersTable.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error updating wrong answer with id ${id}:`, error);
    return null;
  }
};

export const deleteWrongAnswerTableData = async (id: number) => {
  try {
    const result = await db
      .delete(wrongAnswersTable)
      .where(eq(wrongAnswersTable.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error(`Error deleting wrong answer with id ${id}:`, error);
    return null;
  }
};
