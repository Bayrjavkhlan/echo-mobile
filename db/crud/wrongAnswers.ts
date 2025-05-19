import { eq, asc, and, desc } from "drizzle-orm";
import useDatabase from "@/hooks/useDatabase";
import { wrongAnswersTable } from "../schema";

const db = useDatabase();

export const getAllWrongAnswerTableData = async () => {
  try {
    return await db
      .select()
      .from(wrongAnswersTable)
      .orderBy(desc(wrongAnswersTable.createdAt));
  } catch (error) {
    console.error("Error getting wrong answers:", error);
    return null;
  }
};

export const getWrongAnswerTableDataByFlashcardId = async (
  flashcardId: number
) => {
  try {
    return await db
      .select()
      .from(wrongAnswersTable)
      .where(eq(wrongAnswersTable.flashcardId, flashcardId))
      .orderBy(desc(wrongAnswersTable.createdAt));
  } catch (error) {
    console.error(
      `Error getting wrong answers for flashcard ${flashcardId}:`,
      error
    );
    return null;
  }
};

export const createWrongAnswerTableData = async (wrongAnswer: {
  flashcardId: number;
  wrongText: string;
  correctText: string;
  userId?: number | null;
  isSync?: number | null;
}) => {
  try {
    return await db.insert(wrongAnswersTable).values({
      flashcardId: wrongAnswer.flashcardId,
      wrongText: wrongAnswer.wrongText,
      correctText: wrongAnswer.correctText,
      userId: wrongAnswer.userId || null,
      createdAt: Date.now(),
      isSync: wrongAnswer.isSync || 0,
    });
  } catch (error) {
    console.error("Error creating wrong answer:", error);
    return null;
  }
};

export const updateWrongAnswerTableData = async (
  id: number,
  data: Partial<{
    flashcardId: number;
    wrongText: string;
    correctText: string;
    userId: number | null;
    isSync: number | null;
  }>
) => {
  try {
    return await db
      .update(wrongAnswersTable)
      .set({
        ...data,
        updatedAt: Date.now(),
      })
      .where(eq(wrongAnswersTable.id, id));
  } catch (error) {
    console.error(`Error updating wrong answer ${id}:`, error);
    return null;
  }
};

export const deleteWrongAnswerTableData = async (id: number) => {
  try {
    return await db
      .delete(wrongAnswersTable)
      .where(eq(wrongAnswersTable.id, id));
  } catch (error) {
    console.error(`Error deleting wrong answer ${id}:`, error);
    return null;
  }
};

export const deleteAllWrongAnswerTableData = async () => {
  try {
    return await db.delete(wrongAnswersTable);
  } catch (error) {
    console.error("Error deleting all wrong answers:", error);
    return null;
  }
};

export const getWrongAnswersByUserId = async (userId: number) => {
  try {
    return await db
      .select()
      .from(wrongAnswersTable)
      .where(eq(wrongAnswersTable.userId, userId))
      .orderBy(desc(wrongAnswersTable.createdAt));
  } catch (error) {
    console.error(`Error getting wrong answers for user ${userId}:`, error);
    return null;
  }
};

export const getLatestWrongAnswers = async (limit: number = 10) => {
  try {
    return await db
      .select()
      .from(wrongAnswersTable)
      .orderBy(desc(wrongAnswersTable.createdAt))
      .limit(limit);
  } catch (error) {
    console.error(`Error getting latest wrong answers:`, error);
    return null;
  }
};
