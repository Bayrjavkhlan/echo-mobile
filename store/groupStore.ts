import { create } from "zustand";
import { getAllGroupTableData } from "@/db/crud/group";
import {
  getAllFlashcardLabelsTableData,
  getLabelsForFlashcard,
} from "@/db/crud/flashcardLabels";
import { Flashcard } from "./flashcardStore";
import { getAllFlashcardTableData } from "@/db/crud/flashcards";
import { groupsTable } from "@/db/schema";
import { getAllLabelTableData } from "@/db/crud/labels";

export type LabelType = {
  id: string;
  text: string;
};

export type FlashcardGroup = {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  labels: LabelType[];
  flashcards: Flashcard[];
};

interface GroupStore {
  groups: FlashcardGroup[];
  currentGroup: FlashcardGroup | null;
  fetchGroups: () => Promise<void>;
  fetchGroupById: (id: string) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  currentGroup: null,
  //   fetchGroups: async () => {
  //     console.log("fetch group ajilsan");
  //     try {
  //       const allGroupResult = await getAllGroupTableData();
  //       const allFlashcardResult = await getAllFlashcardTableData();
  //       const allLabelsResult = await getAllLabelTableData(); // Not needed unless used elsewhere
  //       const allFlashcardLabelsResult = await getAllFlashcardLabelsTableData();

  //       // Create a map of flashcardId -> labels[]
  //       const flashcardLabelMap: Record<number, any[]> = {};

  //       allFlashcardLabelsResult?.forEach((entry) => {
  //         if (!flashcardLabelMap[entry.flashcardId]) {
  //           flashcardLabelMap[entry.flashcardId] = [];
  //         }
  //         flashcardLabelMap[entry.flashcardId].push(entry.labelId);
  //       });

  //       // Add labels to each flashcard
  //       const flashcardsWithLabels = allFlashcardResult?.map((card) => ({
  //         ...card,
  //         labels: flashcardLabelMap[card.id] || [],
  //       }));

  //       // Group flashcards under their groups
  //       const groupedData = allGroupResult?.map((group) => ({
  //         ...group,
  //         flashcards: flashcardsWithLabels?.filter(
  //           (card) => card.groupId === group.id
  //         ),
  //       }));

  //       console.log("Grouped Result:\t", JSON.stringify(groupedData, null, 2));

  //       // Save to store if needed
  //       // set({ groups: groupedData });
  //     } catch (error) {
  //       console.error("error:", error);
  //     }
  //   },

  fetchGroups: async () => {
    console.log("fetch group ajilsan");
    try {
      const groupsResult = await getAllGroupTableData();
      console.log("groupResult", groupsResult);
      const flashcardsResult = await getAllFlashcardTableData();
      console.log("flashcardsResult", flashcardsResult);
      if (groupsResult && flashcardsResult) {
        const flashcardsByGroup = new Map();

        await Promise.all(
          flashcardsResult.map(async (flashcard: any) => {
            const labelsResult = await getLabelsForFlashcard(flashcard.id);
            console.log(
              "labelsResult for flashcard",
              flashcard.id,
              labelsResult
            );

            const labels =
              labelsResult?.map((item: any) => ({
                id: String(item.labels.id),
                name: item.labels.name,
              })) || [];
            console.log("store labels:", labels);

            const processedFlashcard = {
              id: String(flashcard.id),
              question: flashcard.question,
              answer: flashcard.answer,
              groupId: String(flashcard.groupId),
              labels,
              createdAt: flashcard.createdAt,
              updatedAt: flashcard.updatedAt,
            };

            const groupId = String(flashcard.groupId);
            if (!flashcardsByGroup.has(groupId)) {
              flashcardsByGroup.set(groupId, []);
            }
            flashcardsByGroup.get(groupId).push(processedFlashcard);
          })
        );

        const mappedGroups = groupsResult.map((group: any) => {
          const groupId = String(group.id);
          const groupFlashcards = flashcardsByGroup.get(groupId) || [];

          const labelFrequencyMap = new Map<
            string,
            { id: string; text: string; count: number }
          >();

          groupFlashcards.forEach((flashcard: Flashcard) => {
            flashcard.labels.forEach((label) => {
              const existing = labelFrequencyMap.get(label.id);
              if (existing) {
                existing.count += 1;
              } else {
                labelFrequencyMap.set(label.id, {
                  id: label.id,
                  text: label.name,
                  count: 1,
                });
              }
            });
          });

          // Convert to array and sort by frequency descending
          const sortedLabels = Array.from(labelFrequencyMap.values()).sort(
            (a, b) => b.count - a.count
          );

          return {
            id: groupId,
            title: group.name,
            description: group.description || "",
            cardCount: groupFlashcards.length,
            labels: sortedLabels,
            flashcards: groupFlashcards,
          };
        });

        set({ groups: mappedGroups });
      }
    } catch (error) {
      console.error("Failed to fetch groups with flashcards:", error);
    }
  },

  fetchGroupById: async (id: string) => {
    try {
      const groups = get().groups;
      const group = groups.find((g) => g.id === id);

      if (group) {
        set({ currentGroup: group });
      } else {
        console.log("Group not found in store");
      }
    } catch (error) {
      console.error("Failed to fetch group by id:", error);
    }
  },
}));
