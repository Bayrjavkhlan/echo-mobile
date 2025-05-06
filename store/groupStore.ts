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
import { getWrongAnswersByFlashcardId } from "@/db/crud/wrongAnswers";
import { WrongAnswer } from "./wrongAnswerStore";

// This type is for the labels in a group summary
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
  allGroups: FlashcardGroup[];
  currentGroup: FlashcardGroup | null;
  fetchGroups: () => Promise<void>;
  fetchGroupById: (id: string) => Promise<void>;
  fetchGroupByLabel: (label: string) => Promise<void>;
  addGroup: (
    group: { id: number; name: string; description: string },
    flashcardsWithLabels: Flashcard[]
  ) => void;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  currentGroup: null,
  allGroups: [],
  fetchGroups: async () => {
    console.log("fetchGroups started");
    try {
      const groupsResult = await getAllGroupTableData();
      console.log("groupResult", groupsResult);
      const flashcardsResult = await getAllFlashcardTableData();
      console.log("flashcardsResult", flashcardsResult);
      const allFlashcardLabelsResult = await getAllFlashcardLabelsTableData();
      console.log(
        "All flashcard-label relationships:",
        allFlashcardLabelsResult
      );

      if (!groupsResult || !flashcardsResult) {
        console.warn("Failed to fetch groups or flashcards data");
        return;
      }

      if (groupsResult && flashcardsResult) {
        // Get all labels data to ensure we have complete label information
        const allLabelsResult = await getAllLabelTableData();
        console.log("All labels:", allLabelsResult);

        // Create a map of labelId -> label for quick lookups
        const labelsMap = new Map();
        if (allLabelsResult) {
          allLabelsResult.forEach((label) => {
            labelsMap.set(label.id, {
              id: String(label.id),
              name: label.name,
              text: label.name, // Add text for compatibility
            });
          });
        }

        console.log("Labels map:", Object.fromEntries(labelsMap));

        // Create a map of flashcardId -> labels[] using the flashcardLabels table
        const flashcardLabelsMap = new Map();
        if (allFlashcardLabelsResult) {
          allFlashcardLabelsResult.forEach((relation) => {
            const flashcardId = relation.flashcardId;
            const labelId = relation.labelId;

            // Check if we have valid data
            if (flashcardId === undefined || labelId === undefined) {
              console.warn("Invalid relation data:", relation);
              return;
            }

            const label = labelsMap.get(labelId);

            if (!label) {
              console.warn(`Label with ID ${labelId} not found in labels map`);
              return;
            }

            // Ensure the flashcardId key exists in the map
            if (!flashcardLabelsMap.has(flashcardId)) {
              flashcardLabelsMap.set(flashcardId, []);
            }

            // Add the label to the flashcard's labels array
            flashcardLabelsMap.get(flashcardId).push(label);
          });
        }

        console.log(
          "Flashcard-labels map:",
          Object.fromEntries(flashcardLabelsMap)
        );

        // Group flashcards by their groupId
        const flashcardsByGroup = new Map();

        // Process each flashcard and add it to the appropriate group
        await Promise.all(
          flashcardsResult.map(async (flashcard) => {
            if (!flashcard || !flashcard.id) {
              console.warn("Invalid flashcard data:", flashcard);
              return;
            }

            try {
              // Get labels for this flashcard from our map
              const labels = flashcardLabelsMap.get(flashcard.id) || [];
              console.log(`Labels for flashcard ${flashcard.id}:`, labels);

              // Get wrong answers for this flashcard
              const wrongAnswersResult = await getWrongAnswersByFlashcardId(
                flashcard.id
              );
              const wrongAnswers: WrongAnswer[] = wrongAnswersResult
                ? wrongAnswersResult.map((wa) => ({
                    id: String(wa.id),
                    flashcardId: String(wa.flashcardId),
                    text: wa.wrongAnswer2 || "",
                  }))
                : [];

              // Create a processed flashcard with its labels and wrong answers
              const processedFlashcard = {
                id: String(flashcard.id),
                question: flashcard.question || "",
                answer: flashcard.answer || "",
                groupId: String(flashcard.groupId),
                labels,
                wrongAnswers,
                createdAt: flashcard.createdAt,
                updatedAt: new Date(flashcard.createdAt || Date.now()),
              };

              // Add the flashcard to its group
              const groupId = String(flashcard.groupId);
              if (!flashcardsByGroup.has(groupId)) {
                flashcardsByGroup.set(groupId, []);
              }
              flashcardsByGroup.get(groupId).push(processedFlashcard);
            } catch (err) {
              console.error(`Error processing flashcard ${flashcard.id}:`, err);
            }
          })
        );

        // Process each group to create the final structure
        const mappedGroups: FlashcardGroup[] = groupsResult
          .map((group: any): FlashcardGroup | null => {
            if (!group || !group.id) {
              console.warn("Invalid group data:", group);
              return null;
            }

            const groupId = String(group.id);
            const groupFlashcards = flashcardsByGroup.get(groupId) || [];

            // Reset label frequency map for each group
            const labelFrequencyMap = new Map<
              string,
              { id: string; text: string; count: number }
            >();

            // Process labels from this group's flashcards only
            groupFlashcards.forEach((flashcard: Flashcard) => {
              if (flashcard.labels && Array.isArray(flashcard.labels)) {
                flashcard.labels.forEach((label) => {
                  if (!label || !label.id) {
                    return; // Skip invalid labels
                  }

                  const labelId = String(label.id);
                  const existing = labelFrequencyMap.get(labelId);

                  if (existing) {
                    existing.count += 1;
                  } else {
                    labelFrequencyMap.set(labelId, {
                      id: labelId,
                      text: label.text || label.name || "Unknown",
                      count: 1,
                    });
                  }
                });
              }
            });

            // Convert to array and sort by frequency descending
            const sortedLabels = Array.from(labelFrequencyMap.values()).sort(
              (a, b) => b.count - a.count
            );

            console.log(`Labels for group ${groupId}:`, sortedLabels);

            // Create the group object with its processed flashcards and labels
            return {
              id: groupId,
              title: group.name || "Unnamed Group",
              description: group.description || "",
              cardCount: groupFlashcards.length,
              labels: sortedLabels,
              flashcards: groupFlashcards,
            };
          })
          .filter((group): group is FlashcardGroup => group !== null); // Type-safe filter to remove nulls

        console.log("mappedGroups:\t", mappedGroups.length, "groups processed");
        set({
          groups: mappedGroups,
          allGroups: mappedGroups, // Store the complete list of groups
        });
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

  fetchGroupByLabel: async (label: string) => {
    try {
      // Store or retrieve the full set of groups
      let allGroups = get().allGroups;

      if (allGroups.length === 0) {
        // If we don't have any groups yet, fetch them first
        await get().fetchGroups();
        // Get the updated all groups
        allGroups = get().allGroups;
      }

      // If label is empty, reset to show all groups
      if (!label || label.trim() === "") {
        set({ groups: [...allGroups] });
        return;
      }

      console.log(`Filtering groups by label: ${label}`);

      // Filter groups that have the selected label
      const filteredGroups = allGroups.filter((group) =>
        group.labels.some(
          (labelObj) =>
            String(labelObj.id) === String(label) ||
            labelObj.text.toLowerCase() === label.toLowerCase()
        )
      );

      console.log(`Found ${filteredGroups.length} groups with label ${label}`);

      // Update only the displayed groups, keeping the full list in allGroups
      set({ groups: filteredGroups });
    } catch (error) {
      console.error("Failed to filter groups by label:", error);
    }
  },

  addGroup: (group, flashcardsInput) => {
    try {
      console.log("Adding group to store:", group);

      // Ensure we have valid flashcards with proper label structure
      const flashcards = flashcardsInput.map((flashcard) => {
        // Create a map to deduplicate labels by ID
        const uniqueLabelsMap = new Map();

        // Process and deduplicate labels
        if (Array.isArray(flashcard.labels)) {
          flashcard.labels.forEach((label) => {
            if (label && label.id) {
              const labelId = String(label.id);
              uniqueLabelsMap.set(labelId, {
                id: labelId,
                name: label.name || label.text || "Unknown",
                text: label.text || label.name || "Unknown",
              });
            }
          });
        }

        // Convert map back to array
        const uniqueLabels = Array.from(uniqueLabelsMap.values());

        // Keep wrong answers as they are
        const wrongAnswers = flashcard.wrongAnswers || [];

        return {
          ...flashcard,
          // Replace labels with deduplicated ones
          labels: uniqueLabels,
          wrongAnswers,
        };
      });

      // Log the processed flashcards with their labels
      flashcards.forEach((flashcard, index) => {
        console.log(
          `Flashcard ${index + 1} processed labels:`,
          flashcard.labels.map((l) => `${l.id}: ${l.name || l.text}`)
        );
        if (flashcard.wrongAnswers && flashcard.wrongAnswers.length > 0) {
          console.log(
            `Flashcard ${index + 1} has ${
              flashcard.wrongAnswers.length
            } wrong answers`
          );
        }
      });

      // Build a frequency map of labels for this group
      const labelFrequencyMap = new Map<
        string,
        LabelType & { count: number }
      >();

      // Process each flashcard's labels to build the frequency map
      flashcards.forEach((flashcard) => {
        if (!flashcard.labels) return;

        flashcard.labels.forEach((label) => {
          if (!label || !label.id) return;

          const labelId = String(label.id);
          const existing = labelFrequencyMap.get(labelId);

          if (existing) {
            existing.count += 1;
          } else {
            // Use text property if available, otherwise use name
            const labelText = label.text || label.name;

            labelFrequencyMap.set(labelId, {
              id: labelId,
              text: labelText,
              count: 1,
            });
          }
        });
      });

      // Sort labels by frequency
      const sortedLabels = Array.from(labelFrequencyMap.values())
        .sort((a, b) => b.count - a.count)
        .map(({ id, text }) => ({ id, text })); // Remove the count property for final output

      console.log("Processed labels for new group:", sortedLabels);

      // Create the new group
      const newGroup: FlashcardGroup = {
        id: String(group.id),
        title: group.name,
        description: group.description || "",
        cardCount: flashcards.length,
        labels: sortedLabels,
        flashcards: flashcards as Flashcard[],
      };

      // Update both the groups and allGroups arrays
      set((state) => {
        console.log("Current groups in store:", state.groups.length);
        const newGroups = [...state.groups, newGroup];
        const newAllGroups = [...state.allGroups, newGroup];
        console.log("New groups count:", newGroups.length);
        return {
          groups: newGroups,
          allGroups: newAllGroups,
        };
      });

      console.log(
        "Group added to store with",
        sortedLabels.length,
        "unique labels"
      );
    } catch (error) {
      console.error("Failed to add group to store:", error);
    }
  },
}));
