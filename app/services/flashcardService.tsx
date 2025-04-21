import axios from "axios";
import { API_URL } from "../../config";
import { databaseApi } from "./databaseService";
import NetInfo from "@react-native-community/netinfo";

export interface Flashcard {
  id: number;
  group_id: number;
  question_type: string;
  answer: string;
  label: string;
  description: string;
}

export interface CreateFlashcardDPO {
  group_id: number;
  question_type: string;
  question: string;
  answer: string;
  label: string;
  description: string;
  label_ids: number[];
}

export interface UpdateFlashcardDPO {
  question_type: string;
  question: string;
  answer: string;
  label: string;
  description: string;
  label_ids: number[];
}

export interface FlashcardResponse {
  id: number;
  group_id: number;
}

// Helper to check network connection
const isNetworkConnected = async (): Promise<boolean> => {
  const networkState = await NetInfo.fetch();
  return networkState.isConnected ?? false;
};

// Helper to sync unsaved changes with server
export const syncUnsavedChanges = async (): Promise<void> => {
  try {
    const isConnected = await isNetworkConnected();

    if (!isConnected) {
      console.log("Cannot sync: No network connection");
      return;
    }

    const unsyncedFlashcards = await databaseApi.getUnsyncedFlashcards();
    console.log(`Found ${unsyncedFlashcards.length} unsynced flashcards`);

    for (const item of unsyncedFlashcards) {
      const { id, data } = item;

      try {
        // If it has a remote ID, update existing card on server
        if (data.remote_id) {
          const { question_type, question, answer, label, description } = data;
          const updateData = {
            question_type,
            question,
            answer,
            label,
            description,
            label_ids: [],
          };
          const result = await axios.put(
            `${API_URL}/flashcards/${data.remote_id}`,
            updateData
          );
          await databaseApi.markFlashcardAsSynced(id, data.remote_id);
        }
        // Otherwise create new card on server
        else {
          const {
            group_id,
            question_type,
            question,
            answer,
            label,
            description,
          } = data;
          const createData = {
            group_id,
            question_type,
            question,
            answer,
            label,
            description,
            label_ids: [],
          };
          const result = await axios.post(`${API_URL}/flashcards`, createData);
          await databaseApi.markFlashcardAsSynced(id, result.data.id);
        }
      } catch (error) {
        console.error(`Error syncing flashcard ${id}:`, error);
        // Continue with next item even if one fails
      }
    }
  } catch (error) {
    console.error("Error during sync process:", error);
  }
};

export const flashcardApi = {
  getAllFlashcards: async (
    skip: number,
    limit: number
  ): Promise<Flashcard[]> => {
    try {
      const isConnected = await isNetworkConnected();

      if (isConnected) {
        try {
          console.log("Fetching flashcards from server");
          const response = await axios.get(`${API_URL}/flashcards`);

          // Store fetched flashcards in local DB
          for (const flashcard of response.data) {
            await databaseApi.createFlashcard(
              {
                group_id: flashcard.group_id,
                question_type: flashcard.question_type,
                question: flashcard.question || "",
                answer: flashcard.answer,
                label: flashcard.label,
                description: flashcard.description,
                label_ids: [],
              },
              flashcard.id
            );
          }

          return response.data;
        } catch (error) {
          console.error(
            "Error fetching from server, falling back to local db:",
            error
          );
          return await databaseApi.getAllFlashcards();
        }
      } else {
        console.log("Offline mode: Fetching flashcards from local database");
        return await databaseApi.getAllFlashcards();
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      throw error;
    }
  },

  getFlashcardById: async (id: number): Promise<Flashcard[]> => {
    try {
      const isConnected = await isNetworkConnected();

      if (isConnected) {
        try {
          const response = await axios.get(`${API_URL}/flashcards/${id}`);
          return response.data;
        } catch (error) {
          console.error(
            "Error fetching from server, falling back to local db:",
            error
          );
          const flashcard = await databaseApi.getFlashcardById(id);
          return flashcard ? [flashcard] : [];
        }
      } else {
        console.log("Offline mode: Fetching flashcard from local database");
        const flashcard = await databaseApi.getFlashcardById(id);
        return flashcard ? [flashcard] : [];
      }
    } catch (error) {
      console.error("Error fetching flashcard by id:", error);
      throw error;
    }
  },

  getGroupFlashcards: async (group_id: number): Promise<Flashcard[]> => {
    try {
      const isConnected = await isNetworkConnected();

      if (isConnected) {
        try {
          const response = await axios.get(
            `${API_URL}/groups/${group_id}/flashcards`
          );

          // Store fetched flashcards in local DB
          for (const flashcard of response.data) {
            await databaseApi.createFlashcard(
              {
                group_id: flashcard.group_id,
                question_type: flashcard.question_type,
                question: flashcard.question || "",
                answer: flashcard.answer,
                label: flashcard.label,
                description: flashcard.description,
                label_ids: [],
              },
              flashcard.id
            );
          }

          return response.data;
        } catch (error) {
          console.error(
            "Error fetching from server, falling back to local db:",
            error
          );
          return await databaseApi.getGroupFlashcards(group_id);
        }
      } else {
        console.log(
          "Offline mode: Fetching group flashcards from local database"
        );
        return await databaseApi.getGroupFlashcards(group_id);
      }
    } catch (error) {
      console.error("Error fetching group flashcards:", error);
      throw error;
    }
  },

  createFlashcard: async (
    flashcard: CreateFlashcardDPO
  ): Promise<Flashcard> => {
    try {
      const isConnected = await isNetworkConnected();

      if (isConnected) {
        try {
          const response = await axios.post(`${API_URL}/flashcards`, flashcard);

          // Store in local database as synced
          await databaseApi.createFlashcard(flashcard, response.data.id);

          return response.data;
        } catch (error) {
          console.error(
            "Error creating on server, saving locally only:",
            error
          );
          return await databaseApi.createFlashcard(flashcard);
        }
      } else {
        console.log("Offline mode: Creating flashcard in local database only");
        return await databaseApi.createFlashcard(flashcard);
      }
    } catch (error) {
      console.error("Error creating flashcard:", error);
      throw error;
    }
  },

  updateFlashcard: async (
    id: number,
    flashcard: UpdateFlashcardDPO
  ): Promise<Flashcard> => {
    try {
      const isConnected = await isNetworkConnected();

      if (isConnected) {
        try {
          const response = await axios.put(
            `${API_URL}/flashcards/${id}`,
            flashcard
          );

          // Update local database
          await databaseApi.updateFlashcard(id, flashcard);

          return response.data;
        } catch (error) {
          console.error(
            "Error updating on server, updating locally only:",
            error
          );
          return await databaseApi.updateFlashcard(id, flashcard);
        }
      } else {
        console.log("Offline mode: Updating flashcard in local database only");
        return await databaseApi.updateFlashcard(id, flashcard);
      }
    } catch (error) {
      console.error("Error updating flashcard:", error);
      throw error;
    }
  },

  deleteFlashcard: async (id: number): Promise<void> => {
    try {
      const isConnected = await isNetworkConnected();

      if (isConnected) {
        try {
          await axios.delete(`${API_URL}/flashcards/${id}`);
        } catch (error) {
          console.error("Error deleting from server:", error);
        }
      }

      // Always delete from local database
      return await databaseApi.deleteFlashcard(id);
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      throw error;
    }
  },

  // Try to sync any pending changes
  syncChanges: async (): Promise<void> => {
    return syncUnsavedChanges();
  },
};
