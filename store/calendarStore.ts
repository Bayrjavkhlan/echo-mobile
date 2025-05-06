import { create } from "zustand";
import {
  getWeeklyActivityData,
  getMonthlyActivityData,
  getWeeklyWordsMemorized,
  calculateStreak,
  getCalendarDataByUserId,
  saveCalendarData,
} from "@/db/crud/calendar";
import { useUserStore } from "./userStore";

// Updated type to match the new calendar schema
export type CalendarEntryWithNulls = {
  id: number;
  userId: number;
  date: string;
  minutesSpent: number | null;
  wordsMemorized: number | null;
  appOpened: number | null;
  isSync: number | null;
};

// Default device ID to use when no user is logged in
const DEFAULT_DEVICE_ID = "device_1";

interface CalendarStore {
  entries: CalendarEntryWithNulls[];
  streak: number;
  weeklyActivity: number[];
  monthlyActivity: number[];
  weeklyWordsMemorized: number[];
  isLoading: boolean;

  // Fetching functions
  fetchCalendarData: () => Promise<void>;
  fetchStreak: () => Promise<number>;
  fetchWeeklyActivityData: () => Promise<number[]>;
  fetchMonthlyActivityData: () => Promise<number[]>;
  fetchWeeklyWordsMemorizedData: () => Promise<number[]>;

  // Update functions
  recordAppUsage: (minutes: number) => Promise<void>;
  recordWordsMemorized: (wordsCount: number) => Promise<void>;

  // Initialize the app - records that the user opened the app today
  recordAppOpened: () => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  entries: [],
  streak: 1,
  weeklyActivity: Array(7).fill(0),
  monthlyActivity: Array(5).fill(0),
  weeklyWordsMemorized: Array(7).fill(0),
  isLoading: false,

  fetchCalendarData: async () => {
    try {
      set({ isLoading: true });
      const userId = useUserStore.getState().userId;
      const result = await getCalendarDataByUserId(userId);

      if (result) {
        set({ entries: result as unknown as CalendarEntryWithNulls[] });
      }

      // Also fetch other stats
      await Promise.all([
        get().fetchStreak(),
        get().fetchWeeklyActivityData(),
        get().fetchMonthlyActivityData(),
        get().fetchWeeklyWordsMemorizedData(),
      ]);
    } catch (error) {
      console.error("Failed to fetch user calendar data:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStreak: async () => {
    try {
      const userId = useUserStore.getState().userId;
      const streak = await calculateStreak(userId);

      // Ensure streak is at least 1 for a user with any activity
      const finalStreak = streak > 0 ? streak : 1;
      set({ streak: finalStreak });
      return finalStreak;
    } catch (error) {
      console.error("Failed to fetch user streak:", error);
      return 1; // Default to 1 instead of 0
    }
  },

  fetchWeeklyActivityData: async () => {
    try {
      const userId = useUserStore.getState().userId;
      const weeklyActivity = await getWeeklyActivityData(userId);
      set({ weeklyActivity });
      return weeklyActivity;
    } catch (error) {
      console.error("Failed to fetch weekly activity data:", error);
      return Array(7).fill(0);
    }
  },

  fetchMonthlyActivityData: async () => {
    try {
      const userId = useUserStore.getState().userId;
      const monthlyActivity = await getMonthlyActivityData(userId);
      set({ monthlyActivity });
      return monthlyActivity;
    } catch (error) {
      console.error("Failed to fetch monthly activity data:", error);
      return Array(5).fill(0);
    }
  },

  fetchWeeklyWordsMemorizedData: async () => {
    try {
      const userId = useUserStore.getState().userId;
      const weeklyWordsMemorized = await getWeeklyWordsMemorized(userId);
      set({ weeklyWordsMemorized });
      return weeklyWordsMemorized;
    } catch (error) {
      console.error("Failed to fetch weekly words memorized data:", error);
      return Array(7).fill(0);
    }
  },

  recordAppUsage: async (minutes: number) => {
    try {
      const userId = useUserStore.getState().userId;

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];

      // Save calendar data with minutes spent
      await saveCalendarData({
        userId: userId,
        date: dateStr,
        minutesSpent: minutes,
        appOpened: true,
      });

      // Refresh data
      await get().fetchCalendarData();
    } catch (error) {
      console.error("Failed to record app usage:", error);
    }
  },

  recordWordsMemorized: async (wordsCount: number) => {
    try {
      const userId = useUserStore.getState().userId;

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];

      // Save calendar data with words memorized
      await saveCalendarData({
        userId: userId,
        date: dateStr,
        wordsMemorized: wordsCount,
        appOpened: true,
      });

      // Refresh data
      await get().fetchCalendarData();
    } catch (error) {
      console.error("Failed to record words memorized:", error);
    }
  },

  recordAppOpened: async () => {
    try {
      const userId = useUserStore.getState().userId;

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];

      // Create or update entry for today, marking it as active
      await saveCalendarData({
        userId: userId,
        date: dateStr,
        appOpened: true,
      });

      // Fetch data to update the UI
      await get().fetchCalendarData();
    } catch (error) {
      console.error("Failed to record app opened:", error);
    }
  },
}));
