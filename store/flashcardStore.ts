import { create } from "zustand";

import { getLabelsForFlashcard } from "@/db/crud/flashcardLabels";
import {
  getAllFlashcardTableData,
  getFlashcardTableData,
} from "@/db/crud/flashcards";
import { getWrongAnswersByFlashcardId } from "@/db/crud/wrongAnswers";
import { WrongAnswer } from "./wrongAnswerStore";

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  groupId: string;
  labels: {
    id: string;
    name: string;
    text?: string;
    color?: string;
  }[];
  wrongAnswers?: WrongAnswer[];
  createdAt?: Date;
  updatedAt?: Date;
};

interface FlashcardStore {
  flashcards: Flashcard[];
  currentFlashcard: Flashcard | null;
  fetchFlashcards: () => Promise<void>;
  fetchFlashcardById: (id: number) => Promise<void>;
  getFlashcardsByGroupId: (groupId: string) => Flashcard[];
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  flashcards: [],
  currentFlashcard: null,

  fetchFlashcards: async () => {
    try {
      const result = await getAllFlashcardTableData();
      if (result) {
        console.log(`Got ${result.length} flashcards from database`);

        const flashcardsWithLabels = await Promise.all(
          result.map(async (flashcard: any) => {
            if (!flashcard || !flashcard.id) {
              console.warn("Skipping invalid flashcard:", flashcard);
              return null;
            }

            try {
              const labelsResult = await getLabelsForFlashcard(flashcard.id);
              const labels =
                labelsResult
                  ?.map((item: any) => {
                    // Add null check for labels
                    if (!item || !item.labels) return null;

                    return {
                      id: String(item.labels.id || ""),
                      name: item.labels.name || "",
                      color: item.labels.color || "",
                    };
                  })
                  .filter(Boolean) || []; // Remove any null values

              // Get wrong answers for this flashcard
              const wrongAnswersResult = await getWrongAnswersByFlashcardId(
                flashcard.id
              );
              const wrongAnswers = wrongAnswersResult
                ? wrongAnswersResult.map((wa) => ({
                    id: String(wa.id),
                    flashcardId: String(wa.flashcardId),
                    text: wa.wrongAnswer2 || "",
                  }))
                : [];

              return {
                id: String(flashcard.id),
                question: flashcard.question || "",
                answer: flashcard.answer || "",
                groupId: String(flashcard.groupId || "0"),
                labels,
                wrongAnswers,
                createdAt: flashcard.createdAt,
                updatedAt: flashcard.updatedAt,
              };
            } catch (itemError) {
              console.error(
                `Error processing flashcard ${flashcard.id}:`,
                itemError
              );
              return null;
            }
          })
        );

        const validFlashcards = flashcardsWithLabels.filter(Boolean);
        console.log(
          `Processed ${validFlashcards.length} valid flashcards out of ${result.length}`
        );

        set({ flashcards: validFlashcards as Flashcard[] });
      } else {
        console.warn("No flashcards returned from getAllFlashcardTableData");
      }
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
      set({ flashcards: [] });
      throw error;
    }
  },

  fetchFlashcardById: async (id: number) => {
    try {
      const flashcard = await getFlashcardTableData(id);
      if (flashcard) {
        const labelsResult = await getLabelsForFlashcard(id);
        const labels =
          labelsResult?.map((item: any) => ({
            id: String(item.labels.id),
            name: item.labels.name,
            color: item.labels.color,
          })) || [];

        // Get wrong answers for this flashcard
        const wrongAnswersResult = await getWrongAnswersByFlashcardId(id);
        const wrongAnswers = wrongAnswersResult
          ? wrongAnswersResult.map((wa) => ({
              id: String(wa.id),
              flashcardId: String(wa.flashcardId),
              text: wa.wrongAnswer2 || "",
            }))
          : [];

        const flashcardWithLabels = {
          id: String(flashcard.id),
          question: flashcard.question,
          answer: flashcard.answer,
          groupId: String(flashcard.groupId),
          labels,
          wrongAnswers,
          createdAt: new Date(flashcard.createdAt),
          updatedBy: "user", // todo get username for it
        };

        set({ currentFlashcard: flashcardWithLabels });
      }
    } catch (error) {
      console.error("Failed to fetch flashcard by id:", error);
    }
  },

  getFlashcardsByGroupId: (groupId: string) => {
    return get().flashcards.filter((card) => card.groupId === groupId);
  },
}));
