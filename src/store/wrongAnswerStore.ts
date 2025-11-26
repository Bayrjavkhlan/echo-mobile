// import { create } from "zustand";
// import {
//   getAllWrongAnswerTableData,
//   getWrongAnswerTableDataByFlashcardId,
//   createWrongAnswerTableData,
//   createManyWrongAnswerTableData,
//   updateWrongAnswerTableData,
//   deleteWrongAnswerTableData,
// } from "@/db/crud/wrongAnswers";

// export type WrongAnswer = {
//   id: string;
//   flashcardId: string;
//   text: string;
// };

// interface WrongAnswerStore {
//   wrongAnswers: Record<string, WrongAnswer[]>; // Maps flashcardId -> array of wrong answers
//   fetchAllWrongAnswers: () => Promise<void>;
//   fetchWrongAnswersForFlashcard: (
//     flashcardId: string | number
//   ) => Promise<WrongAnswer[]>;
//   addWrongAnswer: (wrongAnswer: {
//     flashcardId: number;
//     text: string;
//   }) => Promise<WrongAnswer | null>;
//   addMultipleWrongAnswers: (
//     wrongAnswers: { flashcardId: number; text: string }[]
//   ) => Promise<WrongAnswer[] | null>;
//   updateWrongAnswer: (
//     id: string | number,
//     text: string
//   ) => Promise<WrongAnswer | null>;
//   deleteWrongAnswer: (id: string | number) => Promise<void>;
// }

// export const useWrongAnswerStore = create<WrongAnswerStore>((set, get) => ({
//   wrongAnswers: {},

//   fetchAllWrongAnswers: async () => {
//     try {
//       const wrongAnswersResult = await getAllWrongAnswerTableData();
//       if (wrongAnswersResult) {
//         // Organize wrong answers by flashcard ID
//         const wrongAnswersByFlashcard: Record<string, WrongAnswer[]> = {};

//         wrongAnswersResult.forEach((wrongAnswer) => {
//           if (!wrongAnswer || !wrongAnswer.flashcardId) return;

//           const flashcardId = String(wrongAnswer.flashcardId);
//           const processedWrongAnswer: WrongAnswer = {
//             id: String(wrongAnswer.id),
//             flashcardId,
//             text: wrongAnswer.wrongText || "",
//           };

//           if (!wrongAnswersByFlashcard[flashcardId]) {
//             wrongAnswersByFlashcard[flashcardId] = [];
//           }
//           wrongAnswersByFlashcard[flashcardId].push(processedWrongAnswer);
//         });

//         set({ wrongAnswers: wrongAnswersByFlashcard });
//         console.log(
//           "Fetched all wrong answers",
//           Object.keys(wrongAnswersByFlashcard).length
//         );
//       }
//     } catch (error) {
//       console.log("Failed to fetch all wrong answers:", error);
//     }
//   },

//   fetchWrongAnswersForFlashcard: async (flashcardId) => {
//     try {
//       const numericFlashcardId =
//         typeof flashcardId === "string"
//           ? parseInt(flashcardId, 10)
//           : flashcardId;

//       if (isNaN(numericFlashcardId)) {
//         console.log("Invalid flashcard ID:", flashcardId);
//         return [];
//       }

//       const wrongAnswersResult = await getWrongAnswerTableDataByFlashcardId(
//         numericFlashcardId
//       );

//       if (!wrongAnswersResult) {
//         return [];
//       }

//       const processedWrongAnswers: WrongAnswer[] = wrongAnswersResult.map(
//         (wrongAnswer) => ({
//           id: String(wrongAnswer.id),
//           flashcardId: String(wrongAnswer.flashcardId),
//           text: wrongAnswer.wrongText || "",
//         })
//       );

//       // Update store with these answers
//       set((state) => {
//         const newWrongAnswers = { ...state.wrongAnswers };
//         newWrongAnswers[String(flashcardId)] = processedWrongAnswers;
//         return { wrongAnswers: newWrongAnswers };
//       });

//       return processedWrongAnswers;
//     } catch (error) {
//       console.log(
//         `Failed to fetch wrong answers for flashcard ${flashcardId}:`,
//         error
//       );
//       return [];
//     }
//   },

//   addWrongAnswer: async (wrongAnswer) => {
//     try {
//       const result = await createWrongAnswerTableData({
//         flashcardId: wrongAnswer.flashcardId,
//         wrongText: wrongAnswer.text,
//       });

