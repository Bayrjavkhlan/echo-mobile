import { sql } from "drizzle-orm";
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
};

const DEFAULT_EASINESS_FACTOR = 2.5;

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

    if (isNaN(flashcardId) || isNaN(groupId)) {
      console.error(
        "Invalid IDs: Could not parse flashcardId or groupId to numbers"
      );
      return false;
    }

    // 1. First, insert the review record
    if (reviewsTableExists) {
      try {
        await db.insert(reviewsTable).values({
          flashcardId,
          groupId,
          correct: reviewData.correct ? 1 : 0,
          timeToAnswer: reviewData.timeToAnswer,
          userAnswer: reviewData.userAnswer,
        });
        console.log(`Saved review record for flashcard ${flashcardId}`);
      } catch (insertError) {
        console.error("Error inserting review record:", insertError);
        // Continue to try updating the flashcard even if saving the review fails
      }
    } else {
      console.log("Skipping review data save - table doesn't exist yet");
      // Just log the data for now
      console.log("Review data:", {
        flashcardId,
        correct: reviewData.correct,
        timeToAnswer: reviewData.timeToAnswer,
      });
    }

    // 2. Fetch the current flashcard data to update SM-2 parameters
    try {
      const flashcardResult = await db
        .select({
          reviewCount: flashcardsTable.reviewCount,
          easynessFactor: flashcardsTable.easynessFactor,
        })
        .from(flashcardsTable)
        .where(sql`${flashcardsTable.id} = ${flashcardId}`)
        .limit(1);

      if (!flashcardResult || flashcardResult.length === 0) {
        console.error(`Flashcard with ID ${flashcardId} not found in database`);
        return false;
      }

      const flashcard = flashcardResult[0];

      // Get current values or set defaults
      const currentReviewCount = flashcard.reviewCount || 0;
      const currentEF = flashcard.easynessFactor || DEFAULT_EASINESS_FACTOR;

      // Quality score based on correctness (5 for correct, 2 for incorrect)
      const qualityScore = reviewData.correct ? 5 : 2;

      // Calculate new easiness factor
      const newEF = calculateEasinessFactor(currentEF, qualityScore);

      // Create update data object - We're now going to directly use the fields we know exist
      // and skip the dynamic object creation that was causing issues

      // Update the flashcard with new values
      try {
        await db
          .update(flashcardsTable)
          .set({
            reviewCount: currentReviewCount + 1,
            easynessFactor: newEF,
            // Removed lastReviewedAt until the migration is run
          })
          .where(sql`${flashcardsTable.id} = ${flashcardId}`);

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
      console.error("Error updating flashcard SM-2 parameters:", error);
      return false;
    }
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
      .where(sql`${reviewsTable.flashcardId} = ${flashcardId}`)
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
      .where(sql`${reviewsTable.groupId} = ${groupId}`)
      .orderBy(sql`${reviewsTable.createdAt} DESC`);
  } catch (error) {
    console.error("Error fetching group review history:", error);
    return [];
  }
};
