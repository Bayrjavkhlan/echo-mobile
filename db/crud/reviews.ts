import { sql, and, eq, gte } from "drizzle-orm";
import useDatabase from "@/hooks/useDatabase";
import { reviewsTable } from "../schema/reviews";
import { flashcardsTable } from "../schema/flashcards";

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

checkTablesExist().catch(console.error);

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

// Calculate new easiness factor based on performance (0-5 scale)
// 0 = complete blackout, 5 = perfect recall
// We'll map correct/incorrect to quality scores of 5 and 2
const calculateEasinessFactor = (oldEF: number, quality: number): number => {
  const newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  // EF should be at least 1.3
  return Math.max(1.3, newEF);
};

// Save review data and update flashcard SM-2 parameters
export const saveReviewData = async (reviewData: ReviewData) => {
  try {
    // Validate input to prevent undefined IDs
    if (!reviewData.flashcardId || !reviewData.groupId) {
      console.error("Invalid review data: Missing flashcard ID or group ID");
      return false;
    }

    // Convert string IDs to numbers
    const flashcardId = parseInt(reviewData.flashcardId);
    const groupId = parseInt(reviewData.groupId);
    const userId = reviewData.userId || null;

    if (isNaN(flashcardId) || isNaN(groupId)) {
      console.error(
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
      console.error(`Flashcard with ID ${flashcardId} not found in database`);
      return false;
    }

    // Get current values or set defaults
    const currentReviewCount = flashcardResult[0].reviewCount || 0;
    const currentEF =
      flashcardResult[0].easynessFactor || DEFAULT_EASINESS_FACTOR;

    // Quality score based on correctness (5 for correct, 2 for incorrect)
    const qualityScore = reviewData.correct ? 5 : 2;

    // Calculate new easiness factor
    const newEF = calculateEasinessFactor(currentEF, qualityScore);

    // Calculate repetitions and interval for SM-2
    let repetitions = 0;
    let interval = 0;

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

    // Update repetitions based on correctness
    if (reviewData.correct) {
      repetitions = prevRepetitions + 1;
    } else {
      repetitions = 0; // Reset on incorrect answer
    }

    // Calculate interval based on SM-2
    if (repetitions === 0) {
      interval = 0; // Review again today (failed card)
    } else if (repetitions === 1) {
      interval = 1; // 1 day
    } else if (repetitions === 2) {
      interval = 6; // 6 days
    } else {
      // For repetitions > 2, use the formula: interval = interval * easiness_factor
      const previousInterval =
        repetitions === 3 ? 6 : Math.round((repetitions - 2) * currentEF);
      interval = Math.round(previousInterval * newEF);

      // Ensure interval doesn't grow too large
      interval = Math.min(interval, MAX_INTERVAL);
    }

    // Calculate next review date with error handling
    let nextReviewStr;
    try {
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);
      nextReviewStr = nextReviewDate.toISOString();

      // Validate the date is valid
      if (isNaN(nextReviewDate.getTime())) {
        throw new Error("Invalid date generated");
      }
    } catch (dateError) {
      console.error("Error calculating next review date:", dateError);
      // Fallback to a reasonable date (30 days in the future)
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 30);
      nextReviewStr = fallbackDate.toISOString();
      console.log(`Using fallback review date: ${nextReviewStr}`);
    }

    console.log(
      `SM-2 calculation: repetitions=${repetitions}, interval=${interval}, nextReview=${nextReviewStr}`
    );

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
          nextReview: nextReviewStr,
          easynessFactor: newEF,
          lastReviewDate: new Date().toISOString(),
          responseTime: Math.round(reviewData.timeToAnswer * 1000), // Convert seconds to ms
          lastScore: qualityScore,
          isSync: 0, // Not synced by default
        });
        console.log(`Saved review record for flashcard ${flashcardId}`);
      } catch (insertError) {
        console.error("Error inserting review record:", insertError);
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
      console.error("Error updating flashcard SM-2 parameters:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error saving review data:", error);
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
    console.error("Error fetching flashcard review history:", error);
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
    console.error("Error fetching group review history:", error);
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
    console.error("Error fetching flashcards due for review:", error);
    return [];
  }
};

// Helper function to calculate next review date based on SM-2
export const calculateNextReviewDate = (
  repetitions: number,
  easinessFactor: number
): Date => {
  let interval;

  if (repetitions === 0) {
    interval = 0; // Review again today (failed card)
  } else if (repetitions === 1) {
    interval = 1; // 1 day
  } else if (repetitions === 2) {
    interval = 6; // 6 days
  } else {
    // For repetitions > 2, use the formula: interval = interval * easiness_factor
    const previousInterval =
      repetitions === 3 ? 6 : Math.round((repetitions - 2) * easinessFactor);
    interval = Math.round(previousInterval * easinessFactor);

    // Ensure interval doesn't grow too large
    interval = Math.min(interval, MAX_INTERVAL);
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  return nextReviewDate;
};
