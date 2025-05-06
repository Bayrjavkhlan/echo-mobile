import useDatabase from "@/hooks/useDatabase";
import { calendarTable } from "../schema/calendar";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  parseISO,
  isValid,
} from "date-fns";

const db = useDatabase();

export interface CalendarData {
  id?: number;
  userId: number;
  date: string;
  minutesSpent?: number;
  wordsMemorized?: number;
  appOpened?: boolean | number;
  isSync?: boolean | number;
}

export const saveCalendarData = async (data: CalendarData) => {
  try {
    // Check if entry for this date and user already exists
    const existingEntries = await db
      .select()
      .from(calendarTable)
      .where(
        and(
          eq(calendarTable.date, data.date),
          eq(calendarTable.userId, data.userId)
        )
      );

    if (existingEntries.length > 0) {
      // Update existing entry
      const existingEntry = existingEntries[0];

      // Prepare updated values
      const minutesSpent =
        data.minutesSpent !== undefined
          ? (existingEntry.minutesSpent || 0) + data.minutesSpent
          : existingEntry.minutesSpent;

      const wordsMemorized =
        data.wordsMemorized !== undefined
          ? (existingEntry.wordsMemorized || 0) + data.wordsMemorized
          : existingEntry.wordsMemorized;

      const appOpened =
        data.appOpened !== undefined
          ? typeof data.appOpened === "boolean"
            ? data.appOpened
              ? 1
              : 0
            : data.appOpened
          : existingEntry.appOpened;

      const isSync =
        data.isSync !== undefined
          ? typeof data.isSync === "boolean"
            ? data.isSync
              ? 1
              : 0
            : data.isSync
          : existingEntry.isSync;

      await db
        .update(calendarTable)
        .set({
          minutesSpent,
          wordsMemorized,
          appOpened,
          isSync,
        })
        .where(eq(calendarTable.id, existingEntry.id));

      return {
        ...existingEntry,
        minutesSpent,
        wordsMemorized,
        appOpened,
      };
    } else {
      // Insert new entry
      const result = await db
        .insert(calendarTable)
        .values({
          userId: data.userId,
          date: data.date,
          minutesSpent: data.minutesSpent || 0,
          wordsMemorized: data.wordsMemorized || 0,
          appOpened:
            typeof data.appOpened === "boolean"
              ? data.appOpened
                ? 1
                : 0
              : data.appOpened || 0,
          isSync:
            typeof data.isSync === "boolean"
              ? data.isSync
                ? 1
                : 0
              : data.isSync || 0,
        })
        .returning();

      return result[0];
    }
  } catch (error) {
    console.error("Error saving calendar data:", error);
    throw error;
  }
};

export const getCalendarDataByUserId = async (userId: number) => {
  try {
    const result = await db
      .select()
      .from(calendarTable)
      .where(eq(calendarTable.userId, userId))
      .orderBy(desc(calendarTable.date));

    return result;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return [];
  }
};

export const calculateStreak = async (userId: number) => {
  try {
    // Get calendar entries ordered by date descending (most recent first)
    const calendarEntries = await db
      .select()
      .from(calendarTable)
      .where(eq(calendarTable.userId, userId))
      .orderBy(desc(calendarTable.date));

    if (calendarEntries.length === 0) {
      return 1; // Start at 1 for new users
    }

    let streak = 1; // Start with 1 for today/most recent activity day
    let currentDate = new Date(calendarEntries[0].date);

    // Skip the first entry (already counted) and check for consecutive days
    for (let i = 1; i < calendarEntries.length; i++) {
      const prevDate = new Date(calendarEntries[i].date);
      const dayDiff = Math.round(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        streak++;
        currentDate = prevDate;
      } else if (dayDiff > 1) {
        // Break in streak
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 1; // Default to 1 on error
  }
};

export const getWeeklyActivityData = async (userId: number) => {
  try {
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 0 }); // Sunday as start of week
    const endDate = endOfWeek(today, { weekStartsOn: 0 });

    // Create formatted dates for the query
    const startDateStr = format(startDate, "yyyy-MM-dd");
    const endDateStr = format(endDate, "yyyy-MM-dd");

    // Get data for the current week
    const results = await db
      .select()
      .from(calendarTable)
      .where(
        and(
          eq(calendarTable.userId, userId),
          gte(calendarTable.date, startDateStr),
          sql`${calendarTable.date} <= ${endDateStr}`
        )
      );

    // Initialize an array for each day of the week with 0 minutes
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]

    // Fill in the data we have
    results.forEach((entry: any) => {
      if (
        entry.date &&
        entry.minutesSpent !== null &&
        entry.minutesSpent !== undefined
      ) {
        const entryDate = parseISO(entry.date);
        if (isValid(entryDate)) {
          // getDay() returns 0 for Sunday, 1 for Monday, etc.
          const dayIndex = entryDate.getDay();
          weeklyData[dayIndex] += entry.minutesSpent;
        }
      }
    });

    return weeklyData;
  } catch (error) {
    console.error("Error fetching weekly activity data:", error);
    return [0, 0, 0, 0, 0, 0, 0];
  }
};