//       if (result) {
//         const newWrongAnswer: WrongAnswer = {
//           id: String(result.id),
//           flashcardId: String(result.flashcardId),
//           text: result.wrongText || "",
//         };

//         // Update the store
//         set((state) => {
//           const newWrongAnswers = { ...state.wrongAnswers };
//           const flashcardId = String(wrongAnswer.flashcardId);

//           if (!newWrongAnswers[flashcardId]) {
//             newWrongAnswers[flashcardId] = [];
//           }

//           newWrongAnswers[flashcardId].push(newWrongAnswer);
//           return { wrongAnswers: newWrongAnswers };
//         });

//         return newWrongAnswer;
//       }
//       return null;
//     } catch (error) {
//       console.log("Failed to add wrong answer:", error);
//       return null;
//     }
//   },

//   addMultipleWrongAnswers: async (wrongAnswers) => {
//     try {
//       const dbWrongAnswers = wrongAnswers.map((wa) => ({
//         flashcardId: wa.flashcardId,
//         wrongText: wa.text,
//       }));

//       const results = await createManyWrongAnswerTableData(dbWrongAnswers);

//       if (results) {
//         const processedWrongAnswers: WrongAnswer[] = results.map((result) => ({
//           id: String(result.id),
//           flashcardId: String(result.flashcardId),
//           text: result.wrongText || "",
//         }));

//         // Update the store
//         set((state) => {
//           const newWrongAnswers = { ...state.wrongAnswers };

//           processedWrongAnswers.forEach((wrongAnswer) => {
//             const flashcardId = wrongAnswer.flashcardId;

//             if (!newWrongAnswers[flashcardId]) {
//               newWrongAnswers[flashcardId] = [];
//             }

//             newWrongAnswers[flashcardId].push(wrongAnswer);
//           });

//           return { wrongAnswers: newWrongAnswers };
//         });

//         return processedWrongAnswers;
//       }
//       return null;
//     } catch (error) {
//       console.log("Failed to add multiple wrong answers:", error);
//       return null;
//     }
//   },

//   updateWrongAnswer: async (id, text) => {
//     try {
//       const numericId = typeof id === "string" ? parseInt(id, 10) : id;

//       if (isNaN(numericId)) {
//         console.log("Invalid wrong answer ID:", id);
//         return null;
//       }

//       const result = await updateWrongAnswerTableData(numericId, {
//         wrongText: text,
//       });

//       if (result) {
//         const updatedWrongAnswer: WrongAnswer = {
//           id: String(result.id),
//           flashcardId: String(result.flashcardId),
//           text: result.wrongText || "",
//         };

//         // Update the store
//         set((state) => {
//           const newWrongAnswers = { ...state.wrongAnswers };
//           const flashcardId = String(result.flashcardId);

//           if (newWrongAnswers[flashcardId]) {
//             newWrongAnswers[flashcardId] = newWrongAnswers[flashcardId].map(
//               (wa) => (wa.id === String(id) ? updatedWrongAnswer : wa)
//             );
//           }

//           return { wrongAnswers: newWrongAnswers };
//         });

//         return updatedWrongAnswer;
//       }
//       return null;
//     } catch (error) {
//       console.log(`Failed to update wrong answer with id ${id}:`, error);
//       return null;
//     }
//   },

//   deleteWrongAnswer: async (id) => {
//     try {
//       const numericId = typeof id === "string" ? parseInt(id, 10) : id;

//       if (isNaN(numericId)) {
//         console.log("Invalid wrong answer ID:", id);
//         return;
//       }

//       const result = await deleteWrongAnswerTableData(numericId);

//       if (result) {
//         // Update the store by removing this wrong answer
//         set((state) => {
//           const newWrongAnswers = { ...state.wrongAnswers };
//           const flashcardId = String(result.flashcardId);

//           if (newWrongAnswers[flashcardId]) {
//             newWrongAnswers[flashcardId] = newWrongAnswers[flashcardId].filter(
//               (wa) => wa.id !== String(id)
//             );

//             // If there are no more wrong answers for this flashcard, remove the key
//             if (newWrongAnswers[flashcardId].length === 0) {
//               delete newWrongAnswers[flashcardId];
//             }
//           }

//           return { wrongAnswers: newWrongAnswers };
//         });
//       }
//     } catch (error) {
//       console.log(`Failed to delete wrong answer with id ${id}:`, error);
//     }
//   },
// }));
