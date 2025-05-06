export type SM2Input = {
  correct: boolean;
  previousEF: number;
  previousRepetitions: number;
  answerTime: number;
};

export type SM2Output = {
  newEF: number;
  repetitions: number;
  interval: number;
  nextReview: string;
  quality: number;
};

const MAX_INTERVAL = 365 * 2;

export const SM_2Algorithm = ({
  correct,
  previousEF,
  previousRepetitions,
  answerTime,
}: SM2Input): SM2Output => {
  const quality = correct ? 5 : 2;

  // Update easiness factor.
  const newEF = Math.max(
    1.3,
    previousEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Increase or reset repetitions based on correctness.
  const repetitions = correct ? previousRepetitions + 1 : 0;

  // Calculate the raw interval using SM-2 logic.
  let interval = 0;
  if (repetitions === 1) {
    interval = 1;
  } else if (repetitions === 2) {
    interval = 6;
  } else if (repetitions > 2) {
    // For repetition 3, the interval is set as 6 days.
    // For further repetitions, a rounded value based on previousEF.
    const previousInterval =
      repetitions === 3 ? 6 : Math.round((repetitions - 2) * previousEF);
    interval = Math.round(previousInterval * newEF);
    interval = Math.min(interval, MAX_INTERVAL);
  }

  // --- New code: Integrate user answering time ---
  // Define an optimal answering time in seconds.
  const optimalTime = 10;
  // Calculate a multiplier: if answerTime is less than optimal,
  // the ratio exceeds 1 (boosting the interval), and vice versa.
  const timeRatio = optimalTime / answerTime;
  // Clamp the multiplier to avoid extreme adjustments.
  const clampedRatio = Math.max(0.8, Math.min(1.2, timeRatio));

  // Adjust the interval by the clamped ratio.
  interval = Math.round(interval * clampedRatio);

  // Compute the next review date.
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  const nextReview = isNaN(nextReviewDate.getTime())
    ? (() => {
        const fallback = new Date();
        fallback.setDate(fallback.getDate() + 30);
        return fallback.toISOString();
      })()
    : nextReviewDate.toISOString();

  return {
    newEF,
    repetitions,
    interval,
    nextReview,
    quality,
  };
};