export const getMonthlyActivityData = async (userId: number) => {
  try {
    const today = new Date();
    const startOfMonthDate = startOfMonth(today);
    const endOfMonthDate = endOfMonth(today);

    // Create formatted dates for the query
    const startDateStr = format(startOfMonthDate, "yyyy-MM-dd");
    const endDateStr = format(endOfMonthDate, "yyyy-MM-dd");

    // Get data for the current month
    const results = await db
      .select()
      .from(calendarTable)
      .where(
        and(
          eq(calendarTable.userId, userId),
          gte(calendarTable.date, startDateStr),
          sql`${calendarTable.date} <= ${endDateStr}`
        )
      );

    // Initialize the 5 periods (roughly weeks) of the month
    const monthlyData = [0, 0, 0, 0, 0];

    // Fill in the data we have
    results.forEach((entry: any) => {
      if (
        entry.date &&
        entry.minutesSpent !== null &&
        entry.minutesSpent !== undefined
      ) {
        const entryDate = parseISO(entry.date);
        if (isValid(entryDate)) {
          // Get the day of month (1-31)
          const day = entryDate.getDate();

          // Map the day to one of our 5 periods
          let periodIndex;
          if (day <= 7) periodIndex = 0;
          else if (day <= 14) periodIndex = 1;
          else if (day <= 21) periodIndex = 2;
          else if (day <= 28) periodIndex = 3;
          else periodIndex = 4;

          monthlyData[periodIndex] += entry.minutesSpent;
        }
      }
    });

    return monthlyData;
  } catch (error) {
    console.error("Error fetching monthly activity data:", error);
    return [0, 0, 0, 0, 0];
  }
};

export const getWeeklyWordsMemorized = async (userId: number) => {
  try {
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 0 }); // Sunday as start of week
    const endDate = endOfWeek(today, { weekStartsOn: 0 });

    // Create formatted dates for the query
    const startDateStr = format(startDate, "yyyy-MM-dd");
    const endDateStr = format(endDate, "yyyy-MM-dd");

    // Get data for the current week
    const results = await db
      .select()
      .from(calendarTable)
      .where(
        and(
          eq(calendarTable.userId, userId),
          gte(calendarTable.date, startDateStr),
          sql`${calendarTable.date} <= ${endDateStr}`
        )
      );

    // Initialize an array for each day of the week with 0 words
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]

    // Fill in the data we have
    results.forEach((entry: any) => {
      if (
        entry.date &&
        entry.wordsMemorized !== null &&
        entry.wordsMemorized !== undefined
      ) {
        const entryDate = parseISO(entry.date);
        if (isValid(entryDate)) {
          // getDay() returns 0 for Sunday, 1 for Monday, etc.
          const dayIndex = entryDate.getDay();
          weeklyData[dayIndex] += entry.wordsMemorized;
        }
      }
    });

    return weeklyData;
  } catch (error) {
    console.error("Error fetching weekly words memorized data:", error);
    return [0, 0, 0, 0, 0, 0, 0];
  }
};

export const deleteAllCalendarData = async () => {
  try {
    const result = await db.delete(calendarTable);
    console.log("All calendar data deleted.");
    return result;
  } catch (error) {
    console.error("Error deleting all calendar data:", error);
    throw error;
  }
};
