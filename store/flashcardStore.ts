import { create } from "zustand";

import { getLabelsForFlashcard } from "@/app/db/crud/flashcardLabels";
import {
  getAllFlashcardTableData,
  getFlashcardTableData,
} from "@/app/db/crud/flashcards";

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  groupId: string;
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
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
        const flashcardsWithLabels = await Promise.all(
          result.map(async (flashcard: any) => {
            const labelsResult = await getLabelsForFlashcard(flashcard.id);
            const labels =
              labelsResult?.map((item: any) => ({
                id: String(item.labels.id),
                name: item.labels.name,
                color: item.labels.color,
              })) || [];

            return {
              id: String(flashcard.id),
              question: flashcard.question,
              answer: flashcard.answer,
              groupId: String(flashcard.groupId),
              labels,
              createdAt: flashcard.createdAt,
              updatedAt: flashcard.updatedAt,
            };
          })
        );

        set({ flashcards: flashcardsWithLabels });
      }
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
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

        const flashcardWithLabels = {
          id: String(flashcard.id),
          question: flashcard.question,
          answer: flashcard.answer,
          groupId: String(flashcard.groupId),
          labels,
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
