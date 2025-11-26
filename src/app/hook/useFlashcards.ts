// import { useState, useCallback } from "react";
// import {
//   flashcardApi,
//   Flashcard,
//   CreateFlashcardDPO,
//   UpdateFlashcardDPO,
// } from "../services/flashcardService";

// export const useFlashcards = (groupId?: number) => {
//   const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [skip, setSkip] = useState(0);
//   const [limit, setLimit] = useState(10);

//   const fetchFlashcards = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = groupId
//         ? await flashcardApi.getGroupFlashcards(groupId)
//         : await flashcardApi.getAllFlashcards(skip, limit);
//       setFlashcards(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }, [groupId]);

//   const createFlashcard = async (newFlashcard: CreateFlashcardDPO) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const created = await flashcardApi.createFlashcard(newFlashcard);
//       setFlashcards((prev) => [...prev, created]);
//       return created;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateFlashcard = async (id: number, updates: UpdateFlashcardDPO) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const updated = await flashcardApi.updateFlashcard(id, updates);
//       setFlashcards((prev) =>
//         prev.map((card) => (card.id === id ? updated : card))
//       );
//       return updated;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteFlashcard = async (id: number) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await flashcardApi.deleteFlashcard(id);
//       setFlashcards((prev) => prev.filter((card) => card.id !== id));
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to delete flashcard"
//       );
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     flashcards,
//     loading,
//     error,
//     fetchFlashcards,
//     createFlashcard,
//     updateFlashcard,
//     deleteFlashcard,
//   };
// };
