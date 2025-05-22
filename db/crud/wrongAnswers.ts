import { eq, asc, and, desc, count } from "drizzle-orm";
import useDatabase from "@/hooks/useDatabase";
import { wrongAnswersTable } from "../schema";

const db = useDatabase();

export const getAllWrongAnswerTableData = async () => {
  try {
    return await db.query.wrongAnswersTable.findMany();
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
      .where(eq(wrongAnswersTable.flashcardId, flashcardId));
  } catch (error) {
    console.error(
      `Error getting wrong answers for flashcard ${flashcardId}:`,
      error
    );
    return null;
  }
};

export const getCountOfWrongAnswerByFlashcardId = async (
  flashcardId: number
) => {
  try {
    const result = await db
      .select({ count: count() })
      .from(wrongAnswersTable)
      .where(eq(wrongAnswersTable.flashcardId, flashcardId));

    return result[0]?.count ?? 0;
  } catch (error) {
    console.error(
      `Error counting wrong answers for flashcard ${flashcardId}:`,
      error
    );
    return 0;
  }
};

export const createWrongAnswerTableData = async (wrongAnswer: {
  flashcardId: number;
  wrongText: string;
  isSync?: number | null;
}) => {
  try {
    return await db.insert(wrongAnswersTable).values({
      flashcardId: wrongAnswer.flashcardId,
      wrongText: wrongAnswer.wrongText,
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
    isSync: number | null;
  }>
) => {
  try {
    return await db
      .update(wrongAnswersTable)
      .set({
        ...data,
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
    return await db.select().from(wrongAnswersTable);
  } catch (error) {
    console.error(`Error getting wrong answers for user ${userId}:`, error);
    return null;
  }
};

export const getLatestWrongAnswers = async (limit: number = 10) => {
  try {
    return await db.select().from(wrongAnswersTable).limit(limit);
  } catch (error) {
    console.error(`Error getting latest wrong answers:`, error);
    return null;
  }
};
