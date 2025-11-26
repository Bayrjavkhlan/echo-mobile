import { sql, and, eq, gte } from "drizzle-orm";
import useDatabase from "@/hooks/useDatabase";
import { reviewsTable } from "../schema/reviews";
import { flashcardsTable } from "../schema/flashcards";
import { SM_2Algorithm } from "@/lib/SM-2";

const db = useDatabase();

let reviewsTableExists = false;
let lastReviewedAtColumnExists = false;

const checkTablesExist = async () => {
  try {
    await db.select().from(reviewsTable).limit(1);
    reviewsTableExists = true;
    console.log("Reviews table exists in database");
  } catch (error) {
    reviewsTableExists = false;
    console.warn(
      "Reviews table does not exist yet - saving reviews will be skipped"
    );
  }

  lastReviewedAtColumnExists = false;
  console.warn(
    "lastReviewedAt column assumed not to exist - will skip updating this field"
  );
};

checkTablesExist().catch(console.log);

type ReviewData = {
  flashcardId: string;
  correct: boolean;
  timeToAnswer: number;
  groupId: string;
  userAnswer: string;
  userId?: number; // Optional user ID for tracking
};

const DEFAULT_EASINESS_FACTOR = 2.5;
const MAX_INTERVAL = 365 * 2; // Maximum interval of 2 years

// Save review data and update flashcard SM-2 parameters
export const saveReviewData = async (reviewData: ReviewData) => {
  try {
    // Validate input to prevent undefined IDs
    if (!reviewData.flashcardId || !reviewData.groupId) {
      console.log("Invalid review data: Missing flashcard ID or group ID");
      return false;
    }

    // Convert string IDs to numbers
    const flashcardId = parseInt(reviewData.flashcardId);
    const groupId = parseInt(reviewData.groupId);
    const userId = reviewData.userId || null;

    if (isNaN(flashcardId) || isNaN(groupId)) {
      console.log(
        "Invalid IDs: Could not parse flashcardId or groupId to numbers"
      );
      return false;
    }

    // 1. Get current flashcard data for SM-2 calculation
    const flashcardResult = await db
      .select({
        reviewCount: flashcardsTable.reviewCount,
        easynessFactor: flashcardsTable.easynessFactor,
      })
      .from(flashcardsTable)
      .where(eq(flashcardsTable.id, flashcardId))
      .limit(1);

    if (!flashcardResult || flashcardResult.length === 0) {
      console.log(`Flashcard with ID ${flashcardId} not found in database`);
      return false;
    }

    // Get current values or set defaults
    const currentReviewCount = flashcardResult[0].reviewCount || 0;
    const currentEF =
      flashcardResult[0].easynessFactor || DEFAULT_EASINESS_FACTOR;

    // Find the most recent review for this flashcard to get current repetitions
    let prevRepetitions = 0;
    try {
      const prevReviews = await db
        .select({
          repetitions: reviewsTable.repetitions,
          interval: reviewsTable.interval,
        })
        .from(reviewsTable)
        .where(eq(reviewsTable.flashcardId, flashcardId))
        .orderBy(sql`${reviewsTable.createdAt} DESC`)
        .limit(1);

      if (prevReviews && prevReviews.length > 0) {
        prevRepetitions = prevReviews[0].repetitions || 0;
        console.log(`Previous repetitions: ${prevRepetitions}`);
      }
    } catch (error) {
      console.warn("Could not get previous review data, using defaults");
    }

    // Use the custom SM-2 algorithm for calculating space repetition values
    const sm2Input = {
      correct: reviewData.correct,
      previousEF: currentEF,
      previousRepetitions: prevRepetitions,
      answerTime: reviewData.timeToAnswer,
    };

    console.log("Using custom SM-2 algorithm with input:", sm2Input);

    const sm2Result = SM_2Algorithm(sm2Input);
    console.log("SM-2 algorithm result:", sm2Result);

    const { newEF, repetitions, interval, nextReview, quality } = sm2Result;

    // 2. Insert the review record with SM-2 data
    if (reviewsTableExists) {
      try {
        await db.insert(reviewsTable).values({
          flashcardId,
          groupId,
          userId,
          correct: reviewData.correct ? 1 : 0,
          timeToAnswer: reviewData.timeToAnswer,
          userAnswer: reviewData.userAnswer,
          repetitions,
          interval,
          nextReview,
          easynessFactor: newEF,
          lastReviewDate: new Date().toISOString(),
          responseTime: Math.round(reviewData.timeToAnswer * 1000), // Convert seconds to ms
          lastScore: quality,
          isSync: 0, // Not synced by default
        });
        console.log(`Saved review record for flashcard ${flashcardId}`);
      } catch (insertError) {
        console.log("Error inserting review record:", insertError);
      }
    } else {
      console.log("Skipping review data save - table doesn't exist yet");
      console.log("Review data:", {
        flashcardId,
        correct: reviewData.correct,
        timeToAnswer: reviewData.timeToAnswer,
      });
    }

    // 3. Update the flashcard with new SM-2 parameters
    try {
      await db
        .update(flashcardsTable)
        .set({
          reviewCount: currentReviewCount + 1,
          easynessFactor: newEF,
          // We'll skip updating lastReviewedAt if the column doesn't exist
        })
        .where(eq(flashcardsTable.id, flashcardId));

      console.log(
        `Updated flashcard ${flashcardId} SM-2 parameters: EF=${newEF}, reviews=${
          currentReviewCount + 1
        }`
      );
    } catch (updateError) {
      console.log("Error updating flashcard SM-2 parameters:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.log("Error saving review data:", error);
    return false;
  }
};

export const getFlashcardReviewHistory = async (flashcardId: number) => {
  try {
    return await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.flashcardId, flashcardId))
      .orderBy(sql`${reviewsTable.createdAt} DESC`);
  } catch (error) {
    console.log("Error fetching flashcard review history:", error);
    return [];
  }
};

