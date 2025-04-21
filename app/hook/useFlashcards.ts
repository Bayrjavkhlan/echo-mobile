import { useState, useCallback, useEffect } from "react";
import {
  flashcardApi,
  Flashcard,
  CreateFlashcardDPO,
  UpdateFlashcardDPO,
  syncUnsavedChanges,
} from "../services/flashcardService";
import { useNetwork } from "@/context/NetworkContext";

export const useFlashcards = (groupId?: number) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const { isConnected } = useNetwork();
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = groupId
        ? await flashcardApi.getGroupFlashcards(groupId)
        : await flashcardApi.getAllFlashcards(skip, limit);
      setFlashcards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [groupId, skip, limit]);

  const createFlashcard = async (newFlashcard: CreateFlashcardDPO) => {
    try {
      setLoading(true);
      setError(null);
      const created = await flashcardApi.createFlashcard(newFlashcard);
      setFlashcards((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFlashcard = async (id: number, updates: UpdateFlashcardDPO) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await flashcardApi.updateFlashcard(id, updates);
      setFlashcards((prev) =>
        prev.map((card) => (card.id === id ? updated : card))
      );
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcard = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await flashcardApi.deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((card) => card.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete flashcard"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Manual sync function that can be triggered by a button
  const syncWithServer = async () => {
    if (!isConnected) {
      setError("Cannot sync: No internet connection");
      return;
    }

    try {
      setIsSyncing(true);
      setError(null);
      await syncUnsavedChanges();
      // After syncing, refresh the data
      await fetchFlashcards();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sync with server"
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Effect to detect when connection comes back online to trigger sync
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // When connection comes back, try to sync after a short delay
    if (isConnected) {
      timeout = setTimeout(() => {
        syncWithServer().catch(console.error);
      }, 2000); // Wait for 2 seconds after reconnection
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isConnected]);

  return {
    flashcards,
    loading,
    error,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    isConnected,
    syncWithServer,
    isSyncing,
  };
};