export const getGroupReviewHistory = async (groupId: number) => {
  try {
    return await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.groupId, groupId))
      .orderBy(sql`${reviewsTable.createdAt} DESC`);
  } catch (error) {
    console.log("Error fetching group review history:", error);
    return [];
  }
};

export const getFlashcardsDueForReview = async (userId: number = 1) => {
  try {
    // Get current date in ISO format
    const today = new Date().toISOString();

    // Find flashcards with reviews where nextReview <= today
    const dueFlashcards = await db
      .select({
        id: flashcardsTable.id,
        question: flashcardsTable.question,
        answer: flashcardsTable.answer,
        groupId: flashcardsTable.groupId,
        nextReview: reviewsTable.nextReview,
      })
      .from(flashcardsTable)
      .leftJoin(reviewsTable, eq(flashcardsTable.id, reviewsTable.flashcardId))
      .where(
        and(
          // Filter by userId
          userId ? eq(reviewsTable.userId, userId) : sql`1=1`,
          // Cards due for review (nextReview is before or equal to today)
          sql`${reviewsTable.nextReview} <= ${today}`
        )
      )
      .limit(10);

    // Add flashcards that have never been reviewed
    const neverReviewedFlashcards = await db
      .select({
        id: flashcardsTable.id,
        question: flashcardsTable.question,
        answer: flashcardsTable.answer,
        groupId: flashcardsTable.groupId,
      })
      .from(flashcardsTable)
      .leftJoin(reviewsTable, eq(flashcardsTable.id, reviewsTable.flashcardId))
      .where(sql`${reviewsTable.id} IS NULL`) // No review records
      .limit(5);

    return [...dueFlashcards, ...neverReviewedFlashcards];
  } catch (error) {
    console.log("Error fetching flashcards due for review:", error);
    return [];
  }
};

// Update the calculateNextReviewDate function to use the custom SM-2 algorithm
export const calculateNextReviewDate = (
  repetitions: number,
  easinessFactor: number,
  answerTime: number = 10 // Default answer time if not provided
): Date => {
  const sm2Result = SM_2Algorithm({
    correct: true, // Assuming correct for future calculation
    previousEF: easinessFactor,
    previousRepetitions: repetitions,
    answerTime,
  });

  return new Date(sm2Result.nextReview);
};

export const getAllReviewTableData = async () => {
  try {
    const result = await db.query.reviewsTable.findMany();
    console.log("Retrieved all review table data:", result.length, "records");
    return result;
  } catch (error) {
    console.log("Error fetching all review table data:", error);
    return [];
  }
};
